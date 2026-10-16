import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { SeverityBadge } from "@/components/SeverityBadge";
import { DashboardClient } from "./DashboardClient";
import {
  FolderKanban,
  History,
  AlertTriangle,
  ClipboardCheck,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
  CheckCircle2,
  Activity,
  FileText,
  Sparkles,
  Cpu,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [projects, audits, totalFindings, manualStats] = await Promise.all([
    db.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        targets: true,
        auditRuns: {
          select: { id: true, status: true, completedAt: true },
        },
      },
    }),
    db.auditRun.findMany({
      orderBy: { startedAt: "desc" },
      take: 10,
      include: {
        project: { select: { id: true, name: true } },
        target: { select: { id: true, name: true, environment: true } },
      },
    }),
    db.finding.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    db.manualChecklistItem.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  const totalOpenFindings =
    totalFindings.find((f) => f.status === "OPEN")?._count.id ?? 0;
  const totalVerifiedFixed =
    totalFindings.find((f) => f.status === "VERIFIED_FIXED")?._count.id ?? 0;

  const totalManualChecks = manualStats.reduce((acc, curr) => acc + curr._count.id, 0);
  const evaluatedManualChecks = manualStats
    .filter((s) => s.status !== "NOT_TESTED")
    .reduce((acc, curr) => acc + curr._count.id, 0);

  const totalPasses = audits.reduce((acc, a) => acc + (a.passesCount || 0), 0);
  const manualPercent =
    totalManualChecks > 0
      ? Math.round((evaluatedManualChecks / totalManualChecks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <DashboardClient
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      />

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none">
        {/* Page Heading & Scope */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-apple-border mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Inklara — Inclusive Engineering Platform
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-blue-950 text-blue-300 border border-blue-800">
                WCAG 2.2 AA
              </span>
            </div>
            <p className="text-sm text-apple-muted mt-1">
              Automated axe-core engine, screen-reader scenario testing, guided manual verification, remediation tracking, and regression analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/fixtures"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
            >
              <Layers className="w-3.5 h-3.5 text-apple-muted" aria-hidden="true" />
              <span>Inspect Test Fixtures</span>
            </Link>
          </div>
        </div>

        {/* Snowdog-Inspired Audit Lifecycle Workflow Bar */}
        <div className="bg-gradient-to-r from-apple-surface via-apple-elevated/40 to-apple-surface border border-apple-border rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Four-Stage Accessibility Audit Lifecycle
              </span>
            </div>
            <span className="text-[11px] text-apple-muted hidden sm:inline">
              Hybrid Automated &amp; Human-Centered Verification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-apple-surface/80 border border-apple-border rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-white mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center text-[10px]">1</span>
                <span>Scope &amp; Target</span>
              </div>
              <p className="text-[11px] text-apple-muted">
                Group targets by project, viewport, and environment (Prod, Staging, Dev).
              </p>
            </div>

            <div className="p-3 bg-apple-surface/80 border border-apple-border rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-white mb-1">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-[10px]">2</span>
                <span>Automated Scan</span>
              </div>
              <p className="text-[11px] text-apple-muted">
                Playwright Chromium sandbox runs axe-core with SSRF guardrails (~30-40% WCAG).
              </p>
            </div>

            <div className="p-3 bg-apple-surface/80 border border-apple-border rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-white mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">3</span>
                <span>Manual Verification</span>
              </div>
              <p className="text-[11px] text-apple-muted">
                13 WCAG-EM guided checks for keyboard traps, screen reader audio, and reflow.
              </p>
            </div>

            <div className="p-3 bg-apple-surface/80 border border-apple-border rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-white mb-1">
                <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 border border-amber-500/40 flex items-center justify-center text-[10px]">4</span>
                <span>Remediate &amp; Report</span>
              </div>
              <p className="text-[11px] text-apple-muted">
                Track code fix diffs, verify regression baselines, and print executive reports.
              </p>
            </div>
          </div>
        </div>

        {/* Real Metrics Grid - Zero Fabricated Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-apple-surface border border-apple-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-apple-muted mb-2">
              <span className="text-xs font-medium">Audit Projects</span>
              <FolderKanban className="w-4 h-4 text-blue-400" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-white">{projects.length}</p>
            <p className="text-[11px] text-apple-muted mt-1">
              {projects.reduce((acc, p) => acc + p.targets.length, 0)} registered target environments
            </p>
          </div>

          <div className="p-4 bg-apple-surface border border-apple-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-apple-muted mb-2">
              <span className="text-xs font-medium">Total Audits Run</span>
              <History className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-white">{audits.length}</p>
            <p className="text-[11px] text-apple-muted mt-1">
              {audits.filter((a) => a.isBaseline).length} saved baselines • {totalPasses} verified passes
            </p>
          </div>

          <div className="p-4 bg-apple-surface border border-apple-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-apple-muted mb-2">
              <span className="text-xs font-medium">Open Automated Violations</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-amber-400">{totalOpenFindings}</p>
            <p className="text-[11px] text-emerald-400 mt-1">
              {totalVerifiedFixed} issues verified fixed
            </p>
          </div>

          <div className="p-4 bg-apple-surface border border-apple-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-apple-muted mb-2">
              <span className="text-xs font-medium">Manual Check Progress</span>
              <ClipboardCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-white">{manualPercent}%</p>
              <span className="text-xs text-apple-muted">({evaluatedManualChecks}/{totalManualChecks})</span>
            </div>
            <div className="w-full bg-apple-elevated rounded-full h-1.5 mt-2 overflow-hidden" role="progressbar" aria-valuenow={manualPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Manual accessibility evaluation progress">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${manualPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent Audits Section */}
        <section aria-labelledby="recent-audits-heading" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="recent-audits-heading" className="text-lg font-semibold text-white">
                Recent Accessibility Audits
              </h2>
              <p className="text-xs text-apple-muted">
                Executed against rendered pages using Playwright browser isolation &amp; axe-core.
              </p>
            </div>
            {audits.length > 0 && (
              <Link
                href="/audits"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-apple-focus rounded px-1"
              >
                <span>View all audits</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>

          {audits.length === 0 ? (
            <div className="p-10 border border-dashed border-apple-border rounded-xl bg-apple-surface/40 text-center">
              <ShieldCheck className="w-10 h-10 text-apple-muted mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-white">No Audits Recorded Yet</h3>
              <p className="text-xs text-apple-muted max-w-md mx-auto mt-1 mb-5">
                Execute an automated accessibility scan against the built-in local test fixture or any accessible web environment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-apple-border rounded-xl bg-apple-surface shadow-sm">
              <table className="w-full text-left text-xs" aria-label="Recent Accessibility Audits">
                <thead className="bg-apple-elevated/60 text-apple-muted font-medium border-b border-apple-border">
                  <tr>
                    <th scope="col" className="px-4 py-3">Audit Name &amp; Target</th>
                    <th scope="col" className="px-4 py-3">Project</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Violations Breakdown</th>
                    <th scope="col" className="px-4 py-3">Execution Time</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-border/50">
                  {audits.map((audit) => (
                    <tr key={audit.id} className="hover:bg-apple-elevated/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <Link
                            href={`/audits/${audit.id}`}
                            className="hover:text-blue-400 underline decoration-apple-border focus-visible:ring-1 focus-visible:ring-apple-focus rounded"
                          >
                            {audit.name}
                          </Link>
                          {audit.isBaseline && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                              Baseline
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-apple-muted font-mono truncate max-w-xs mt-0.5">
                          {audit.targetUrl}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-apple-muted">
                        {audit.project.name}
                      </td>
                      <td className="px-4 py-3.5">
                        {audit.status === "COMPLETED" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Completed
                          </span>
                        ) : audit.status === "RUNNING" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-950 text-blue-300 border border-blue-800 animate-pulse">
                            Scanning...
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-950 text-red-300 border border-red-800">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {audit.violationsCount === 0 ? (
                          <span className="text-emerald-400 font-medium">0 violations</span>
                        ) : (
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
                            {audit.minorCount > 0 && (
                              <SeverityBadge impact="minor" />
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-apple-muted">
                        {new Date(audit.startedAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Link
                          href={`/audits/${audit.id}`}
                          className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
                        >
                          View Results
                        </Link>
                        <Link
                          href={`/audits/${audit.id}/report`}
                          className="px-2.5 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 rounded transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
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
        </section>

        {/* Project and Environments Section */}
        <section aria-labelledby="projects-heading">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="projects-heading" className="text-lg font-semibold text-white">
                Active Audit Projects
              </h2>
              <p className="text-xs text-apple-muted">
                Repositories and monitored web application environments.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-apple-focus rounded px-1"
            >
              <span>Manage projects</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white text-sm">
                      <Link
                        href={`/projects/${project.id}`}
                        className="hover:text-blue-400 focus-visible:ring-1 focus-visible:ring-apple-focus rounded"
                      >
                        {project.name}
                      </Link>
                    </h3>
                    <span className="text-[11px] text-apple-muted">
                      {project.auditRuns.length} audits
                    </span>
                  </div>
                  <p className="text-xs text-apple-muted line-clamp-2 mb-4">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-3 border-t border-apple-border/70 flex items-center justify-between text-xs">
                  <span className="text-apple-muted">
                    {project.targets.length} Target Environments
                  </span>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-apple-focus rounded"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
