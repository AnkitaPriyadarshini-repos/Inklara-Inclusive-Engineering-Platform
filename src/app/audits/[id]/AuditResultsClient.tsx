"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { SanitizedCodeBlock } from "@/components/SanitizedCodeBlock";
import { Modal } from "@/components/Modal";
import {
  ExternalLink,
  Printer,
  GitCompare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Slash,
  AlertTriangle,
  ArrowRight,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import type { AuditRun, Finding, ManualChecklistItem, Project } from "@prisma/client";

interface AuditWithRelations extends AuditRun {
  project: { id: string; name: string };
  findings: Finding[];
  manualChecklist: ManualChecklistItem[];
}

interface AuditResultsClientProps {
  audit: AuditWithRelations;
  availableBaselines: Array<{ id: string; name: string; startedAt: Date }>;
}

export function AuditResultsClient({
  audit,
  availableBaselines,
}: AuditResultsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"automated" | "manual" | "regression">("automated");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Manual Checklist State
  const [checklist, setChecklist] = useState<ManualChecklistItem[]>(audit.manualChecklist);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);

  // Regression Comparison State
  const [selectedBaselineId, setSelectedBaselineId] = useState<string>(
    availableBaselines[0]?.id || ""
  );
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonDiff, setComparisonDiff] = useState<any>(null);

  // Filter findings
  const filteredFindings = audit.findings.filter((f) => {
    if (severityFilter !== "ALL" && f.impact.toLowerCase() !== severityFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter !== "ALL" && f.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRule = f.ruleId.toLowerCase().includes(q);
      const matchTitle = f.ruleTitle.toLowerCase().includes(q);
      const matchSelector = f.selector.toLowerCase().includes(q);
      if (!matchRule && !matchTitle && !matchSelector) return false;
    }
    return true;
  });

  const handleUpdateManualItem = async (
    item: ManualChecklistItem,
    newStatus: string,
    notes?: string,
    naReason?: string
  ) => {
    setSavingItemId(item.id);
    try {
      const res = await fetch(`/api/manual/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          notes: notes ?? item.notes ?? undefined,
          naReason: naReason ?? item.naReason ?? undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChecklist((prev) =>
          prev.map((i) => (i.id === item.id ? data.item : i))
        );
      }
    } catch {
      // Handle error
    } finally {
      setSavingItemId(null);
    }
  };

  const handleRunComparison = async () => {
    if (!selectedBaselineId) return;
    setIsComparing(true);
    try {
      const res = await fetch("/api/regression/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditRunId: audit.id,
          baselineRunId: selectedBaselineId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComparisonDiff(data.diff);
      }
    } catch {
      // Handle error
    } finally {
      setIsComparing(false);
    }
  };

  // Group manual checklist by category
  const categories = Array.from(new Set(checklist.map((c) => c.category)));

  return (
    <div className="space-y-6">
      {/* Top Banner & Metadata */}
      <div className="bg-apple-surface border border-apple-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-apple-border/70">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                {audit.project.name}
              </span>
              <span className="text-apple-border">•</span>
              <span className="text-xs text-apple-muted">
                {new Date(audit.startedAt).toLocaleString()}
              </span>
              {audit.isBaseline && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Official Baseline
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white mt-1">{audit.name}</h1>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-apple-muted">Target:</span>
              <a
                href={audit.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-300 hover:text-white font-mono flex items-center gap-1 underline decoration-apple-border hover:decoration-white"
              >
                <span>{audit.targetUrl}</span>
                <ExternalLink className="w-3 h-3 text-apple-muted" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/audits/${audit.id}/report`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Audit Report &amp; PDF</span>
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab("regression")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
            >
              <GitCompare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Compare Baseline</span>
            </button>
          </div>
        </div>

        {/* Severity Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-5 text-xs">
          <div className="p-3 bg-apple-elevated/40 border border-apple-border rounded-lg">
            <span className="text-[11px] text-apple-muted block">Violations</span>
            <span className="text-xl font-bold text-white mt-0.5 block">
              {audit.violationsCount}
            </span>
          </div>
          <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg">
            <span className="text-[11px] text-red-300 font-semibold block">Critical</span>
            <span className="text-xl font-bold text-red-400 mt-0.5 block">
              {audit.criticalCount}
            </span>
          </div>
          <div className="p-3 bg-orange-950/20 border border-orange-900/40 rounded-lg">
            <span className="text-[11px] text-orange-300 font-semibold block">Serious</span>
            <span className="text-xl font-bold text-orange-400 mt-0.5 block">
              {audit.seriousCount}
            </span>
          </div>
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg">
            <span className="text-[11px] text-amber-300 font-semibold block">Moderate</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">
              {audit.moderateCount}
            </span>
          </div>
          <div className="p-3 bg-cyan-950/20 border border-cyan-900/40 rounded-lg">
            <span className="text-[11px] text-cyan-300 font-semibold block">Minor</span>
            <span className="text-xl font-bold text-cyan-400 mt-0.5 block">
              {audit.minorCount}
            </span>
          </div>
          <div className="p-3 bg-apple-elevated/40 border border-apple-border rounded-lg">
            <span className="text-[11px] text-apple-muted block">Axe Passes</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
              {audit.passesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="border-b border-apple-border">
        <nav className="flex space-x-6" aria-label="Audit Analysis Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("automated")}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "automated"
                ? "border-blue-500 text-white"
                : "border-transparent text-apple-muted hover:text-slate-300"
            }`}
          >
            <span>Automated Findings</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-apple-elevated text-slate-300">
              {audit.findings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "manual"
                ? "border-blue-500 text-white"
                : "border-transparent text-apple-muted hover:text-slate-300"
            }`}
          >
            <span>Guided Manual Checklist</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-apple-elevated text-slate-300">
              {checklist.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("regression")}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "regression"
                ? "border-blue-500 text-white"
                : "border-transparent text-apple-muted hover:text-slate-300"
            }`}
          >
            <span>Regression Diff</span>
          </button>
        </nav>
      </div>

      {/* TAB 1: AUTOMATED FINDINGS */}
      {activeTab === "automated" && (
        <section aria-labelledby="automated-findings-title" className="space-y-4">
          <h2 id="automated-findings-title" className="sr-only">
            Automated Accessibility Findings
          </h2>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-apple-surface border border-apple-border rounded-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-apple-muted font-medium flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Severity:</span>
              </span>
              {["ALL", "CRITICAL", "SERIOUS", "MODERATE", "MINOR"].map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    severityFilter === sev
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-apple-elevated text-apple-muted hover:text-white"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-apple-muted absolute left-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search rule, selector, text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-apple-elevated border border-apple-border text-white text-xs rounded-lg pl-8 pr-3 py-1.5 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
              />
            </div>
          </div>

          {/* Findings List */}
          {filteredFindings.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-apple-border rounded-xl bg-apple-surface">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-white">No Matching Findings</h3>
              <p className="text-xs text-apple-muted mt-1">
                Either no automated violations match your active filter, or the evaluated target passed all configured axe-core checks.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFindings.map((finding) => {
                const wcagList: string[] = JSON.parse(finding.wcagCriteria || "[]");

                return (
                  <article
                    key={finding.id}
                    className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-3 transition-colors hover:border-apple-subtle"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge impact={finding.impact} />
                        <span className="font-mono text-xs font-bold text-white bg-apple-elevated px-2 py-0.5 rounded border border-apple-border">
                          {finding.ruleId}
                        </span>
                        <StatusBadge status={finding.status} />
                      </div>

                      <div className="flex items-center gap-2">
                        {wcagList.map((crit) => (
                          <span
                            key={crit}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800"
                          >
                            WCAG {crit}
                          </span>
                        ))}
                        <Link
                          href={`/findings/${finding.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
                        >
                          <span>Remediate</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {finding.ruleTitle}
                      </h3>
                      <p className="text-xs text-apple-muted mt-0.5">
                        {finding.ruleDescription}
                      </p>
                    </div>

                    {/* Selector & HTML Snippet Evidence */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-slate-300 bg-apple-elevated/70 px-3 py-1.5 rounded border border-apple-border/80 truncate">
                        <span className="text-apple-muted mr-1.5 font-sans">Selector:</span>
                        {finding.selector}
                      </div>

                      <SanitizedCodeBlock
                        code={finding.htmlSnippet}
                        label="DOM HTML Evidence"
                        maxHeight="max-h-24"
                      />
                    </div>

                    {finding.failureSummary && (
                      <div className="text-xs text-slate-300 bg-apple-elevated/30 p-2.5 rounded border border-apple-border/60">
                        <span className="font-semibold text-apple-muted block text-[11px] mb-0.5">
                          Axe Failure Diagnostics:
                        </span>
                        <pre className="font-mono text-[11px] text-rose-300 whitespace-pre-wrap">
                          {finding.failureSummary}
                        </pre>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: GUIDED MANUAL CHECKLIST */}
      {activeTab === "manual" && (
        <section aria-labelledby="manual-checklist-title" className="space-y-6">
          <div className="p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl text-xs text-blue-200">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-white">
                  WCAG-EM Human Evaluation Required
                </p>
                <p className="text-blue-300 mt-0.5">
                  Automated axe-core scans cover approximately 30-40% of WCAG criteria. Complete evaluation requires manual keyboard navigation, screen reader testing, and responsive reflow verification.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {categories.map((category) => {
              const categoryItems = checklist.filter((c) => c.category === category);

              return (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 border-b border-apple-border pb-1.5">
                    {category}
                  </h3>

                  <div className="space-y-4">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-apple-elevated text-blue-300 border border-apple-border">
                                {item.criterion}
                              </span>
                              <h4 className="text-sm font-semibold text-white">
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-xs text-apple-muted mt-1">
                              {item.description}
                            </p>
                          </div>

                          {/* Status Radios */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {[
                              { val: "PASS", label: "Pass", color: "bg-emerald-950 text-emerald-300 border-emerald-800" },
                              { val: "FAIL", label: "Fail", color: "bg-red-950 text-red-300 border-red-800" },
                              { val: "NOT_APPLICABLE", label: "N/A", color: "bg-slate-800 text-slate-300 border-slate-700" },
                              { val: "NOT_TESTED", label: "Untested", color: "bg-apple-elevated text-apple-muted border-apple-border" },
                            ].map((s) => (
                              <button
                                key={s.val}
                                type="button"
                                onClick={() => handleUpdateManualItem(item, s.val)}
                                className={`px-2.5 py-1 text-xs rounded font-medium border transition-colors ${
                                  item.status === s.val
                                    ? s.color + " font-bold shadow-sm"
                                    : "bg-apple-surface text-apple-muted border-apple-border hover:bg-apple-elevated"
                                }`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Methodology instructions */}
                        <div className="text-[11px] text-slate-300 bg-apple-elevated/40 p-3 rounded-lg border border-apple-border/70">
                          <span className="font-semibold text-apple-muted block mb-0.5">
                            How to test:
                          </span>
                          {item.methodologyInstructions}
                        </div>

                        {/* N/A Reason requirement */}
                        {item.status === "NOT_APPLICABLE" && (
                          <div>
                            <label className="block text-[11px] font-semibold text-amber-300 mb-1">
                              Justification for Not Applicable status (Required):
                            </label>
                            <input
                              type="text"
                              defaultValue={item.naReason || ""}
                              placeholder="e.g. Page contains no video content or multimedia."
                              onBlur={(e) =>
                                handleUpdateManualItem(item, item.status, item.notes || undefined, e.target.value)
                              }
                              className="w-full bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
                            />
                          </div>
                        )}

                        {/* Notes input */}
                        <div>
                          <label className="block text-[11px] font-semibold text-apple-muted mb-1">
                            Evaluator Notes &amp; Observations:
                          </label>
                          <textarea
                            rows={2}
                            defaultValue={item.notes || ""}
                            placeholder="Add reproduction steps, browser/screen reader combinations, or notes..."
                            onBlur={(e) =>
                              handleUpdateManualItem(item, item.status, e.target.value, item.naReason || undefined)
                            }
                            className="w-full bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 3: REGRESSION DIFF */}
      {activeTab === "regression" && (
        <section aria-labelledby="regression-title" className="space-y-6">
          <div className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-4">
            <div>
              <h2 id="regression-title" className="text-base font-semibold text-white">
                Compare Against Baseline Audit
              </h2>
              <p className="text-xs text-apple-muted mt-0.5">
                Detect newly introduced accessibility regressions and verify resolved findings between audit runs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select
                value={selectedBaselineId}
                onChange={(e) => setSelectedBaselineId(e.target.value)}
                className="bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
              >
                {availableBaselines.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({new Date(b.startedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={isComparing || !selectedBaselineId}
                onClick={handleRunComparison}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus disabled:opacity-50"
              >
                {isComparing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    <span>Analyzing Diffs...</span>
                  </>
                ) : (
                  <>
                    <GitCompare className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Run Comparison</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {comparisonDiff && (
            <div className="space-y-6">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl">
                  <span className="text-xs text-red-300 font-semibold block">
                    Newly Introduced Regressions
                  </span>
                  <span className="text-2xl font-bold text-red-400 mt-1 block">
                    +{comparisonDiff.summary.newCount}
                  </span>
                </div>

                <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
                  <span className="text-xs text-emerald-300 font-semibold block">
                    Issues Resolved / Fixed
                  </span>
                  <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                    -{comparisonDiff.summary.fixedCount}
                  </span>
                </div>

                <div className="p-4 bg-apple-surface border border-apple-border rounded-xl">
                  <span className="text-xs text-apple-muted font-semibold block">
                    Persistent Findings
                  </span>
                  <span className="text-2xl font-bold text-white mt-1 block">
                    {comparisonDiff.summary.persistentCount}
                  </span>
                </div>
              </div>

              {/* Regressions list */}
              {comparisonDiff.newFindings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    Newly Detected Violations (Regressions)
                  </h3>
                  <div className="space-y-3">
                    {comparisonDiff.newFindings.map((f: any) => (
                      <div
                        key={f.id}
                        className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <SeverityBadge impact={f.impact} />
                            <span className="font-mono text-xs font-bold text-white">
                              {f.ruleId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 font-mono">
                            {f.selector}
                          </p>
                        </div>
                        <Link
                          href={`/findings/${f.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          View Finding &rarr;
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolved list */}
              {comparisonDiff.fixedFindings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Resolved Findings (No Longer Present)
                  </h3>
                  <div className="space-y-3">
                    {comparisonDiff.fixedFindings.map((f: any) => (
                      <div
                        key={f.id}
                        className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">
                              {f.ruleId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 font-mono">
                            {f.selector}
                          </p>
                        </div>
                        <span className="text-xs text-emerald-400 font-semibold">
                          Resolved in this run
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
