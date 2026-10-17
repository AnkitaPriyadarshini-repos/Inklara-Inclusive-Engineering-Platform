"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  CheckCircle2,
  AlertTriangle,
  Code2,
  FileText,
  ShieldCheck,
  ArrowRight,
  Layers,
  Sparkles,
  Copy,
  Check,
  FileCheck2,
} from "lucide-react";

export interface DemoStage {
  id: number;
  number: string;
  label: string;
  title: string;
  summary: string;
  tagline: string;
}

const STAGES: DemoStage[] = [
  {
    id: 1,
    number: "01",
    label: "Discover",
    title: "Automated Sandbox Scan",
    summary:
      "Inklara scans the live application DOM in an isolated Chromium browser to detect programmatic WCAG barriers.",
    tagline: "Headless axe-core 4.10.2 browser inspection",
  },
  {
    id: 2,
    number: "02",
    label: "Inspect",
    title: "Diagnostic Evidence & Tree",
    summary:
      "Every finding includes exact DOM paths, relative luminance mathematics, and computed accessibility tree snapshots.",
    tagline: "Computed contrast mathematics and DOM selectors",
  },
  {
    id: 3,
    number: "03",
    label: "Remediate",
    title: "Before & After Code Remediation",
    summary:
      "Side-by-side code corrections showing exact CSS and HTML changes with calculated contrast improvements.",
    tagline: "Engineered code patches for WCAG 2.2 Level AA compliance",
  },
  {
    id: 4,
    number: "04",
    label: "Verify",
    title: "Deterministic Fix Verification",
    summary:
      "Re-scanning the DOM and diffing against SHA-256 finding signatures to confirm the fix persists without regressions.",
    tagline: "Playwright re-scan and cryptographic signature verification",
  },
  {
    id: 5,
    number: "05",
    label: "Report",
    title: "Compliance Artifacts & Reporting",
    summary:
      "Deliver stakeholder-ready compliance documentation, executive summaries, and CI/CD-consumable audit manifests.",
    tagline: "PDF export, JSON audit manifests, and compliance scoring",
  },
];

const STAGE_DURATION_MS = 6000;

export function AnimatedProductDemo() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [srAnnouncement, setSrAnnouncement] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) setIsPlaying(false);
      const listener = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) setIsPlaying(false);
      };
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalStep = 50;
    const duration = STAGE_DURATION_MS / playbackSpeed;
    const stepIncrement = (intervalStep / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStage((curr) => {
            const next = curr >= 5 ? 1 : curr + 1;
            setSrAnnouncement(
              `Demonstration stage ${next}: ${STAGES[next - 1].label} — ${STAGES[next - 1].title}`
            );
            return next;
          });
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleStageSelect = (stageId: number) => {
    setCurrentStage(stageId);
    setProgress(0);
    setSrAnnouncement(
      `Selected stage ${stageId}: ${STAGES[stageId - 1].label} — ${STAGES[stageId - 1].title}`
    );
  };

  const handleNextStage = () => {
    setCurrentStage((prev) => {
      const next = prev >= 5 ? 1 : prev + 1;
      setProgress(0);
      setSrAnnouncement(`Next stage ${next}: ${STAGES[next - 1].label}`);
      return next;
    });
  };

  const handlePrevStage = () => {
    setCurrentStage((prev) => {
      const prevStage = prev <= 1 ? 5 : prev - 1;
      setProgress(0);
      setSrAnnouncement(`Previous stage ${prevStage}: ${STAGES[prevStage - 1].label}`);
      return prevStage;
    });
  };

  const handleRestart = () => {
    setCurrentStage(1);
    setProgress(0);
    setIsPlaying(true);
    setSrAnnouncement("Demonstration restarted at Stage 1: Discover");
  };

  const activeStage = STAGES[currentStage - 1];

  return (
    <div
      aria-label="Interactive Inklara Product Demonstration"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* Top Header: Unobtrusive Playback Controls & Status */}
      <div className="px-5 sm:px-8 py-3.5 border-b border-slate-200/80 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-xs font-semibold text-slate-800 tracking-tight">
            Workflow Demonstration
          </span>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
            •
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Stage {activeStage.number} of 05
          </span>
          <span className="hidden md:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Sample Scenario Data
          </span>
        </div>

        {/* Minimal Accessible Toolbar */}
        <div
          className="flex items-center gap-1.5"
          role="toolbar"
          aria-label="Demonstration Controls"
        >
          <button
            type="button"
            onClick={handlePrevStage}
            aria-label="Previous stage"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            <SkipBack className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause demonstration" : "Play demonstration"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNextStage}
            aria-label="Next stage"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            <SkipForward className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart demonstration"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : 1)}
            aria-label={`Playback speed: ${playbackSpeed}x. Click to switch.`}
            className="text-[11px] font-mono font-medium px-2 py-1 rounded-md bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Stage Progression Tabs: Horizontal Scroll on Mobile, 5-col Grid on Desktop */}
      <nav
        aria-label="Demonstration Stages"
        className="border-b border-slate-200/80 bg-white overflow-x-auto scrollbar-none"
      >
        <div className="flex sm:grid sm:grid-cols-5 divide-x divide-slate-100 min-w-full sm:min-w-0">
          {STAGES.map((s) => {
            const isActive = currentStage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStageSelect(s.id)}
                aria-current={isActive ? "step" : undefined}
                className={`relative shrink-0 sm:shrink px-4 sm:px-5 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none ${
                  isActive
                    ? "bg-slate-50/90 text-slate-900 font-semibold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-semibold ${
                      isActive ? "text-indigo-600" : "text-slate-600"
                    }`}
                  >
                    {s.number}
                  </span>
                  <span className="text-sm font-medium tracking-tight whitespace-nowrap">
                    {s.label}
                  </span>
                </div>

                {/* Subtle active progress indicator line */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200"
                    aria-hidden="true"
                  >
                    {isPlaying && !prefersReducedMotion ? (
                      <div
                        className="h-full bg-indigo-600 transition-all duration-75"
                        style={{ width: `${progress}%` }}
                      />
                    ) : (
                      <div className="h-full bg-indigo-600 w-full" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Active Stage Context Header: Clean Editorial Typography */}
      <div className="px-5 sm:px-8 py-6 border-b border-slate-100 bg-white">
        <div className="space-y-1.5 max-w-4xl">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {activeStage.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {activeStage.summary}
          </p>
        </div>
      </div>

      {/* Main Stage Demonstration Body */}
      <div className="p-5 sm:p-8 lg:p-10 bg-slate-50/30">
        {/* ========================================================= */}
        {/* STAGE 1: DISCOVER                                         */}
        {/* ========================================================= */}
        {currentStage === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
              {/* Scan Target Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      Target: Checkout Application
                    </span>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      https://app.example.com/checkout
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Sample Scenario Fixture
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Evaluated via headless Chromium (1280x720) with axe-core 4.10.2 rule engine (52 automated rules evaluated)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    7 Violations Found
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    45 Rules Passed
                  </span>
                </div>
              </div>

              {/* Real Findings Discovered */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Programmatic Findings Detected
                </div>

                {/* Primary Finding (Focus of the walkthrough) */}
                <div className="p-4 sm:p-5 rounded-xl border-2 border-indigo-500/20 bg-indigo-50/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Serious
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-900">
                        color-contrast (WCAG 1.4.3 Level AA)
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-600">
                      Selector: p.checkout-disclaimer
                    </span>
                  </div>

                  <p className="text-sm text-slate-800 leading-relaxed">
                    Element has insufficient color contrast ratio of{" "}
                    <strong className="text-rose-700 font-bold">2.34 : 1</strong>{" "}
                    (foreground: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">#a1a1aa</code>, background: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">#f1f5f9</code>; relative luminances L1: 0.9085, L2: 0.3597).
                    The required minimum ratio for standard body text is{" "}
                    <strong className="text-emerald-700 font-bold">4.50 : 1</strong>.
                  </p>

                  <div className="text-xs text-indigo-700 font-medium flex items-center gap-1.5 pt-1">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Selected for deep inspection and code remediation in Stages 02 & 03.</span>
                  </div>
                </div>

                {/* Secondary Finding 1 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Critical
                      </span>
                      <span className="font-mono font-semibold text-slate-800">
                        image-alt (WCAG 1.1.1 Level A)
                      </span>
                      <span className="text-slate-600 font-mono">img.hero-product</span>
                    </div>
                    <p className="text-slate-600">
                      Informative image element lacks an alt attribute, withholding context from screen-reader users.
                    </p>
                  </div>
                  <span className="text-slate-600 shrink-0 font-medium">Pending queue (Issue 2/7)</span>
                </div>

                {/* Secondary Finding 2 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Critical
                      </span>
                      <span className="font-mono font-semibold text-slate-800">
                        button-name (WCAG 4.1.2 Level A)
                      </span>
                      <span className="text-slate-600 font-mono">button.primary-checkout</span>
                    </div>
                    <p className="text-slate-600">
                      Button contains an icon but lacks an accessible name or inner text for assistive technologies.
                    </p>
                  </div>
                  <span className="text-slate-600 shrink-0 font-medium">Pending queue (Issue 3/7)</span>
                </div>
              </div>

              {/* Stage Transition Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs text-slate-600">
                  Ready to inspect mathematical contrast proof and DOM tree coordinates?
                </span>
                <button
                  type="button"
                  onClick={handleNextStage}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
                >
                  <span>Proceed to Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 2: INSPECT                                          */}
        {/* ========================================================= */}
        {currentStage === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Finding Diagnostic Math */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                        Serious Severity
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-700">
                        rule: color-contrast
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      WCAG 1.4.3 Level AA — Contrast (Minimum)
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 self-start">
                    Defect #01
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  The calculated contrast ratio between text foreground (
                  <code className="text-indigo-900 bg-slate-100 px-1 py-0.5 rounded font-mono">
                    #a1a1aa
                  </code>
                  ) and container background (
                  <code className="text-indigo-900 bg-slate-100 px-1 py-0.5 rounded font-mono">
                    #f1f5f9
                  </code>
                  ) is <strong className="text-rose-700 font-bold">2.34 : 1</strong>.
                  Standard text requires at least{" "}
                  <strong className="text-emerald-700 font-bold">4.50 : 1</strong> for
                  adequate legibility under WCAG 2.2 Level AA.
                </p>

                {/* Mathematical Derivation Box */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>WCAG Relative Luminance Derivation</span>
                    <span className="font-mono text-indigo-700">(L1 + 0.05) / (L2 + 0.05)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Luminance values: L1 (background) = 0.9085, L2 (foreground) = 0.3597. Contrast = (0.9085 + 0.05) / (0.3597 + 0.05) = <strong>2.34 : 1</strong>.
                    APCA rating evaluates to <strong>Lc 46.6</strong> (below standard content threshold of Lc 60).
                  </p>
                </div>

                {/* DOM Selector with Copy Action */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono flex items-center justify-between text-slate-800 gap-2">
                  <span className="truncate pr-2">
                    p.checkout-disclaimer[style*=&quot;color: #a1a1aa&quot;]
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("p.checkout-disclaimer");
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-indigo-600 hover:text-indigo-800 shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy Selector</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Computed Luminance Mathematical Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-rose-700 block tracking-wider">
                      Measured Contrast
                    </span>
                    <span className="text-2xl font-black text-rose-900 mt-1 block">
                      2.34 : 1
                    </span>
                    <span className="text-xs text-rose-700 font-medium block mt-0.5">
                      Fails AA by 2.16 (APCA Lc 46.6)
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-emerald-700 block tracking-wider">
                      Required Threshold
                    </span>
                    <span className="text-2xl font-black text-emerald-900 mt-1 block">
                      4.50 : 1
                    </span>
                    <span className="text-xs text-emerald-700 font-medium block mt-0.5">
                      WCAG 2.2 AA Standard (APCA Lc 60+)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Computed Accessibility Tree */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Computed Accessibility Tree Node
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-slate-200 space-y-2 border border-slate-800 leading-relaxed overflow-x-auto">
                    <div className="text-slate-400">{"// Chromium A11y Tree Snapshot"}</div>
                    <div>
                      <span className="text-indigo-300">role:</span> &quot;paragraph&quot;
                    </div>
                    <div>
                      <span className="text-indigo-300">name:</span> &quot;Please review billing terms...&quot;
                    </div>
                    <div>
                      <span className="text-indigo-300">computedContrast:</span>{" "}
                      <span className="text-rose-400 font-bold">2.34</span>
                    </div>
                    <div>
                      <span className="text-indigo-300">focusable:</span> false
                    </div>
                    <div>
                      <span className="text-indigo-300">parent:</span> &quot;form#checkout-payment&quot;
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                    <span>Cryptographic Finding Signature</span>
                  </div>
                  <p className="font-mono text-slate-600 truncate text-[11px]">
                    SHA-256: d8c9f28a7b3e01bc4992147ef5c982
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
                  >
                    <span>Proceed to Code Remediation</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 3: REMEDIATE (Before & After Comparison)            */}
        {/* ========================================================= */}
        {currentStage === 3 && (
          <div className="space-y-6">
            {/* Side-by-Side Before & After Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BEFORE: Original Implementation */}
              <div className="bg-white rounded-xl border border-rose-200 p-5 sm:p-7 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-3 border-b border-rose-100">
                  <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200 self-start">
                    Before: Original Code
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-700">
                    Measured Ratio: 2.34 : 1
                  </span>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl font-mono text-xs sm:text-sm text-slate-200 border border-slate-800 overflow-x-auto leading-relaxed">
                  <div className="text-rose-400 font-semibold mb-2">
                    {"// Non-compliant low-contrast foreground token"}
                  </div>
                  <div className="text-slate-400">
                    &lt;<span className="text-rose-400">p</span> className=&quot;
                    <span className="text-rose-300 font-semibold">checkout-disclaimer text-zinc-400</span>
                    &quot;&gt;
                  </div>
                  <div className="pl-4 text-slate-300 py-1">
                    Please review our automated billing terms carefully before confirming purchase.
                  </div>
                  <div className="text-slate-400">
                    &lt;/<span className="text-rose-400">p</span>&gt;
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="font-semibold text-slate-900">Accessibility Defect:</div>
                  <p className="leading-relaxed">
                    Color token <code className="font-mono text-rose-700 font-semibold bg-rose-50 px-1 py-0.5 rounded border border-rose-200">#a1a1aa</code> on container <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">#f1f5f9</code> provides only 2.34:1 contrast (APCA Lc 46.6), severely failing WCAG 1.4.3 AA (4.50:1 required).
                  </p>
                </div>
              </div>

              {/* AFTER: Remediated Implementation */}
              <div className="bg-white rounded-xl border border-emerald-200 p-5 sm:p-7 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-3 border-b border-emerald-100">
                  <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 self-start">
                    After: Corrected Code
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    Calculated Ratio: 11.20 : 1 (AAA)
                  </span>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl font-mono text-xs sm:text-sm text-slate-200 border border-slate-800 overflow-x-auto leading-relaxed">
                  <div className="text-emerald-400 font-semibold mb-2">
                    {"// High-luminance compliant foreground token"}
                  </div>
                  <div className="text-slate-400">
                    &lt;<span className="text-emerald-400">p</span> className=&quot;
                    <span className="text-emerald-300 font-semibold">checkout-disclaimer text-slate-100 font-medium</span>
                    &quot;&gt;
                  </div>
                  <div className="pl-4 text-slate-100 py-1">
                    Please review our automated billing terms carefully before confirming purchase.
                  </div>
                  <div className="text-slate-400">
                    &lt;/<span className="text-emerald-400">p</span>&gt;
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="font-semibold text-slate-900">Verified Solution:</div>
                  <p className="leading-relaxed">
                    Color token swapped to <code className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">#f1f5f9</code>, delivering 11.20:1 contrast ratio (APCA Lc 94.4+). Exceeds WCAG 2.2 Level AA (4.5:1) and AAA (7.0:1) with zero layout shifts.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculated Result Comparison & Action Prompt */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Remediation Verification Outcome
                </div>
                <div className="text-sm text-slate-800 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span>
                      Contrast increased from <strong>2.34:1</strong> to{" "}
                      <strong className="text-emerald-700 font-bold">11.20:1</strong> (+378% perceptual luminance improvement across the WCAG relative luminance formula; APCA rating improves from Lc 46.6 to Lc 94.4).
                    </span>
                    <p className="text-xs text-slate-500 font-normal mt-1">
                      Compliance scope: Resolving color contrast satisfies WCAG 1.4.3 for this element, but does not establish complete site-wide conformance.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStage}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
              >
                <span>Trigger Verification Scan</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 4: VERIFY                                           */}
        {/* ========================================================= */}
        {currentStage === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
              {/* Verification Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    Playwright Headless Re-Scan & SHA-256 Resolution
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                  Finding Hash Verified Resolved
                </span>
              </div>

              {/* Resolved Finding Card */}
              <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        p.checkout-disclaimer: color-contrast
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                        VERIFIED_FIXED
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Measured contrast in rendered DOM: <strong>11.20:1</strong>.
                      The cryptographic fingerprint{" "}
                      <code className="font-mono text-emerald-800 font-semibold">
                        sha256:d8c9f28a...
                      </code>{" "}
                      has been marked as resolved in the finding registry.
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 font-mono text-xs text-emerald-800 font-semibold bg-white sm:bg-transparent p-2.5 sm:p-0 rounded-lg border sm:border-0 border-emerald-200">
                  <span className="block">Zero Regressions</span>
                  <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
                    Validated via Chromium headless
                  </span>
                </div>
              </div>

              {/* Regression Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Baseline Findings</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">7</span>
                  <span className="text-[11px] text-slate-500">Initial sample scan</span>
                </div>

                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 block">Resolved in Run</span>
                  <span className="text-2xl font-bold text-emerald-800 mt-1 block">-1</span>
                  <span className="text-[11px] text-emerald-700 font-medium">Defect #01 fixed</span>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-center">
                  <span className="text-xs text-amber-800 block">Remaining in Backlog</span>
                  <span className="text-2xl font-bold text-amber-800 mt-1 block">6</span>
                  <span className="text-[11px] text-amber-700 font-medium">Pending remediation</span>
                </div>

                <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 text-center">
                  <span className="text-xs text-indigo-800 block">New Regressions</span>
                  <span className="text-2xl font-bold text-indigo-800 mt-1 block">0</span>
                  <span className="text-[11px] text-indigo-700 font-medium">Clean regression sweep</span>
                </div>
              </div>

              {/* Next Step */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-xs text-slate-600">
                  Fix verified with zero side effects. Inspect sample compliance report?
                </span>
                <button
                  type="button"
                  onClick={handleNextStage}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
                >
                  <span>Proceed to Report</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 5: REPORT                                           */}
        {/* ========================================================= */}
        {currentStage === 5 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" aria-hidden="true" />
                    <h4 className="text-base font-bold text-slate-900">
                      Executive Accessibility Compliance Report
                    </h4>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Sample Scenario
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Demonstration scenario: Checkout Portal • Evaluated under WCAG 2.2 Level AA / Section 508 criteria
                  </p>
                </div>

                <a
                  href="#workbench"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
                >
                  <span>Open Live Workbench</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              {/* Compliance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Automated Rule Pass</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">88%</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">46 / 52 Passing</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 block">Target Defect</span>
                  <span className="text-2xl font-black text-emerald-800 mt-1 block">Fixed</span>
                  <span className="text-[11px] text-emerald-700 font-medium">WCAG 1.4.3 Pass</span>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-center">
                  <span className="text-xs text-indigo-800 block">Rules Evaluated</span>
                  <span className="text-2xl font-black text-indigo-800 mt-1 block">52</span>
                  <span className="text-[11px] text-indigo-700 font-medium">axe-core 4.10.2</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-center">
                  <span className="text-xs text-amber-800 block">Remaining Backlog</span>
                  <span className="text-2xl font-black text-amber-800 mt-1 block">6</span>
                  <span className="text-[11px] text-amber-700 font-semibold">2 Critical, 4 Moderate</span>
                </div>
              </div>

              {/* Available Artifacts Strip */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Generated Compliance Artifacts (Demonstration)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                      <span>Executive Summary (Sample PDF)</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Sample executive briefing outlining defect status and remediation history for stakeholders.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                      <span>Audit Manifest (Sample JSON)</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Structured findings manifest for continuous CI/CD build-gate enforcement.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                      <span>VPAT / ACR Draft (Sample)</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Standardized conformance statement mapped to WCAG 2.2 Level AA and Section 508 criteria.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance & Data Integrity Disclosure Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1">
                <div className="font-semibold text-slate-800">
                  Compliance Scope & Demonstration Disclosure
                </div>
                <p>
                  Data shown in this walkthrough illustrates Inklara&apos;s workflow on a synthetic sample fixture. Automated rule engines evaluate programmatic requirements (~30–40% of WCAG criteria). Complete WCAG 2.2 Level AA and Section 508 conformance requires comprehensive human testing, assistive-technology evaluations, and manual keyboard navigation. A passing contrast ratio on an individual element does not establish site-wide compliance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

