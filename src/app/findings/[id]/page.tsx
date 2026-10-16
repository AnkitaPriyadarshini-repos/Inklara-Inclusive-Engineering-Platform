import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { FindingDetailClient } from "./FindingDetailClient";
import { getRemediationGuidance } from "@/lib/remediation/catalog";
import { WCAG_CATALOG, type WcagCriterion } from "@/lib/wcag/catalog";

export const dynamic = "force-dynamic";

export default async function FindingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const finding = await db.finding.findUnique({
    where: { id },
    include: {
      auditRun: {
        select: {
          id: true,
          name: true,
          targetUrl: true,
          projectId: true,
        },
      },
      scannedPage: true,
    },
  });

  if (!finding) {
    notFound();
  }

  const guidance = getRemediationGuidance(finding.ruleId, finding.ruleTitle);

  // Parse WCAG criteria list and map to catalog entries
  const criteriaIds: string[] = JSON.parse(finding.wcagCriteria || "[]");
  const criteria: WcagCriterion[] = criteriaIds
    .map((cId) => WCAG_CATALOG[cId])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none">
        <FindingDetailClient
          finding={finding}
          guidance={guidance}
          criteria={criteria}
        />
      </main>
    </div>
  );
}
