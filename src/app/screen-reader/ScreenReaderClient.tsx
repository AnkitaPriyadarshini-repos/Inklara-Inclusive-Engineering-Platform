"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Volume2,
  Play,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Laptop,
  Terminal,
  ShieldAlert,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import type {
  ScreenReaderScenario,
  VoiceOverPlatformStatus,
  ScenarioEvaluationResult,
} from "@/lib/screenreader/types";

interface ScreenReaderClientProps {
  initialScenarios: ScreenReaderScenario[];
  initialPlatformStatus: VoiceOverPlatformStatus;
}

export function ScreenReaderClient({
  initialScenarios,
  initialPlatformStatus,
}: ScreenReaderClientProps) {
  const [scenarios] = useState<ScreenReaderScenario[]>(initialScenarios);
  const [platformStatus] = useState<VoiceOverPlatformStatus>(initialPlatformStatus);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarios[0]?.id || "modal-dialog"
  );
  const [targetUrl, setTargetUrl] = useState<string>(
    "http://localhost:3000/demo/screen-reader"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<ScenarioEvaluationResult | null>(null);

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  const handleRunEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/screen-reader/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: targetUrl.trim(),
          scenarioId: selectedScenarioId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Scenario evaluation failed.");
      }

      setEvaluationResult(data.result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-5 border-b border-apple-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                Screen Reader Testing Workbench
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-apple-elevated text-apple-muted border border-apple-border">
                Screen Reader &amp; VoiceOver Protocol
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Screen Reader Scenario Runner &amp; Announcement Timeline
            </h1>
            <p className="text-xs text-apple-muted mt-1 max-w-3xl">
              Inspects live DOM elements against expected screen reader behavior, evaluates computed Accessibility Tree nodes, and sequences chronological speech announcements.
            </p>
          </div>

          <Link
            href="/demo/screen-reader"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span>Open Screen Reader Fixture</span>
            <ExternalLink className="w-3 h-3 text-apple-muted" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* VoiceOver Platform Status Card */}
      <section
        aria-labelledby="platform-status-heading"
        className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              <Laptop className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="platform-status-heading" className="text-sm font-bold text-white flex items-center gap-2">
                Assistive Technology Environment
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-apple-elevated border border-apple-border text-slate-300">
                  OS: {platformStatus.osPlatform}
                </span>
              </h2>
              <p className="text-[11px] text-apple-muted">
                {platformStatus.isMacOS
                  ? "macOS Darwin environment detected."
                  : "Windows/Linux host environment detected."}
              </p>
            </div>
          </div>

          <div>
            {platformStatus.isMacOS && platformStatus.voiceOverRunning ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>VoiceOver Active</span>
              </span>
            ) : platformStatus.isMacOS ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                <Info className="w-3.5 h-3.5" aria-hidden="true" />
                <span>VoiceOver Standby (Cmd+F5)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                <Info className="w-3.5 h-3.5" aria-hidden="true" />
                <span>A11y Tree Inspector Mode</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-apple-muted leading-relaxed">
          {platformStatus.message}
        </p>

        <div className="p-3 bg-apple-elevated/40 border border-apple-border/70 rounded-lg text-[11px] text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Integrity Policy on Screen Reader Output</span>
          </div>
          <p className="text-apple-muted">
            Inklara never hallucinates or fabricates VoiceOver auditory speech from DOM heuristics. It evaluates computed Accessibility Tree roles, names, descriptions, and ARIA live politeness, guiding the evaluator through official VoiceOver keyboard navigation sequences.
          </p>
        </div>
      </section>

      {/* Scenario Execution Form */}
      <section aria-labelledby="runner-heading" className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-5">
        <h2 id="runner-heading" className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
          Run Screen Reader Scenario
        </h2>

        <form onSubmit={handleRunEvaluation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario Selection */}
            <div>
              <label htmlFor="sr-scenario-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Evaluation Scenario <span className="text-red-400">*</span>
              </label>
              <select
                id="sr-scenario-select"
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
                className="w-full bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-2.5 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
              >
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title} ({sc.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Target URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="sr-url-input" className="block text-xs font-semibold text-slate-300">
                  Target Page URL <span className="text-red-400">*</span>
                </label>
                <span className="text-[11px] text-apple-muted font-mono">SSRF Protected</span>
              </div>
              <input
                id="sr-url-input"
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="http://localhost:3000/demo/screen-reader"
                className="w-full bg-apple-elevated border border-apple-border text-white text-xs font-mono rounded-lg px-3 py-2.5 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <span className="text-apple-muted font-medium">Evaluation Presets:</span>
            <button
              type="button"
              onClick={() => {
                setTargetUrl("http://localhost:3000/demo/screen-reader");
                setSelectedScenarioId("modal-dialog");
              }}
              className="px-2.5 py-1 bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/60 text-blue-300 rounded transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
            >
              ⚡ Controlled Screen Reader Fixture
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetUrl("http://localhost:3000/demo/accessible");
                setSelectedScenarioId("icon-button");
              }}
              className="px-2.5 py-1 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 rounded transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
            >
              ✓ Remediated Accessible Store
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetUrl("http://localhost:3000/demo/inaccessible");
                setSelectedScenarioId("form-validation");
              }}
              className="px-2.5 py-1 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 text-red-300 rounded transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
            >
              ⚡ Inaccessible Portal
            </button>
          </div>

          {/* Scenario Overview Preview */}
          {selectedScenario && (
            <div className="p-3.5 bg-apple-elevated/40 border border-apple-border rounded-lg text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{selectedScenario.title}</span>
                <span className="text-[10px] text-blue-400 font-mono">
                  WCAG {selectedScenario.wcagCriterion}
                </span>
              </div>
              <p className="text-apple-muted leading-relaxed">
                {selectedScenario.description}
              </p>
              <div className="text-[11px] text-slate-400">
                <strong>Steps: </strong> {selectedScenario.testSteps.length} interactive test actions sequenced.
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-red-200 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">Evaluation Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Evaluating Live DOM &amp; Accessibility Tree...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Run Scenario Evaluation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Announcement Timeline Output */}
      {evaluationResult && (
        <section aria-labelledby="timeline-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 bg-apple-surface border border-apple-border rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="timeline-heading" className="text-lg font-bold text-white">
                  Announcement Timeline: {evaluationResult.scenarioTitle}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                    evaluationResult.status === "PASS"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : evaluationResult.status === "FAIL"
                      ? "bg-red-950 text-red-300 border-red-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}
                >
                  {evaluationResult.status === "PASS"
                    ? "Pass (Verified)"
                    : evaluationResult.status === "FAIL"
                    ? "Defects Detected"
                    : "Needs Manual Auditory Review"}
                </span>
              </div>
              <p className="text-xs text-apple-muted mt-0.5">
                Target: <span className="font-mono text-slate-300">{evaluationResult.targetUrl}</span> • Evaluated {new Date(evaluationResult.timestamp).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-emerald-400 font-semibold">
                {evaluationResult.summary.passedSteps} Passed
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-red-400 font-semibold">
                {evaluationResult.summary.failedSteps} Failed
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-semibold">
                {evaluationResult.summary.manualReviewSteps} Manual Review
              </span>
            </div>
          </div>

          {/* Timeline Stream */}
          <div className="space-y-4">
            {evaluationResult.timeline.map((event) => (
              <div
                key={event.stepNumber}
                className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-4 relative"
              >
                {/* Step header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-apple-border/70 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-apple-elevated border border-apple-border text-xs font-bold text-white flex items-center justify-center">
                      {event.stepNumber}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      Action: {event.userAction}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${
                      event.status === "PASS"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : event.status === "FAIL"
                        ? "bg-red-950 text-red-300 border-red-800"
                        : "bg-amber-950 text-amber-300 border-amber-800"
                    }`}
                  >
                    {event.status === "PASS"
                      ? "Pass"
                      : event.status === "FAIL"
                      ? "Fail"
                      : "Manual Review"}
                  </span>
                </div>

                {/* Expected vs Observed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Expected Announcement */}
                  <div className="p-3.5 bg-apple-elevated/40 border border-apple-border rounded-lg space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Expected Screen Reader Speech</span>
                    </div>
                    <p className="font-mono text-[11px] text-white bg-slate-950/80 p-2 rounded border border-slate-800">
                      &quot;{event.expectedAnnouncement}&quot;
                    </p>
                    <div className="text-[11px] text-apple-muted space-y-0.5">
                      <p>
                        <strong>Expected Role:</strong> <code className="text-blue-300">{event.expectedProperties.role}</code>
                      </p>
                      {event.expectedProperties.name && (
                        <p>
                          <strong>Expected Name:</strong> {event.expectedProperties.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Computed Accessibility Tree */}
                  <div className="p-3.5 bg-apple-elevated/40 border border-apple-border rounded-lg space-y-2">
                    <div className="flex items-center justify-between font-semibold text-slate-300">
                      <span>Observed Accessibility Tree Node</span>
                      <span className="text-[10px] text-apple-muted font-mono">
                        {event.observedProperties?.tagName || "not found"}
                      </span>
                    </div>

                    {event.observedProperties ? (
                      <div className="space-y-1 text-[11px]">
                        <p>
                          <strong className="text-apple-muted">Computed Role:</strong>{" "}
                          <span className="font-mono text-emerald-300">
                            {event.observedProperties.role}
                          </span>
                        </p>
                        <p>
                          <strong className="text-apple-muted">Accessible Name:</strong>{" "}
                          <span className="text-white">
                            {event.observedProperties.name || <em className="text-red-400 font-sans">Empty accessible name!</em>}
                          </span>
                        </p>
                        {event.observedProperties.description && (
                          <p>
                            <strong className="text-apple-muted">Description:</strong>{" "}
                            <span className="text-slate-300">
                              {event.observedProperties.description}
                            </span>
                          </p>
                        )}
                        <p>
                          <strong className="text-apple-muted">Selector:</strong>{" "}
                          <span className="font-mono text-[10px] text-slate-400 select-all">
                            {event.observedProperties.selector}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-red-400 italic text-[11px]">
                        Element was not found in target page DOM.
                      </p>
                    )}
                  </div>
                </div>

                {/* Diagnostics and reproduction instructions */}
                <div className="pt-2 border-t border-apple-border/70 text-xs space-y-2">
                  <p className="text-apple-muted">
                    <strong className="text-white">Diagnostic verdict: </strong>
                    {event.explanation}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 bg-apple-elevated/30 p-2.5 rounded-lg border border-apple-border/60">
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-blue-400" aria-hidden="true" />
                      VoiceOver Test Commands:
                    </span>
                    {event.voiceOverKeyCommands.map((cmd) => (
                      <span
                        key={cmd}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-blue-300"
                      >
                        {cmd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
