import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scanPage } from "@/lib/scanner/engine";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const finding = await db.finding.findUnique({
      where: { id },
      include: {
        auditRun: true,
        scannedPage: true,
      },
    });

    if (!finding) {
      return NextResponse.json(
        { error: "Finding not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const targetUrl =
      body.overrideUrl || finding.scannedPage?.url || finding.auditRun.targetUrl;

    // Run verification scan
    const scanResult = await scanPage(targetUrl, {
      allowLocalScanning: process.env.ALLOW_LOCAL_SCANNING === "true",
      wcagTags: [
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
        "best-practice",
      ],
    });

    // Check if the finding's fingerprint or (ruleId + selector) is still present in the scan
    const stillPresent = scanResult.findings.find(
      (f) =>
        f.fingerprint === finding.fingerprint ||
        (f.ruleId === finding.ruleId && f.selector === finding.selector)
    );

    if (!stillPresent) {
      // The issue is verified fixed!
      const updated = await db.finding.update({
        where: { id },
        data: {
          status: "VERIFIED_FIXED",
          verifiedAt: new Date(),
          remediationNotes: finding.remediationNotes
            ? `${finding.remediationNotes}\n[Verification]: Verified fixed on ${new Date().toISOString()}`
            : `[Verification]: Verified fixed on ${new Date().toISOString()}`,
        },
      });

      return NextResponse.json({
        verifiedFixed: true,
        message: `Violation '${finding.ruleId}' is no longer detected on element. Successfully verified fixed.`,
        finding: updated,
      });
    } else {
      // Issue is still detected
      return NextResponse.json({
        verifiedFixed: false,
        message: `Violation '${finding.ruleId}' was still detected on ${finding.selector}. Fix cannot be verified.`,
        currentFailureSummary: stillPresent.failureSummary,
      });
    }
  } catch (error: unknown) {
    console.error("POST /api/findings/[id]/verify error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Verification failed", message },
      { status: 500 }
    );
  }
}
