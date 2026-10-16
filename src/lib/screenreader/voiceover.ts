import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { VoiceOverPlatformStatus, SpeechCaptureState } from "./types";

export interface SpeechCaptureResult {
  state: SpeechCaptureState;
  capturedText: string | null;
  detail: string;
}

const execAsync = promisify(exec);

/**
 * Investigates the host platform and checks for native macOS VoiceOver automation capability.
 * 
 * Technical Implementation:
 * - On macOS ('darwin'), queries System Events via osascript to detect if the VoiceOver process is active.
 * - If active, attempts to query the VoiceOver Caption Window or speech buffer.
 * - On non-macOS (Windows/Linux), reports accurately that native macOS VoiceOver automation is platform-gated,
 *   and activates the Accessibility Tree & Expected Announcement Inspector without faking speech results.
 */
export async function getVoiceOverPlatformStatus(): Promise<VoiceOverPlatformStatus> {
  const isMacOS = process.platform === "darwin";

  if (!isMacOS) {
    return {
      isMacOS: false,
      osPlatform: process.platform,
      voiceOverRunning: false,
      automationAvailable: false,
      captureMethod: "unsupported-platform",
      message: `Host operating system is '${process.platform}'. Native Apple VoiceOver integration requires macOS (Darwin) with Accessibility TCC entitlements. Expected announcements and Accessibility Tree nodes are evaluated; auditory output requires macOS or manual assistive-tech testing.`,
      permissionsGranted: false,
      supportedEnvironments: "macOS Sonoma (14.x) / Sequoia (15.x) with Terminal or Node.js enabled in System Settings > Privacy & Security > Accessibility.",
    };
  }

  // Running on macOS ('darwin')
  try {
    // Check if VoiceOver process is running
    const { stdout: processCheck } = await execAsync(
      `osascript -e 'tell application "System Events" to (name of processes) contains "VoiceOver"'`,
      { timeout: 3000 }
    );

    const isRunning = processCheck.trim().toLowerCase() === "true";

    if (!isRunning) {
      return {
        isMacOS: true,
        osPlatform: "darwin",
        voiceOverRunning: false,
        automationAvailable: false,
        captureMethod: "manual-only",
        message: "macOS detected, but Apple VoiceOver is currently turned OFF. Toggle VoiceOver on via Command + F5 to enable auditory reading.",
        permissionsGranted: true,
        supportedEnvironments: "macOS (Safari / Chromium) with VoiceOver running (Cmd + F5).",
      };
    }

    // VoiceOver is running: verify accessibility permissions to read caption window
    try {
      const { stdout: captionCheck } = await execAsync(
        `osascript -e '
          tell application "System Events"
            tell process "VoiceOver"
              try
                set captionWin to window "VoiceOver Caption"
                set captionText to value of static text 1 of captionWin
                return captionText
              on error
                return "ACTIVE_NO_CAPTION"
              end try
            end tell
          end tell
        '`,
        { timeout: 3000 }
      );

      const captured = captionCheck.trim();
      const hasCaption = captured !== "" && captured !== "ACTIVE_NO_CAPTION";

      return {
        isMacOS: true,
        osPlatform: "darwin",
        voiceOverRunning: true,
        automationAvailable: true,
        captureMethod: hasCaption ? "osascript-caption-window" : "accessibility-api",
        message: hasCaption
          ? "Apple VoiceOver is active with Caption Window inspection enabled."
          : "Apple VoiceOver is active. (Tip: Enable 'Show Caption Panel' in VoiceOver Utility > Visuals to capture visual speech transcript).",
        permissionsGranted: true,
        supportedEnvironments: "macOS 14+ / Safari & Chrome with VoiceOver Utility Caption Panel.",
      };
    } catch (permError: unknown) {
      const errStr = String(permError);
      const isPermissionDenied =
        errStr.includes("not allowed to send keystrokes") ||
        errStr.includes("Not authorized") ||
        errStr.includes("(-1743)");

      return {
        isMacOS: true,
        osPlatform: "darwin",
        voiceOverRunning: true,
        automationAvailable: false,
        captureMethod: "manual-only",
        message: isPermissionDenied
          ? "VoiceOver is active, but Terminal/Node lacks macOS Accessibility permissions. Grant permission in System Settings > Privacy & Security > Accessibility."
          : `VoiceOver automation query error: ${errStr.slice(0, 100)}`,
        permissionsGranted: !isPermissionDenied,
        supportedEnvironments: "macOS with granted TCC Accessibility permissions.",
      };
    }
  } catch (error: unknown) {
    return {
      isMacOS: true,
      osPlatform: "darwin",
      voiceOverRunning: false,
      automationAvailable: false,
      captureMethod: "manual-only",
      message: `Failed to inspect VoiceOver process: ${String(error).slice(0, 100)}`,
      permissionsGranted: false,
      supportedEnvironments: "macOS",
    };
  }
}

/**
 * Attempts to capture the latest VoiceOver announcement via macOS Caption Window.
 * 
 * Policy & Architecture:
 * - Distinguishes between unavailable platforms, missing VoiceOver process, closed caption panels, and genuine capture.
 * - Returns explicit capture states: 'UNAVAILABLE', 'MANUAL_VERIFICATION_REQUIRED', 'CAPTURED', or 'CAPTURE_FAILED'.
 * - Never fabricates or hallucinates speech output.
 */
export async function captureCurrentVoiceOverSpeech(): Promise<SpeechCaptureResult> {
  if (process.platform !== "darwin") {
    return {
      state: "UNAVAILABLE",
      capturedText: null,
      detail: `Host platform '${process.platform}' does not support Apple VoiceOver. Auditory screen-reader evaluation requires macOS (VoiceOver) or Windows (NVDA/JAWS).`,
    };
  }

  try {
    // Check if VoiceOver is running
    const { stdout: runningCheck } = await execAsync(
      `osascript -e 'tell application "System Events" to (name of processes) contains "VoiceOver"'`,
      { timeout: 2000 }
    );
    if (runningCheck.trim().toLowerCase() !== "true") {
      return {
        state: "UNAVAILABLE",
        capturedText: null,
        detail: "macOS VoiceOver process is not currently running. Toggle VoiceOver on via Command + F5.",
      };
    }

    // Query caption window
    try {
      const { stdout } = await execAsync(
        `osascript -e '
          tell application "System Events"
            tell process "VoiceOver"
              try
                set captionWin to window "VoiceOver Caption"
                return value of static text 1 of captionWin
              on error errMsg
                return "ERR_NO_CAPTION:" & errMsg
              end try
            end tell
          end tell
        '`,
        { timeout: 2500 }
      );

      const output = stdout.trim();
      if (output.startsWith("ERR_NO_CAPTION:")) {
        return {
          state: "MANUAL_VERIFICATION_REQUIRED",
          capturedText: null,
          detail: "VoiceOver is running, but the Caption Panel is closed or inaccessible. Manual ear verification required (or enable Caption Panel in VoiceOver Utility > Visuals).",
        };
      }

      if (output.length > 0) {
        return {
          state: "CAPTURED",
          capturedText: output,
          detail: "Successfully captured live caption text from macOS VoiceOver Caption Window.",
        };
      }

      return {
        state: "MANUAL_VERIFICATION_REQUIRED",
        capturedText: null,
        detail: "VoiceOver caption window returned empty text. Ear verification required.",
      };
    } catch (osErr: unknown) {
      const errStr = String(osErr);
      const isPermDenied =
        errStr.includes("-1743") ||
        errStr.includes("Not authorized") ||
        errStr.includes("not allowed to send keystrokes");

      return {
        state: "CAPTURE_FAILED",
        capturedText: null,
        detail: isPermDenied
          ? "macOS TCC permission denied: Terminal/Node is not authorized to control VoiceOver in System Settings > Privacy & Security > Accessibility."
          : `Failed to query VoiceOver AppleScript: ${errStr.slice(0, 100)}`,
      };
    }
  } catch (procErr: unknown) {
    return {
      state: "CAPTURE_FAILED",
      capturedText: null,
      detail: `Process inspection error: ${String(procErr).slice(0, 100)}`,
    };
  }
}
