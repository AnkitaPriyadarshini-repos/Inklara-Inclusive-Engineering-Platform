"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { SanitizedCodeBlock } from "@/components/SanitizedCodeBlock";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Loader2,
  BookOpen,
  Code2,
  Sparkles,
} from "lucide-react";
import type { Finding, AuditRun, ScannedPage } from "@prisma/client";
import type { RemediationGuidance } from "@/lib/remediation/catalog";
import type { WcagCriterion } from "@/lib/wcag/catalog";

interface FindingWithRelations extends Finding {
  auditRun: { id: string; name: string; targetUrl: string; projectId: string };
  scannedPage?: ScannedPage | null;
}

interface FindingDetailClientProps {
  finding: FindingWithRelations;
  guidance: RemediationGuidance;
  criteria: WcagCriterion[];
}

export function FindingDetailClient({
  finding,
  guidance,
  criteria,
}: FindingDetailClientProps) {
  const router = useRouter();

  // Status and Notes State
  const [currentStatus, setCurrentStatus] = useState(finding.status);
  const [naReason, setNaReason] = useState(finding.naReason || "");
  const [remediationNotes, setRemediationNotes] = useState(finding.remediationNotes || "");
  const [remediationCode, setRemediationCode] = useState(finding.remediationCode || "");
  const [overrideUrl, setOverrideUrl] = useState(
    finding.scannedPage?.url || finding.auditRun.targetUrl
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSaveStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setVerificationFeedback(null);

    try {
      const res = await fetch(`/api/findings/${finding.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentStatus,
          naReason: currentStatus === "NOT_APPLICABLE" ? naReason : undefined,
          remediationNotes: remediationNotes || undefined,
          remediationCode: remediationCode || undefined,
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyFix = async () => {
    setIsVerifying(true);
    setVerificationFeedback(null);

    try {
      const res = await fetch(`/api/findings/${finding.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overrideUrl: overrideUrl.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.verifiedFixed) {
        setCurrentStatus("VERIFIED_FIXED");
        setVerificationFeedback({
          success: true,
          message: data.message,
        });
        router.refresh();
      } else {
        setVerificationFeedback({
          success: false,
          message: data.message || "Rule is still failing on the target element.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setVerificationFeedback({
        success: false,
        message: `Verification scan failed: ${msg}`,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          href={`/audits/${finding.auditRunId}`}
          className="inline-flex items-center gap-1.5 text-xs text-apple-muted hover:text-white mb-3 transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus rounded px-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Audit Results ({finding.auditRun.name})</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <SeverityBadge impact={finding.impact} />
              <span className="font-mono text-xs font-bold text-white bg-apple-elevated px-2.5 py-1 rounded border border-apple-border">
                {finding.ruleId}
              </span>
              <StatusBadge status={currentStatus} />
            </div>

            <h1 className="text-xl font-bold text-white">{finding.ruleTitle}</h1>
            <p className="text-xs text-apple-muted mt-1 max-w-3xl">
              {finding.ruleDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {finding.ruleHelpUrl && (
              <a
                href={finding.ruleHelpUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
              >
                <span>Axe Documentation</span>
                <ExternalLink className="w-3 h-3 text-apple-muted" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Diagnostics, Evidence & WCAG mappings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Affected Element & DOM Evidence */}
          <section aria-labelledby="evidence-heading" className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-4">
            <h2 id="evidence-heading" className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
              Affected Element Evidence
            </h2>

            <div>
              <span className="text-xs font-semibold text-apple-muted block mb-1">
                CSS Selector Path:
              </span>
              <div className="p-2.5 bg-apple-elevated border border-apple-border rounded-lg font-mono text-xs text-blue-300 select-all overflow-x-auto">
                {finding.selector}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-apple-muted block mb-1">
                Sanitized DOM Snippet:
              </span>
              <SanitizedCodeBlock
                code={finding.htmlSnippet}
                label="Rendered HTML"
                maxHeight="max-h-36"
              />
            </div>

            {finding.failureSummary && (
              <div>
                <span className="text-xs font-semibold text-apple-muted block mb-1">
                  Engine Failure Diagnostics:
                </span>
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg text-xs font-mono text-red-200 whitespace-pre-wrap">
                  {finding.failureSummary}
                </div>
              </div>
            )}
          </section>

          {/* Actionable Remediation Guidance */}
          <section aria-labelledby="remediation-heading" className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <h2 id="remediation-heading" className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                Actionable Remediation Guidance
              </h2>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white mb-1">
                Underlying Technical Cause:
              </h3>
              <p className="text-xs text-apple-muted leading-relaxed">
                {guidance.technicalCause}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white mb-1">
                Recommended Solution:
              </h3>
              <p className="text-xs text-apple-muted leading-relaxed">
                {guidance.actionableFix}
              </p>
            </div>

            {/* Illustrative Before & After Code Example */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-white">
                Illustrative Code Fix Comparison:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <SanitizedCodeBlock
                    code={guidance.codeExample.problematic}
                    label="Problematic Pattern"
                    maxHeight="max-h-36"
                  />
                </div>
                <div>
                  <SanitizedCodeBlock
                    code={guidance.codeExample.remediated}
                    label="Remediated Semantic HTML"
                    maxHeight="max-h-36"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white mb-1">
                Design &amp; Engineering Trade-offs:
              </h3>
              <p className="text-xs text-apple-muted leading-relaxed">
                {guidance.tradeoffs}
              </p>
            </div>
          </section>

          {/* WCAG Criteria Mapping */}
          <section aria-labelledby="wcag-mapping-heading" className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              <h2 id="wcag-mapping-heading" className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                Mapped WCAG 2.2 Success Criteria
              </h2>
            </div>

            {criteria.length === 0 ? (
              <p className="text-xs text-apple-muted">
                Rule classified under general best practices or accessibility heuristics.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {criteria.map((crit) => (
                  <div
                    key={crit.id}
                    className="p-4 bg-apple-elevated/40 border border-apple-border rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                          Criterion {crit.num}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {crit.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          (Level {crit.level})
                        </span>
                      </div>

                      <a
                        href={crit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 underline"
                      >
                        <span>Understanding {crit.num}</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
                    <p className="text-xs text-apple-muted">
                      {crit.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Finding Lifecycle & Verification */}
        <div className="space-y-6">
          {/* Finding Lifecycle Management */}
          <section aria-labelledby="status-heading" className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-4">
            <h2 id="status-heading" className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
              Remediation Lifecycle
            </h2>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label htmlFor="finding-status-select" className="block font-semibold text-slate-300 mb-1.5">
                  Verification Status:
                </label>
                <select
                  id="finding-status-select"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
                >
                  <option value="OPEN">Open (Confirmed Violation)</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="FIXED_PENDING_VERIFICATION">
                    Fixed (Pending Verification)
                  </option>
                  <option value="VERIFIED_FIXED">Verified Fixed</option>
                  <option value="NEEDS_FURTHER_REVIEW">Needs Further Review</option>
                  <option value="NOT_APPLICABLE">
                    Not Applicable (Justification Required)
                  </option>
                </select>
              </div>

              {currentStatus === "NOT_APPLICABLE" && (
                <div>
                  <label htmlFor="na-reason-input" className="block font-semibold text-amber-300 mb-1">
                    Required Justification for N/A:
                  </label>
                  <textarea
                    id="na-reason-input"
                    rows={2}
                    required
                    value={naReason}
                    onChange={(e) => setNaReason(e.target.value)}
                    placeholder="Document why this finding does not apply in this context..."
                    className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none resize-none"
                  />
                </div>
              )}

              <div>
                <label htmlFor="remediation-notes-input" className="block font-semibold text-slate-300 mb-1">
                  Developer Remediation Log / Notes:
                </label>
                <textarea
                  id="remediation-notes-input"
                  rows={3}
                  value={remediationNotes}
                  onChange={(e) => setRemediationNotes(e.target.value)}
                  placeholder="Record PR links, commit hashes, or technical fix details..."
                  className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none resize-none"
                />
              </div>

              <div>
                <label htmlFor="remediation-code-input" className="block font-semibold text-slate-300 mb-1">
                  Applied Code Snippet:
                </label>
                <textarea
                  id="remediation-code-input"
                  rows={3}
                  value={remediationCode}
                  onChange={(e) => setRemediationCode(e.target.value)}
                  placeholder="Paste applied HTML or component fix..."
                  className="w-full bg-apple-elevated border border-apple-border text-white font-mono text-[11px] rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Status & Log"}
              </button>
            </form>
          </section>

          {/* Interactive Re-run Verification Workflow */}
          <section aria-labelledby="verify-heading" className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <h2 id="verify-heading" className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
                Fix Verification Engine
              </h2>
            </div>

            <p className="text-xs text-apple-muted">
              Re-scans the target page with Playwright and axe-core to verify whether violation &apos;{finding.ruleId}&apos; is genuinely resolved.
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="verify-url-input" className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Verification URL:
                </label>
                <input
                  id="verify-url-input"
                  type="url"
                  value={overrideUrl}
                  onChange={(e) => setOverrideUrl(e.target.value)}
                  className="w-full bg-apple-elevated border border-apple-border text-white font-mono text-[11px] rounded-lg px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
                />
              </div>

              {verificationFeedback && (
                <div
                  role="alert"
                  className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
                    verificationFeedback.success
                      ? "bg-emerald-950/60 border border-emerald-800 text-emerald-200"
                      : "bg-red-950/60 border border-red-800 text-red-200"
                  }`}
                >
                  {verificationFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {verificationFeedback.success ? "Verified Resolved" : "Verification Failed"}
                    </p>
                    <p className="mt-0.5">{verificationFeedback.message}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerifyFix}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    <span>Executing Verification Scan...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Re-test &amp; Verify Fix</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
