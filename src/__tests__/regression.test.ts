import { describe, it, expect } from "vitest";
import { compareAuditRuns } from "@/lib/regression/comparator";
import type { Finding } from "@prisma/client";

function mockFinding(id: string, fingerprint: string, ruleId: string): Finding {
  return {
    id,
    auditRunId: "audit-1",
    scannedPageId: "page-1",
    ruleId,
    ruleTitle: `Rule ${ruleId}`,
    ruleDescription: "Desc",
    ruleHelpUrl: null,
    impact: "serious",
    wcagCriteria: "[]",
    selector: `#${id}`,
    htmlSnippet: `<div>${id}</div>`,
    failureSummary: null,
    fingerprint,
    status: "OPEN",
    naReason: null,
    remediationNotes: null,
    remediationCode: null,
    remediatedAt: null,
    verifiedAt: null,
    verifiedByAuditRunId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("Regression Comparator Suite", () => {
  it("identifies new regressions introduced in latest audit run", () => {
    const baseline = [
      mockFinding("f1", "fp-1", "color-contrast"),
    ];

    const current = [
      mockFinding("f1", "fp-1", "color-contrast"),
      mockFinding("f2", "fp-2", "button-name"), // New regression!
    ];

    const diff = compareAuditRuns(current, baseline);

    expect(diff.summary.newCount).toBe(1);
    expect(diff.newFindings[0].ruleId).toBe("button-name");
    expect(diff.summary.persistentCount).toBe(1);
    expect(diff.summary.fixedCount).toBe(0);
    expect(diff.summary.netChange).toBe(1);
  });

  it("identifies fixed findings that are no longer detected", () => {
    const baseline = [
      mockFinding("f1", "fp-1", "image-alt"),
      mockFinding("f2", "fp-2", "label"),
    ];

    const current = [
      mockFinding("f1", "fp-1", "image-alt"), // label was fixed!
    ];

    const diff = compareAuditRuns(current, baseline);

    expect(diff.summary.fixedCount).toBe(1);
    expect(diff.fixedFindings[0].ruleId).toBe("label");
    expect(diff.summary.persistentCount).toBe(1);
    expect(diff.summary.newCount).toBe(0);
    expect(diff.summary.netChange).toBe(-1); // Net improvement
  });
});
