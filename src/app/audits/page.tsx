import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { SeverityBadge } from "@/components/SeverityBadge";
import { History, Play, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditsListPage() {
  let audits: any[] = [];
  try {
    audits = await db.auditRun.findMany({
      orderBy: { startedAt: "desc" },
      include: {
        project: { select: { id: true, name: true } },
      },
    });
  } catch (error) {
    console.error("Database unavailable on audits list page:", error);
  }

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-apple-border">
          <div>
            <h1 className="text-2xl font-bold text-white">Accessibility Audits</h1>
            <p className="text-xs text-apple-muted mt-0.5">
              Chronological log of automated axe-core scans and WCAG-EM human evaluations.
            </p>
          </div>
        </div>

        {audits.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-apple-border rounded-xl bg-apple-surface">
            <History className="w-10 h-10 text-apple-muted mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-white">No Audits Recorded</h2>
            <p className="text-xs text-apple-muted max-w-sm mx-auto mt-1 mb-4">
              Trigger your first audit from the Dashboard or by scanning the built-in test fixtures.
            </p>
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border border-apple-border rounded-xl bg-apple-surface shadow-sm">
            <table className="w-full text-left text-xs" aria-label="Accessibility Audits Log">
              <thead className="bg-apple-elevated/60 text-apple-muted font-medium border-b border-apple-border">
                <tr>
                  <th scope="col" className="px-4 py-3">Audit Name</th>
                  <th scope="col" className="px-4 py-3">Project</th>
                  <th scope="col" className="px-4 py-3">Target URL</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Violations</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-border/50">
                {audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-apple-elevated/30 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/audits/${audit.id}`}
                          className="hover:text-blue-400 underline decoration-apple-border"
                        >
                          {audit.name}
                        </Link>
                        {audit.isBaseline && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                            Baseline
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-apple-muted">
                      {audit.project.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-apple-muted truncate max-w-xs">
                      {audit.targetUrl}
                    </td>
                    <td className="px-4 py-3.5">
                      {audit.status === "COMPLETED" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-950 text-red-300 border border-red-800">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {audit.criticalCount > 0 && (
                          <SeverityBadge impact="critical" />
                        )}
                        {audit.seriousCount > 0 && (
                          <SeverityBadge impact="serious" />
                        )}
                        {audit.moderateCount > 0 && (
                          <SeverityBadge impact="moderate" />
                        )}
                        {audit.violationsCount === 0 && (
                          <span className="text-emerald-400 font-medium">0 issues</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-apple-muted">
                      {new Date(audit.startedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <Link
                        href={`/audits/${audit.id}`}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                      >
                        Inspect
                      </Link>
                      <Link
                        href={`/audits/${audit.id}/report`}
                        className="px-2.5 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-950/40 border border-blue-800/60 rounded transition-colors"
                      >
                        Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
