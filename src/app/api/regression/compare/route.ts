import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { compareAuditRuns } from "@/lib/regression/comparator";
import { CompareAuditSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CompareAuditSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { auditRunId, baselineRunId } = validated.data;

    const [currentAudit, baselineAudit] = await Promise.all([
      db.auditRun.findUnique({
        where: { id: auditRunId },
        include: { findings: true },
      }),
      db.auditRun.findUnique({
        where: { id: baselineRunId },
        include: { findings: true },
      }),
    ]);

    if (!currentAudit) {
      return NextResponse.json(
        { error: "Current audit run not found" },
        { status: 404 }
      );
    }
    if (!baselineAudit) {
      return NextResponse.json(
        { error: "Baseline audit run not found" },
        { status: 404 }
      );
    }

    const diff = compareAuditRuns(
      currentAudit.findings,
      baselineAudit.findings
    );

    const comparison = await db.baselineComparison.create({
      data: {
        auditRunId: currentAudit.id,
        baselineRunId: baselineAudit.id,
        newFindingsCount: diff.summary.newCount,
        fixedFindingsCount: diff.summary.fixedCount,
        persistentFindingsCount: diff.summary.persistentCount,
        summaryJson: JSON.stringify({
          summary: diff.summary,
          newRuleIds: Array.from(new Set(diff.newFindings.map((f) => f.ruleId))),
          fixedRuleIds: Array.from(new Set(diff.fixedFindings.map((f) => f.ruleId))),
        }),
      },
    });

    return NextResponse.json({
      comparison,
      diff,
      currentAuditName: currentAudit.name,
      baselineAuditName: baselineAudit.name,
    });
  } catch (error: unknown) {
    console.error("POST /api/regression/compare error:", error);
    return NextResponse.json(
      { error: "Failed to compare audit runs" },
      { status: 500 }
    );
  }
}
