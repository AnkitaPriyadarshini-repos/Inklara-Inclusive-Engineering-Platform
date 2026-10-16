import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { AuditResultsClient } from "./AuditResultsClient";

export const dynamic = "force-dynamic";

export default async function AuditDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const audit = await db.auditRun.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true } },
      findings: {
        orderBy: [{ impact: "asc" }, { createdAt: "asc" }],
      },
      manualChecklist: {
        orderBy: [{ category: "asc" }, { criterion: "asc" }],
      },
    },
  });

  if (!audit) {
    notFound();
  }

  // Find other audits in the same project to offer as baseline comparisons
  const availableBaselines = await db.auditRun.findMany({
    where: {
      projectId: audit.projectId,
      id: { not: audit.id },
      status: "COMPLETED",
    },
    orderBy: { startedAt: "desc" },
    select: { id: true, name: true, startedAt: true },
  });

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none">
        <AuditResultsClient
          audit={audit}
          availableBaselines={availableBaselines}
        />
      </main>
    </div>
  );
}
