import type { Finding } from "@prisma/client";

export interface FindingRegressionDiff {
  newFindings: Finding[];
  fixedFindings: Finding[];
  persistentFindings: Finding[];
  summary: {
    newCount: number;
    fixedCount: number;
    persistentCount: number;
    netChange: number; // positive = net increase in issues (regression), negative = improvement
  };
}

/**
 * Compares findings from a current audit run against a baseline audit run.
 * Uses deterministic fingerprinting to identify new regressions, fixed issues, and persistent defects.
 */
export function compareAuditRuns(
  currentFindings: Finding[],
  baselineFindings: Finding[]
): FindingRegressionDiff {
  const currentMap = new Map<string, Finding>();
  for (const f of currentFindings) {
    currentMap.set(f.fingerprint, f);
  }

  const baselineMap = new Map<string, Finding>();
  for (const f of baselineFindings) {
    baselineMap.set(f.fingerprint, f);
  }

  const newFindings: Finding[] = [];
  const persistentFindings: Finding[] = [];
  const fixedFindings: Finding[] = [];

  // Check all current findings against baseline
  for (const [fingerprint, currentFinding] of currentMap.entries()) {
    if (baselineMap.has(fingerprint)) {
      persistentFindings.push(currentFinding);
    } else {
      newFindings.push(currentFinding);
    }
  }

  // Check which baseline findings are no longer present (fixed)
  for (const [fingerprint, baselineFinding] of baselineMap.entries()) {
    if (!currentMap.has(fingerprint)) {
      fixedFindings.push(baselineFinding);
    }
  }

  const netChange = newFindings.length - fixedFindings.length;

  return {
    newFindings,
    fixedFindings,
    persistentFindings,
    summary: {
      newCount: newFindings.length,
      fixedCount: fixedFindings.length,
      persistentCount: persistentFindings.length,
      netChange,
    },
  };
}
