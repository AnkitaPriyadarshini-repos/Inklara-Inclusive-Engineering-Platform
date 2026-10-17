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
} from "lucide-react";

export interface DemoStage {
  id: number;
  label: string;
  name: string;
  tagline: string;
  description: string;
}

const STAGES: DemoStage[] = [
  {
    id: 1,
    label: "01. Discover",
    name: "Automated Sandbox Scan",
    tagline: "Headless axe-core 4.10.2 browser inspection",
    description: "Inklara scans the live application DOM to detect programmatic WCAG barriers in seconds.",
  },
  {
    id: 2,
    label: "02. Inspect",
    name: "Evidence & Accessibility Tree",
    tagline: "Computed contrast mathematics and DOM selectors",
    description: "Every finding includes exact DOM paths, contrast mathematics, and computed accessibility tree nodes.",
  },
  {
    id: 3,
    label: "03. Fix & Patch",
    name: "Actionable Before / After Diffs",
    tagline: "Engineered code patches for WCAG 2.2 Level AA compliance",
    description: "Side-by-side code corrections showing exact CSS and HTML changes with contrast improvements.",
  },
  {
    id: 4,
    label: "04. Verify",
    name: "Deterministic Fix Verification",
    tagline: "Re-scanning DOM and diffing against SHA-256 finding signatures",
    description: "Guarantees fixes persist and identifies regressions before code merges to production.",
  },
  {
    id: 5,
    label: "05. Report",
    name: "Executive & Machine-Readable Reports",
    tagline: "PDF export, JSON audit manifests, and compliance scoring",
    description: "Deliver stakeholder-ready compliance documentation and CI/CD-consumable audit manifests.",
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
            setSrAnnouncement(`Demonstration stage ${next}: ${STAGES[next - 1].name}`);
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
    setSrAnnouncement(`Selected stage ${stageId}: ${STAGES[stageId - 1].name}`);
  };

  const handleNextStage = () => {
    setCurrentStage((prev) => {
      const next = prev >= 5 ? 1 : prev + 1;
      setProgress(0);
      setSrAnnouncement(`Next stage ${next}: ${STAGES[next - 1].name}`);
      return next;
    });
  };

  const handlePrevStage = () => {
    setCurrentStage((prev) => {
      const prevStage = prev <= 1 ? 5 : prev - 1;
      setProgress(0);
      setSrAnnouncement(`Previous stage ${prevStage}: ${STAGES[prevStage - 1].name}`);
      return prevStage;
    });
  };

  const handleRestart = () => {
    setCurrentStage(1);
    setProgress(0);
    setIsPlaying(true);
    setSrAnnouncement("Demonstration restarted at Stage 1: Discover");
  };

  const activeStageInfo = STAGES[currentStage - 1];

  return (
    <div
      aria-label="Interactive Inklara Product Demonstration"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden"
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* Demonstration Header & Accessible Controls Bar */}
      <div className="px-5 sm:px-8 py-4 border-b border-slate-200/90 bg-slate-50/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            Interactive Product Walkthrough
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            demo.inklara.dev
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5" role="toolbar" aria-label="Walkthrough Controls">
          <button
            type="button"
            onClick={handlePrevStage}
            aria-label="Previous Stage"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/70 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <SkipBack className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause Demonstration" : "Play Demonstration"}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
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
            aria-label="Next Stage"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/70 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <SkipForward className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart Demonstration"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/70 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" aria-hidden="true" />

          <button
            type="button"
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : 1)}
            aria-label={`Playback speed: ${playbackSpeed}x. Click to toggle.`}
            className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Stage Tab Navigation */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-8 py-3">
        <nav aria-label="Demonstration Stages" className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STAGES.map((s) => {
            const isActive = currentStage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStageSelect(s.id)}
                aria-current={isActive ? "step" : undefined}
                className={`relative px-3 py-2 rounded-lg text-left transition-all focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                  isActive
                    ? "bg-slate-100 text-slate-900 border border-slate-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-tight uppercase truncate">
                    {s.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                  {s.name}
                </div>

                {isActive && isPlaying && !prefersReducedMotion && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-200 rounded-b-lg overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full bg-indigo-600 transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Stage Description Context */}
      <div className="px-5 sm:px-8 py-3.5 bg-indigo-50/50 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-xs font-bold tracking-tight text-indigo-900 uppercase">
            {activeStageInfo.label} — {activeStageInfo.name}
          </span>
          <p className="text-sm text-slate-700 mt-0.5">
            {activeStageInfo.description}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-indigo-800 font-medium px-2.5 py-1 rounded-md bg-white border border-indigo-200/80 self-start sm:self-auto shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
          <span>{activeStageInfo.tagline}</span>
        </div>
      </div>

      {/* Main Demonstration Workspace Canvas */}
      <div className="p-6 sm:p-8 bg-slate-50/40 min-h-[440px] flex flex-col justify-center">
        {/* STAGE 1: DISCOVER */}
        {currentStage === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="font-bold text-slate-900 text-sm">Enterprise Checkout Portal</span>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    Audit In Progress
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  axe-core 4.10.2 • Playwright Chromium (1280x720)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Defective Element 1: Color Contrast */}
                <div className="p-4 rounded-lg border border-rose-200 bg-rose-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-900">
                      p.checkout-disclaimer
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      WCAG 1.4.3 (Serious)
                    </span>
                  </div>
                  <div className="text-xs text-slate-800 bg-white p-3 rounded border border-rose-200 shadow-2xs">
                    Please review our automated billing terms carefully before confirming purchase.
                  </div>
                  <div className="text-xs text-rose-800 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Contrast ratio 2.3:1 below required 4.5:1 minimum</span>
                  </div>
                </div>

                {/* Defective Element 2: Missing Image Alt */}
                <div className="p-4 rounded-lg border border-rose-200 bg-rose-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-900">
                      img.hero-product
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      WCAG 1.1.1 (Critical)
                    </span>
                  </div>
                  <div className="h-10 bg-white rounded border border-rose-200 flex items-center justify-center text-xs text-slate-700 font-mono shadow-2xs">
                    &lt;img src=&quot;/images/wireless-headphones.webp&quot;&gt;
                  </div>
                  <div className="text-xs text-rose-800 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Missing alternate text (&apos;alt&apos; attribute omitted)</span>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" aria-hidden="true" />
                  <span>Evaluating 84 DOM elements against 52 WCAG 2.2 rules...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    7 Violations Detected
                  </span>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    45 Rules Passed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: INSPECT */}
        {currentStage === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                        Serious Severity
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-700">
                        rule: color-contrast
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      Elements must have sufficient color contrast
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    WCAG 1.4.3 Level AA
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  The computed contrast ratio between the text foreground (<code className="text-indigo-800 bg-slate-100 px-1 py-0.5 rounded font-mono">#a1a1aa</code>) and the background (<code className="text-indigo-800 bg-slate-100 px-1 py-0.5 rounded font-mono">#18181b</code>) is <strong className="text-rose-700">2.3:1</strong>. Standard body text requires a minimum contrast ratio of <strong className="text-emerald-700">4.5:1</strong>.
                </p>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono flex items-center justify-between text-slate-800">
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
                    className="text-xs font-sans font-semibold text-indigo-600 hover:text-indigo-800 shrink-0"
                  >
                    {isCopied ? "Copied" : "Copy Selector"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-rose-700 block">Current Ratio</span>
                    <span className="text-2xl font-extrabold text-rose-800 mt-0.5 block">2.3 : 1</span>
                    <span className="text-xs text-rose-700 font-semibold">Fails Level AA</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-emerald-700 block">Required Ratio</span>
                    <span className="text-2xl font-extrabold text-emerald-800 mt-0.5 block">4.5 : 1</span>
                    <span className="text-xs text-emerald-700 font-semibold">Minimum Threshold</span>
                  </div>
                </div>
              </div>

              {/* Accessibility Tree Card */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Computed Accessibility Tree
                    </span>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-900 font-mono text-xs text-slate-200 space-y-2 border border-slate-800">
                    <div className="text-slate-400">{"// Chromium A11y Tree Snapshot"}</div>
                    <div>
                      <span className="text-indigo-300">role:</span> &quot;paragraph&quot;
                    </div>
                    <div>
                      <span className="text-indigo-300">name:</span> &quot;Please review billing terms...&quot;
                    </div>
                    <div>
                      <span className="text-indigo-300">contrastRatio:</span> <span className="text-rose-400 font-bold">2.34</span>
                    </div>
                    <div>
                      <span className="text-indigo-300">focusable:</span> false
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    Deterministic fingerprint computed: <code className="text-indigo-700 font-mono font-bold">sha256:d8c9f2...</code>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: REMEDIATE */}
        {currentStage === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-rose-300 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    BEFORE (NON-COMPLIANT)
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-700">Ratio: 2.3:1</span>
                </div>

                <div className="p-4 bg-slate-900 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto">
                  <div className="text-rose-400 font-semibold mb-1">{"// Low contrast text token"}</div>
                  <div className="text-slate-400">
                    &lt;<span className="text-rose-400">p</span> className=&quot;<span className="text-rose-300">text-zinc-400</span>&quot;&gt;
                  </div>
                  <div className="pl-4 text-slate-300">
                    Please review billing terms...
                  </div>
                  <div className="text-slate-400">&lt;/<span className="text-rose-400">p</span>&gt;</div>
                </div>

                <p className="text-xs text-slate-600">
                  Defect: <code className="font-mono text-rose-700">#a1a1aa</code> on dark backgrounds lacks perceptual luminosity, impeding readers with low vision.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-emerald-300 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    AFTER (VERIFIED REMEDIATION)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">Ratio: 11.2:1 (AAA)</span>
                </div>

                <div className="p-4 bg-slate-900 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto">
                  <div className="text-emerald-400 font-semibold mb-1">{"// High contrast readable token"}</div>
                  <div className="text-slate-400">
                    &lt;<span className="text-emerald-400">p</span> className=&quot;<span className="text-emerald-300">text-slate-100 font-medium</span>&quot;&gt;
                  </div>
                  <div className="pl-4 text-slate-300">
                    Please review billing terms...
                  </div>
                  <div className="text-slate-400">&lt;/<span className="text-emerald-400">p</span>&gt;</div>
                </div>

                <p className="text-xs text-slate-600">
                  Resolution: Swapped to <code className="font-mono text-emerald-700 font-bold">#f1f5f9</code> providing 11.2:1 ratio, exceeding WCAG 2.2 Level AAA requirements.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-2 font-medium">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Ready to verify fix against the live target application?</span>
              </span>
              <button
                type="button"
                onClick={handleNextStage}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Trigger Verification Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: VERIFY */}
        {currentStage === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-slate-900">
                    Playwright Re-Scan: Verification Engine
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  SHA-256 Hash Resolved
                </span>
              </div>

              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        p.checkout-disclaimer: color-contrast
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                        VERIFIED_FIXED
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      New measured contrast: 11.2:1. The violation fingerprint has been cleared from the defect registry.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-emerald-800 font-bold block">
                    Zero Regressions
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Validated via Headless Engine
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block">Baseline Violations</span>
                  <span className="text-xl font-bold text-slate-900 mt-0.5 block">7</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-[11px] font-bold uppercase text-emerald-700 block">Fixed in This Rescan</span>
                  <span className="text-xl font-bold text-emerald-700 mt-0.5 block">-1 (Resolved)</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <span className="text-[11px] font-bold uppercase text-indigo-700 block">New Regressions</span>
                  <span className="text-xl font-bold text-indigo-700 mt-0.5 block">0 (+)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 5: REPORT */}
        {currentStage === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Executive Accessibility Compliance Report
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated under WCAG 2.2 Level AA Standard • Inklara Verification Engine
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="#workbench"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                  >
                    <span>Open Live Workbench</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Compliance Score</span>
                  <span className="text-2xl font-black text-slate-900 block mt-1">94%</span>
                  <span className="text-[11px] text-emerald-700 font-bold">Grade A</span>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 block">Verified Fixed</span>
                  <span className="text-2xl font-black text-emerald-700 block mt-1">100%</span>
                  <span className="text-[11px] text-emerald-800 font-medium">Target Met</span>
                </div>
                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-center">
                  <span className="text-xs text-indigo-800 block">Rules Evaluated</span>
                  <span className="text-2xl font-black text-indigo-700 block mt-1">52</span>
                  <span className="text-[11px] text-indigo-800 font-medium">WCAG 2.2</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Remaining Critical</span>
                  <span className="text-2xl font-black text-slate-900 block mt-1">0</span>
                  <span className="text-[11px] text-emerald-700 font-bold">Zero Blockers</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
