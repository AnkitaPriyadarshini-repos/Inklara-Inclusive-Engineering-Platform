export type FindingImpact = "critical" | "serious" | "moderate" | "minor";

export type FindingStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "FIXED_PENDING_VERIFICATION"
  | "VERIFIED_FIXED"
  | "NEEDS_FURTHER_REVIEW"
  | "NOT_APPLICABLE";

export interface NormalizedFinding {
  ruleId: string;
  ruleTitle: string;
  ruleDescription: string;
  ruleHelpUrl?: string;
  impact: FindingImpact;
  wcagCriteria: string[];
  selector: string;
  htmlSnippet: string;
  failureSummary?: string;
  fingerprint: string;
}

export interface PageScanResult {
  url: string;
  title: string;
  loadTimeMs: number;
  statusCode?: number;
  violationsCount: number;
  incompleteCount: number;
  passesCount: number;
  inapplicableCount: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  findings: NormalizedFinding[];
  incompleteFindings: NormalizedFinding[];
}

export interface AuditExecutionOptions {
  urls: string[];
  scopeType?: "single-page" | "multi-page" | "wcag-em-sample";
  timeoutMs?: number;
  allowLocalScanning?: boolean;
}
