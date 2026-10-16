import { describe, it, expect } from "vitest";
import {
  getAllScenarios,
  getScenarioById,
  SCREEN_READER_SCENARIOS,
} from "../lib/screenreader/scenarios";
import { getVoiceOverPlatformStatus } from "../lib/screenreader/voiceover";

describe("Screen Reader Testing Workbench — Scenarios & Platform Layer", () => {
  it("provides comprehensive scenarios covering required WCAG interaction patterns", () => {
    const scenarios = getAllScenarios();
    expect(scenarios.length).toBeGreaterThanOrEqual(7);

    const scenarioIds = scenarios.map((s) => s.id);
    expect(scenarioIds).toContain("modal-dialog");
    expect(scenarioIds).toContain("form-validation");
    expect(scenarioIds).toContain("aria-live-status");
    expect(scenarioIds).toContain("disclosure-menu");
    expect(scenarioIds).toContain("icon-button");
    expect(scenarioIds).toContain("tabs-widget");
    expect(scenarioIds).toContain("toggle-switch");
  });

  it("ensures each scenario contains valid steps, selectors, and expected announcements", () => {
    for (const scenario of Object.values(SCREEN_READER_SCENARIOS)) {
      expect(scenario.title).toBeTruthy();
      expect(scenario.category).toBeTruthy();
      expect(scenario.wcagCriterion).toBeTruthy();
      expect(scenario.testSteps.length).toBeGreaterThan(0);

      for (const step of scenario.testSteps) {
        expect(step.action).toBeTruthy();
        expect(step.targetSelector.startsWith("#") || step.targetSelector.startsWith(".")).toBe(true);
        expect(step.expectedAnnouncement).toBeTruthy();
        expect(step.expectedProps.role).toBeTruthy();
        expect(step.voiceOverKeys.length).toBeGreaterThan(0);
      }
    }
  });

  it("handles valid and invalid scenario lookups safely", () => {
    const modal = getScenarioById("modal-dialog");
    expect(modal).toBeDefined();
    expect(modal?.id).toBe("modal-dialog");

    const nonExistent = getScenarioById("unknown-scenario-xyz");
    expect(nonExistent).toBeUndefined();
  });

  it("accurately detects host platform without fabricating VoiceOver speech on non-macOS", async () => {
    const status = await getVoiceOverPlatformStatus();
    expect(status.osPlatform).toBe(process.platform);

    if (process.platform !== "darwin") {
      expect(status.isMacOS).toBe(false);
      expect(status.automationAvailable).toBe(false);
      expect(status.captureMethod).toBe("unsupported-platform");
      expect(status.message).toContain("Native Apple VoiceOver integration requires macOS");
    } else {
      expect(status.isMacOS).toBe(true);
    }
  });

  it("never fabricates or mocks VoiceOver speech output", async () => {
    const { captureCurrentVoiceOverSpeech } = await import("../lib/screenreader/voiceover");
    const capture = await captureCurrentVoiceOverSpeech();

    expect(capture).toBeDefined();
    expect(["CAPTURED", "MANUAL_VERIFICATION_REQUIRED", "UNAVAILABLE", "CAPTURE_FAILED"]).toContain(
      capture.state
    );

    if (process.platform !== "darwin") {
      expect(capture.state).toBe("UNAVAILABLE");
      expect(capture.capturedText).toBeNull();
      expect(capture.detail).toContain("does not support Apple VoiceOver");
    }
  });
});
