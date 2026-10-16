export type ScenarioStatus = "PASS" | "FAIL" | "NEEDS_MANUAL_REVIEW";

export interface ExpectedNodeProperties {
  role: string;
  name?: string;
  description?: string;
  value?: string;
  focused?: boolean;
  modal?: boolean;
  livePolite?: boolean;
  liveAssertive?: boolean;
  expanded?: boolean;
  invalid?: boolean;
  checked?: boolean;
  hasPopup?: string | boolean;
}

export interface ObservedNodeProperties {
  role: string;
  name: string;
  description?: string;
  value?: string;
  focused: boolean;
  modal: boolean;
  live: string | null;
  expanded: boolean | null;
  invalid: boolean | null;
  checked: boolean | null;
  tagName: string;
  selector: string;
  htmlSnippet: string;
}

export type SpeechCaptureState =
  | "CAPTURED"
  | "MANUAL_VERIFICATION_REQUIRED"
  | "UNAVAILABLE"
  | "CAPTURE_FAILED";

export interface TimelineEvent {
  stepNumber: number;
  userAction: string;
  expectedAnnouncement: string;
  expectedProperties: ExpectedNodeProperties;
  observedProperties: ObservedNodeProperties | null;
  actualVoiceOverOutput: string | null;
  speechCaptureState: SpeechCaptureState;
  voiceOverCaptureStatus: string;
  captureDetail?: string;
  status: ScenarioStatus;
  explanation: string;
  reproductionInstructions: string;
  voiceOverKeyCommands: string[];
}

export interface ScreenReaderScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  wcagCriterion: string;
  targetSelector: string;
  testSteps: {
    action: string;
    targetSelector: string;
    expectedAnnouncement: string;
    expectedProps: ExpectedNodeProperties;
    voiceOverKeys: string[];
    reproductionNote: string;
  }[];
}

export interface VoiceOverPlatformStatus {
  isMacOS: boolean;
  osPlatform: string;
  voiceOverRunning: boolean;
  automationAvailable: boolean;
  captureMethod: "osascript-caption-window" | "accessibility-api" | "unsupported-platform" | "manual-only";
  message: string;
  permissionsGranted: boolean;
  supportedEnvironments: string;
}

export interface ScenarioEvaluationResult {
  scenarioId: string;
  scenarioTitle: string;
  targetUrl: string;
  timestamp: string;
  status: ScenarioStatus;
  timeline: TimelineEvent[];
  summary: {
    totalSteps: number;
    passedSteps: number;
    failedSteps: number;
    manualReviewSteps: number;
  };
  platformStatus: VoiceOverPlatformStatus;
  limitationsNotice: string;
}
