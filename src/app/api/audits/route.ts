import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scanPage } from "@/lib/scanner/engine";
import { MANUAL_CHECKLIST_TEMPLATE } from "@/lib/manual/template";
import { CreateAuditRunSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const audits = await db.auditRun.findMany({
      orderBy: { startedAt: "desc" },
      take: 20,
      include: {
        project: { select: { id: true, name: true } },
        target: { select: { id: true, name: true, environment: true } },
      },
    });

    return NextResponse.json({ audits });
  } catch (error: unknown) {
    console.error("GET /api/audits error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audits" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CreateAuditRunSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const {
      projectId,
      targetId,
      name,
      targetUrl,
      scopeType,
      wcagLevel,
      isBaseline,
      evaluationScope,
    } = validated.data;

    // 1. Create Pending Audit Run
    const auditRun = await db.auditRun.create({
      data: {
        projectId,
        targetId: targetId || null,
        name,
        targetUrl,
        scopeType,
        wcagLevel,
        isBaseline,
        evaluationScope:
          evaluationScope ||
          `Evaluated against ${wcagLevel} using Playwright & axe-core`,
        status: "RUNNING",
      },
    });

    // 2. Execute Automated Scanner
    try {
      const scanResult = await scanPage(targetUrl, {
        allowLocalScanning: process.env.ALLOW_LOCAL_SCANNING === "true",
      });

      // 3. Save Scanned Page
      const scannedPage = await db.scannedPage.create({
        data: {
          auditRunId: auditRun.id,
          url: scanResult.url,
          title: scanResult.title,
          statusCode: scanResult.statusCode,
          loadTimeMs: scanResult.loadTimeMs,
        },
      });

      // 4. Save Findings (Automated violations)
      if (scanResult.findings.length > 0) {
        await db.finding.createMany({
          data: scanResult.findings.map((f) => ({
            auditRunId: auditRun.id,
            scannedPageId: scannedPage.id,
            ruleId: f.ruleId,
            ruleTitle: f.ruleTitle,
            ruleDescription: f.ruleDescription,
            ruleHelpUrl: f.ruleHelpUrl,
            impact: f.impact,
            wcagCriteria: JSON.stringify(f.wcagCriteria),
            selector: f.selector,
            htmlSnippet: f.htmlSnippet,
            failureSummary: f.failureSummary || null,
            fingerprint: f.fingerprint,
            status: "OPEN",
          })),
        });
      }

      // 5. Seed 13 Guided Manual Checklist Items for this Audit
      await db.manualChecklistItem.createMany({
        data: MANUAL_CHECKLIST_TEMPLATE.map((tpl) => ({
          auditRunId: auditRun.id,
          category: tpl.category,
          criterion: tpl.criterion,
          title: tpl.title,
          description: tpl.description,
          methodologyInstructions: tpl.methodologyInstructions,
          status: "NOT_TESTED",
        })),
      });

      // 6. Update AuditRun with Final Metrics and Completed Status
      const updatedAuditRun = await db.auditRun.update({
        where: { id: auditRun.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          violationsCount: scanResult.violationsCount,
          incompleteCount: scanResult.incompleteCount,
          passesCount: scanResult.passesCount,
          inapplicableCount: scanResult.inapplicableCount,
          criticalCount: scanResult.criticalCount,
          seriousCount: scanResult.seriousCount,
          moderateCount: scanResult.moderateCount,
          minorCount: scanResult.minorCount,
        },
        include: {
          scannedPages: true,
          findings: true,
          manualChecklist: true,
        },
      });

      return NextResponse.json({ auditRun: updatedAuditRun }, { status: 201 });
    } catch (scanError: unknown) {
      const message =
        scanError instanceof Error ? scanError.message : String(scanError);

      await db.auditRun.update({
        where: { id: auditRun.id },
        data: {
          status: "FAILED",
          errorMessage: message,
          completedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          error: "Audit run failed",
          message,
          auditRunId: auditRun.id,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("POST /api/audits error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
