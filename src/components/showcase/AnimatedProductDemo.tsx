"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Search,
  Sliders,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
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
    tagline: "Injecting axe-core 4.10.2 via Playwright Headless Sandbox",
    description: "Inklara sweeps the live DOM to detect programmatic WCAG barriers in under 1.8 seconds.",
  },
  {
    id: 2,
    label: "02. Understand",
    name: "Evidence & Accessibility Tree",
    tagline: "Computed contrast ratios, selectors, and accessible name failures",
    description: "Every finding includes exact DOM paths, contrast mathematics, and computed accessibility tree nodes.",
  },
  {
    id: 3,
    label: "03. Code Patch",
    name: "Actionable Before / After Diffs",
    tagline: "Engineered code patches with WCAG 2.2 Level AA compliance",
    description: "Side-by-side code corrections showing exact CSS and HTML changes with contrast ratio improvements.",
  },
  {
    id: 4,
    label: "04. Verify",
    name: "Deterministic Fix Verification",
    tagline: "Re-scanning DOM and diffing against SHA-256 finding signatures",
    description: "Guarantees fixes persist and identifies regressions before pull requests merge to production.",
  },
  {
    id: 5,
    label: "05. Report",
    name: "Executive & Machine-Readable Reports",
    tagline: "PDF export, JSON audit manifests, and compliance scoring",
    description: "Deliver stakeholder-ready compliance documentation and CI/CD-consumable audit manifests.",
  },
];

const STAGE_DURATION_MS = 5200; // 5.2s per stage = ~26s full loop

export function AnimatedProductDemo() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x or 1.5x
  const [progress, setProgress] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Announce for screen readers
  const [srAnnouncement, setSrAnnouncement] = useState<string>("");

  // Check system prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
      const listener = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) setIsPlaying(false);
      };
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Timer loop for playback
  useEffect(() => {
    if (!isPlaying) return;

    const intervalStep = 50;
    const duration = STAGE_DURATION_MS / playbackSpeed;
    const stepIncrement = (intervalStep / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Transition to next stage
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
    <section
      aria-label="Animated Inklara Product Demonstration"
      className="relative rounded-2xl border border-apple-border/80 bg-apple-surface/90 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* Top Demo Bar / Window Controls */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-apple-border bg-apple-canvas/90 gap-3">
        {/* Mock Window Controls & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-apple-border">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              Inklara Interactive Walkthrough
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-apple-muted px-2 py-0.5 rounded bg-apple-elevated/80 border border-apple-border">
              demo.inklara.dev
            </span>
          </div>
        </div>

        {/* Playback Controls Toolbar */}
        <div className="flex items-center gap-2" role="toolbar" aria-label="Walkthrough Playback Controls">
          <button
            type="button"
            onClick={handlePrevStage}
            aria-label="Previous Stage"
            className="p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-apple-elevated transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <SkipBack className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause Demonstration" : "Play Demonstration"}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
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
            className="p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-apple-elevated transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <SkipForward className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart Demonstration"
            className="p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-apple-elevated transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <div className="h-4 w-px bg-apple-border mx-1" aria-hidden="true" />

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : 1)}
            aria-label={`Playback speed: ${playbackSpeed}x. Click to change.`}
            className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-apple-elevated text-indigo-300 border border-indigo-700/50 hover:bg-indigo-950/80 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Stage Tabs Navigation */}
      <div className="border-b border-apple-border/70 bg-apple-surface/60 px-4 sm:px-6 py-2.5">
        <nav aria-label="Demonstration Stages" className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STAGES.map((s) => {
            const isActive = currentStage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStageSelect(s.id)}
                aria-current={isActive ? "step" : undefined}
                className={`relative px-3 py-2 rounded-lg text-left transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? "bg-apple-elevated text-white border border-indigo-500/60 shadow-md shadow-indigo-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-apple-elevated/40 border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-tight uppercase truncate">
                    {s.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" aria-hidden="true" />
                  )}
                </div>
                <div className="text-xs font-medium text-slate-300 truncate mt-0.5">
                  {s.name}
                </div>

                {/* Micro progress line for active stage */}
                {isActive && isPlaying && !prefersReducedMotion && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500/40 rounded-b-lg overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Stage Description Subheader */}
      <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-950/40 via-apple-elevated/30 to-apple-surface/40 border-b border-apple-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-400">
            {activeStageInfo.label} — {activeStageInfo.name}
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            {activeStageInfo.description}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 px-2.5 py-1 rounded bg-apple-elevated/70 border border-apple-border self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
          <span>{activeStageInfo.tagline}</span>
        </div>
      </div>

      {/* Main Animated Canvas (Changes according to Stage) */}
      <div className="p-4 sm:p-6 lg:p-8 min-h-[440px] flex flex-col justify-center bg-gradient-to-b from-apple-canvas/40 to-apple-canvas/90">
        {/* ========================================================= */}
        {/* STAGE 1: DISCOVER — Automated Scanning & Rule Execution */}
        {/* ========================================================= */}
        {currentStage === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Target Interface Mockup */}
            <div className="relative rounded-xl border border-apple-border bg-apple-surface p-4 sm:p-5 overflow-hidden">
              {/* Scanning Laser Beam */}
              {!prefersReducedMotion && (
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-teal-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-20 pointer-events-none"
                  style={{
                    top: `${Math.min(95, Math.max(5, progress))}%`,
                    transition: "top 0.1s linear",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Mock Header of Audited Website */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-apple-border/70 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span className="font-semibold text-slate-200">Apex Storefront Checkout</span>
                  <span className="text-[10px] text-rose-400 bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                    Audit In Progress
                  </span>
                </div>
                <div className="text-[11px] font-mono text-apple-muted">
                  axe-core 4.10.2 • Playwright Chromium (1280x720)
                </div>
              </div>

              {/* Simulated Audited DOM Elements with Active Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Defective Element 1: Color Contrast */}
                <div className="p-3.5 rounded-lg border border-rose-500/40 bg-rose-950/20 relative space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-rose-300 font-semibold">
                      p.checkout-disclaimer
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-900/80 text-rose-200 border border-rose-700">
                      WCAG 1.4.3 (Serious)
                    </span>
                  </div>
                  <p className="text-xs text-slate-100 bg-zinc-950 p-2 rounded border border-zinc-800">
                    Please review our automated billing terms carefully before confirming purchase.
                  </p>
                  <div className="text-[10px] text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Contrast ratio 2.3:1 below required 4.5:1 minimum</span>
                  </div>
                </div>

                {/* Defective Element 2: Missing Image Alt */}
                <div className="p-3.5 rounded-lg border border-rose-500/40 bg-rose-950/20 relative space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-rose-300 font-semibold">
                      img.hero-product
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-900/80 text-rose-200 border border-rose-700">
                      WCAG 1.1.1 (Critical)
                    </span>
                  </div>
                  <div className="h-10 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-center text-xs text-slate-300 font-mono">
                    &lt;img src=&quot;/images/wireless-headphones.webp&quot;&gt;
                  </div>
                  <div className="text-[10px] text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Missing alternate text (&apos;alt&apos; attribute empty)</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Scan Status Footer */}
              <div className="mt-4 pt-3 border-t border-apple-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" aria-hidden="true" />
                  <span className="font-mono text-[11px]">
                    Evaluating 84 DOM nodes across 52 WCAG rules...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    7 Violations Found
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    45 Rules Passed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 2: UNDERSTAND — Deep Inspection & Accessibility Tree */}
        {/* ========================================================= */}
        {currentStage === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Finding Summary Panel */}
              <div className="lg:col-span-7 rounded-xl border border-apple-border bg-apple-surface p-4 sm:p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
                        Serious Severity
                      </span>
                      <span className="text-xs font-mono text-indigo-300 font-bold">
                        rule: color-contrast
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      Elements must have sufficient color contrast
                    </h3>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-apple-elevated text-slate-200 border border-apple-border">
                    WCAG 1.4.3 Level AA
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  The computed contrast ratio between the text foreground (<code className="text-indigo-300 font-mono">#a1a1aa</code>) and the background (<code className="text-indigo-300 font-mono">#18181b</code>) is <strong className="text-rose-400">2.3:1</strong>. Standard body text requires a minimum contrast ratio of <strong className="text-emerald-400">4.5:1</strong> to ensure legibility for users with moderate low vision.
                </p>

                {/* Target Element Selector with Copy */}
                <div className="p-2.5 rounded-lg bg-apple-elevated/70 border border-apple-border text-xs font-mono flex items-center justify-between text-slate-300">
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
                    className="text-[11px] font-sans font-semibold text-indigo-400 hover:text-indigo-300 shrink-0"
                  >
                    {isCopied ? "Copied" : "Copy Selector"}
                  </button>
                </div>

                {/* Mathematical Contrast Ratio Visualizer */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-center">
                    <span className="text-[10px] uppercase font-bold text-rose-300 block">Current Ratio</span>
                    <span className="text-xl font-extrabold text-rose-400 mt-0.5 block">2.3 : 1</span>
                    <span className="text-[10px] text-rose-400 font-medium">Fails Level AA</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">Required Ratio</span>
                    <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">4.5 : 1</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Minimum Threshold</span>
                  </div>
                </div>
              </div>

              {/* Accessibility Tree Inspection Card */}
              <div className="lg:col-span-5 rounded-xl border border-apple-border bg-apple-surface p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Computed Accessibility Tree
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 font-mono text-[11px] text-slate-300 space-y-2 border border-zinc-800">
                    <div className="text-slate-500">{"// Chromium A11y Snapshot Node"}</div>
                    <div>
                      <span className="text-indigo-400">role:</span> &quot;paragraph&quot;
                    </div>
                    <div>
                      <span className="text-indigo-400">name:</span> &quot;Please review billing terms...&quot;
                    </div>
                    <div>
                      <span className="text-indigo-400">contrastRatio:</span> <span className="text-rose-400">2.34</span>
                    </div>
                    <div>
                      <span className="text-indigo-400">focusable:</span> false
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-apple-elevated border border-apple-border text-[11px] text-slate-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    Deterministic fingerprint computed: <code className="text-indigo-300 font-mono">sha256:d8c9f2...</code>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 3: REMEDIATE — Before & After Code Patches */}
        {/* ========================================================= */}
        {currentStage === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before: Inaccessible Implementation */}
              <div className="rounded-xl border border-rose-500/50 bg-rose-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-900/80 text-rose-200 border border-rose-700">
                    BEFORE (NON-COMPLIANT)
                  </span>
                  <span className="text-xs font-mono text-rose-400 font-semibold">Ratio: 2.3:1</span>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg font-mono text-xs text-slate-300 border border-zinc-800 overflow-x-auto">
                  <div className="text-rose-400 font-semibold mb-1">{"// Inaccessible: low contrast muted text"}</div>
                  <div className="text-slate-400">
                    &lt;<span className="text-rose-400">p</span> className=&quot;<span className="text-rose-300">text-zinc-400</span>&quot;&gt;
                  </div>
                  <div className="pl-4 text-slate-300">
                    Please review billing terms...
                  </div>
                  <div className="text-slate-400">&lt;/<span className="text-rose-400">p</span>&gt;</div>
                </div>

                <p className="text-[11px] text-rose-300">
                  Defect: <code className="font-mono text-rose-200">#a1a1aa</code> on dark backgrounds lacks perceptual luminosity, impeding readers with low vision or glare.
                </p>
              </div>

              {/* After: Remediated Compliant Implementation */}
              <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                    AFTER (VERIFIED REMEDIATION)
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Ratio: 11.2:1 (AAA)</span>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg font-mono text-xs text-slate-300 border border-zinc-800 overflow-x-auto">
                  <div className="text-emerald-400 font-semibold mb-1">{"// Compliant: high contrast readable token"}</div>
                  <div className="text-slate-400">
                    &lt;<span className="text-emerald-400">p</span> className=&quot;<span className="text-emerald-300">text-slate-100 font-medium</span>&quot;&gt;
                  </div>
                  <div className="pl-4 text-slate-300">
                    Please review billing terms...
                  </div>
                  <div className="text-slate-400">&lt;/<span className="text-emerald-400">p</span>&gt;</div>
                </div>

                <p className="text-[11px] text-emerald-300">
                  Resolution: Swapped to <code className="font-mono text-emerald-200">#f1f5f9</code> providing 11.2:1 ratio, exceeding WCAG 2.2 Level AAA requirements.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-apple-surface border border-apple-border text-xs text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Ready to verify fix against the running application target?</span>
              </span>
              <button
                type="button"
                onClick={handleNextStage}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors"
              >
                <span>Trigger Verification Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 4: VERIFY — Automated Rescan & Regression Diffing */}
        {/* ========================================================= */}
        {currentStage === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="rounded-xl border border-apple-border bg-apple-surface p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-apple-border/70">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-white">
                    Playwright Re-Scan: Verification Engine
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  SHA-256 Hash Resolved
                </span>
              </div>

              {/* Status Transition Item */}
              <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        p.checkout-disclaimer: color-contrast
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700">
                        VERIFIED_FIXED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      New measured contrast: 11.2:1. The violation fingerprint has been cleared from the defect registry.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    Zero Regressions
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Re-tested at {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Regression Comparator Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-apple-elevated/70 border border-apple-border rounded-lg">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Baseline Violations</span>
                  <span className="text-lg font-bold text-slate-200 mt-0.5 block">7</span>
                </div>
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg">
                  <span className="text-[10px] font-bold uppercase text-emerald-300 block">Fixed in This Rescan</span>
                  <span className="text-lg font-bold text-emerald-400 mt-0.5 block">-1 (Resolved)</span>
                </div>
                <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-lg">
                  <span className="text-[10px] font-bold uppercase text-indigo-300 block">New Regressions</span>
                  <span className="text-lg font-bold text-indigo-400 mt-0.5 block">0 (+)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 5: REPORT — Executive Summary & Artifact Export */}
        {/* ========================================================= */}
        {currentStage === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="rounded-xl border border-apple-border bg-apple-surface p-4 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-apple-border/70">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">
                      Executive Accessibility Compliance Report
                    </h3>
                  </div>
                  <p className="text-xs text-apple-muted mt-0.5">
                    Evaluated under WCAG 2.2 Level AA Standard • Inklara Verification Engine
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="#interactive-demo"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Open Live Workbench</span>
                  </a>
                </div>
              </div>

              {/* Compliance Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="text-apple-muted block text-[10px]">Compliance Index</span>
                  <span className="text-xl font-bold text-emerald-400 mt-0.5 block">92%</span>
                  <span className="text-[10px] text-slate-400">+64% Post Remediation</span>
                </div>

                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="text-apple-muted block text-[10px]">Verified Fixes</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">1 / 7</span>
                  <span className="text-[10px] text-emerald-400">Zero Regressions</span>
                </div>

                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="text-apple-muted block text-[10px]">Human Protocols</span>
                  <span className="text-xl font-bold text-indigo-300 mt-0.5 block">13 Checked</span>
                  <span className="text-[10px] text-slate-400">WCAG-EM Standard</span>
                </div>

                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="text-apple-muted block text-[10px]">Audit Fingerprint</span>
                  <span className="text-xs font-mono text-slate-300 mt-1 block truncate">
                    sha256:7f4a9...
                  </span>
                  <span className="text-[10px] text-slate-400">Tamper-Proof JSON</span>
                </div>
              </div>

              {/* Cryptographic Manifest Badge */}
              <div className="p-3 rounded-lg bg-apple-canvas border border-apple-border/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px]">
                    Export Formats: JSON Manifest (CI/CD) &amp; Print-Ready PDF (WCAG-EM)
                  </span>
                </div>
                <span className="text-[11px] text-indigo-400 font-medium">
                  Verified Engine: axe-core 4.10.2 + Playwright
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Footer with Cycle Ticker */}
      <div className="px-4 sm:px-6 py-2.5 bg-apple-canvas/90 border-t border-apple-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-apple-muted">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" aria-hidden="true" />
          <span>Stage {currentStage} of 5</span>
          <span>•</span>
          <span className="text-slate-300">{activeStageInfo.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Use Prev/Next or click any stage to navigate</span>
          <button
            type="button"
            onClick={handleRestart}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Replay Full Sequence
          </button>
        </div>
      </div>
    </section>
  );
}
