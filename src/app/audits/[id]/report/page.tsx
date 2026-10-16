import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { SanitizedCodeBlock } from "@/components/SanitizedCodeBlock";
import { ReportPrintButton } from "./ReportPrintButton";
import {
  ShieldCheck,
  Printer,
  ArrowLeft,
  AlertTriangle,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Slash,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const audit = await db.auditRun.findUnique({
    where: { id },
    include: {
      project: true,
      target: true,
      scannedPages: true,
      findings: {
        orderBy: [{ impact: "asc" }, { createdAt: "asc" }],
      },
      manualChecklist: {
        orderBy: [{ category: "asc" }, { criterion: "asc" }],
      },
      comparisonsAsNew: {
        include: { baselineRun: true },
        take: 1,
      },
    },
  });

  if (!audit) {
    notFound();
  }

  const manualPassed = audit.manualChecklist.filter((m) => m.status === "PASS").length;
  const manualFailed = audit.manualChecklist.filter((m) => m.status === "FAIL").length;
  const manualNA = audit.manualChecklist.filter((m) => m.status === "NOT_APPLICABLE").length;
  const manualUntested = audit.manualChecklist.filter((m) => m.status === "NOT_TESTED").length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black">
      {/* Non-print Top Action Bar */}
      <div className="no-print border-b border-slate-800 bg-slate-950/80 sticky top-0 z-30 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href={`/audits/${audit.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-blue-500 rounded p-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Return to Workbench</span>
          </Link>

          <ReportPrintButton />
        </div>
      </div>

      {/* Main Printable Document */}
      <main className="max-w-5xl mx-auto p-8 print:p-0 space-y-8 report-container">
        {/* Document Header */}
        <header className="border-b-2 border-slate-700 pb-6 print:border-black">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <ShieldCheck className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white print:text-black block">
                  Inklara Accessibility Audit Report
                </span>
                <span className="text-xs text-slate-400 print:text-slate-600 block">
                  Structured Website Evaluation &amp; Remediation Document
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 print:text-slate-600">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p className="font-mono text-[11px] mt-0.5">ID: {audit.id.slice(0, 12)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-800 print:border-slate-300">
            <div>
              <span className="text-slate-400 print:text-slate-600 block font-medium">Project:</span>
              <span className="font-semibold text-white print:text-black">{audit.project.name}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block font-medium">Evaluation Target:</span>
              <span className="font-mono text-white print:text-black truncate block max-w-xs">
                {audit.targetUrl}
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block font-medium">Conformity Target:</span>
              <span className="font-semibold text-blue-400 print:text-blue-800">
                WCAG 2.2 Level AA
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block font-medium">Methodology Reference:</span>
              <span className="text-white print:text-black">W3C WCAG-EM &amp; axe-core</span>
            </div>
          </div>
        </header>

        {/* Mandatory Non-Conformance / Disclaimer Banner */}
        <section
          aria-labelledby="legal-notice-heading"
          className="p-4 bg-amber-950/30 border border-amber-900/60 rounded-xl text-xs text-amber-200 print:bg-amber-50 print:border-amber-300 print:text-amber-900"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 id="legal-notice-heading" className="font-bold text-amber-300 print:text-amber-900">
                Evaluation Scope &amp; Non-Certification Notice
              </h2>
              <p className="mt-1 leading-relaxed">
                Automated testing tools reliably assess a subset of WCAG success criteria (~30-40%). Complete accessibility requires human evaluation, assistive technology validation (VoiceOver, NVDA, braille displays), and testing with individuals with disabilities. This audit report documents identified barriers and remediation guidance; it does NOT constitute official legal certification or guarantee absolute WCAG conformance.
              </p>
            </div>
          </div>
        </section>

        {/* Executive Summary & Statistics */}
        <section aria-labelledby="executive-summary-heading" className="space-y-4">
          <h2 id="executive-summary-heading" className="text-base font-bold text-white print:text-black uppercase tracking-wider">
            1. Executive Evaluation Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl print:border-slate-300 print:bg-slate-50">
              <span className="text-xs text-slate-400 print:text-slate-600 block">Automated Violations</span>
              <span className="text-2xl font-bold text-rose-400 print:text-rose-700 mt-1 block">
                {audit.violationsCount}
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5 block">
                {audit.criticalCount} Critical, {audit.seriousCount} Serious
              </span>
            </div>

            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl print:border-slate-300 print:bg-slate-50">
              <span className="text-xs text-slate-400 print:text-slate-600 block">Axe Passes</span>
              <span className="text-2xl font-bold text-emerald-400 print:text-emerald-700 mt-1 block">
                {audit.passesCount}
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5 block">
                Verified automated rules
              </span>
            </div>

            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl print:border-slate-300 print:bg-slate-50">
              <span className="text-xs text-slate-400 print:text-slate-600 block">Manual Check Failures</span>
              <span className="text-2xl font-bold text-amber-400 print:text-amber-700 mt-1 block">
                {manualFailed}
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5 block">
                {manualPassed} items passed
              </span>
            </div>

            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl print:border-slate-300 print:bg-slate-50">
              <span className="text-xs text-slate-400 print:text-slate-600 block">Untested Criteria</span>
              <span className="text-2xl font-bold text-slate-300 print:text-slate-800 mt-1 block">
                {manualUntested}
              </span>
              <span className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5 block">
                Requires human review
              </span>
            </div>
          </div>
        </section>

        {/* Detailed Automated Findings */}
        <section aria-labelledby="findings-heading" className="space-y-4 page-break">
          <div className="flex items-center justify-between">
            <h2 id="findings-heading" className="text-base font-bold text-white print:text-black uppercase tracking-wider">
              2. Automated Accessibility Findings ({audit.findings.length})
            </h2>
          </div>

          {audit.findings.length === 0 ? (
            <p className="text-xs text-slate-400 print:text-slate-600">
              No automated accessibility violations detected on evaluated pages.
            </p>
          ) : (
            <div className="space-y-6">
              {audit.findings.map((f, idx) => {
                const wcagList: string[] = JSON.parse(f.wcagCriteria || "[]");

                return (
                  <div
                    key={f.id}
                    className="p-5 bg-slate-800/40 border border-slate-700 rounded-xl print:border-slate-300 print:bg-transparent space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 print:text-slate-600">
                          #{idx + 1}
                        </span>
                        <SeverityBadge impact={f.impact} />
                        <span className="font-mono text-xs font-bold text-white print:text-black">
                          {f.ruleId}
                        </span>
                        <StatusBadge status={f.status} />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {wcagList.map((crit) => (
                          <span
                            key={crit}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 print:bg-blue-100 print:text-blue-900 border border-blue-800 print:border-blue-300"
                          >
                            WCAG {crit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white print:text-black">
                        {f.ruleTitle}
                      </h3>
                      <p className="text-xs text-slate-400 print:text-slate-700 mt-0.5">
                        {f.ruleDescription}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="font-mono bg-slate-900 print:bg-slate-100 p-2 rounded text-[11px] truncate text-slate-300 print:text-slate-800">
                        <strong className="text-slate-400 print:text-slate-600 font-sans">Selector: </strong>
                        {f.selector}
                      </div>

                      <SanitizedCodeBlock
                        code={f.htmlSnippet}
                        label="HTML DOM Evidence"
                        maxHeight="max-h-28"
                      />
                    </div>

                    {f.remediationNotes && (
                      <div className="p-3 bg-blue-950/30 print:bg-blue-50 border border-blue-900/50 print:border-blue-200 rounded text-xs text-blue-200 print:text-blue-900">
                        <strong className="block mb-0.5 font-semibold">Remediation Log:</strong>
                        <p className="whitespace-pre-wrap">{f.remediationNotes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Guided Manual Checklist Results */}
        <section aria-labelledby="manual-results-heading" className="space-y-4 page-break">
          <h2 id="manual-results-heading" className="text-base font-bold text-white print:text-black uppercase tracking-wider">
            3. Guided Human Evaluation Results (WCAG-EM)
          </h2>

          <div className="border border-slate-700 print:border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs" aria-label="Manual Checklist Results">
              <thead className="bg-slate-800 print:bg-slate-100 text-slate-300 print:text-slate-800 border-b border-slate-700 print:border-slate-300 font-semibold">
                <tr>
                  <th scope="col" className="p-3">Category &amp; Criterion</th>
                  <th scope="col" className="p-3">Verification Status</th>
                  <th scope="col" className="p-3">Evaluator Notes / Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {audit.manualChecklist.map((item) => (
                  <tr key={item.id} className="print:text-black">
                    <td className="p-3 align-top">
                      <span className="font-semibold block text-white print:text-black">
                        {item.title}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 print:text-slate-600">
                        {item.criterion} • {item.category}
                      </span>
                    </td>
                    <td className="p-3 align-top">
                      {item.status === "PASS" ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 print:text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Pass</span>
                        </span>
                      ) : item.status === "FAIL" ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-400 print:text-rose-700">
                          <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Fail</span>
                        </span>
                      ) : item.status === "NOT_APPLICABLE" ? (
                        <span className="inline-flex items-center gap-1 text-slate-400 print:text-slate-600">
                          <Slash className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>N/A</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 print:text-slate-400">
                          <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Untested</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 align-top text-slate-300 print:text-slate-700">
                      {item.status === "NOT_APPLICABLE" ? (
                        <span className="italic text-amber-300 print:text-amber-800">
                          N/A Reason: {item.naReason || "No justification recorded"}
                        </span>
                      ) : (
                        item.notes || <span className="text-slate-500 print:text-slate-400">No notes recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800 print:border-slate-300 text-center text-xs text-slate-500 print:text-slate-600">
          <p>
            Generated by Inklara — Inclusive Engineering Platform. Enterprise Accessibility &amp; Quality Engineering Workbench.
          </p>
        </footer>
      </main>
    </div>
  );
}
