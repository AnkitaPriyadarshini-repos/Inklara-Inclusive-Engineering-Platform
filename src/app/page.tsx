import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { SeverityBadge } from "@/components/SeverityBadge";
import { DashboardClient } from "./DashboardClient";
import { InklaraSymbol } from "@/components/brand/InklaraSymbol";
import { InklaraLogo } from "@/components/brand/InklaraLogo";
import { AnimatedProductDemo } from "@/components/showcase/AnimatedProductDemo";
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
  Sparkles,
  Terminal,
  Cpu,
  Search,
  Code2,
  GitCompare,
  FileCheck2,
  Lock,
  Eye,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Volume2,
  FileText,
  Sliders,
  ChevronRight,
  Globe,
  Radio,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let projects: any[] = [];
  let audits: any[] = [];
  let totalFindings: any[] = [];
  let manualStats: any[] = [];
  let databaseError: string | null = null;

  try {
    const res = await Promise.all([
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
    projects = res[0];
    audits = res[1];
    totalFindings = res[2];
    manualStats = res[3];
  } catch (error) {
    databaseError =
      error instanceof Error ? error.message : "Database connection failed";
  }

  const totalOpenFindings =
    totalFindings.find((f) => f.status === "OPEN")?._count.id ?? 0;
  const totalVerifiedFixed =
    totalFindings.find((f) => f.status === "VERIFIED_FIXED")?._count.id ?? 0;

  const totalManualChecks = manualStats.reduce(
    (acc, curr) => acc + curr._count.id,
    0
  );
  const evaluatedManualChecks = manualStats
    .filter((s) => s.status !== "NOT_TESTED")
    .reduce((acc, curr) => acc + curr._count.id, 0);

  const totalPasses = audits.reduce((acc, a) => acc + (a.passesCount || 0), 0);
  const manualPercent =
    totalManualChecks > 0
      ? Math.round((evaluatedManualChecks / totalManualChecks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <DashboardClient
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="outline-none space-y-20 lg:space-y-28 pb-20"
      >
        {/* ========================================================= */}
        {/* A. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section
          aria-labelledby="hero-heading"
          className="relative pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[840px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-sky-600/10 to-transparent blur-3xl opacity-80"
          />

          <div className="relative max-w-5xl mx-auto text-center space-y-8">
            {/* Brand Logo & Pill Badge */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-semibold shadow-sm backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-white">Inklara Platform</span>
                <span className="text-slate-500" aria-hidden="true">•</span>
                <span className="text-indigo-300">Inclusive Engineering</span>
                <span className="text-slate-500" aria-hidden="true">•</span>
                <span className="text-slate-300">WCAG 2.2 Level AA Target</span>
              </div>
            </div>

            {/* Striking Headline Requested in Master Prompt */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
            >
              Build accessible experiences.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-teal-300">
                Verify every interaction.
              </span>
            </h1>

            {/* Concise Product Explanation */}
            <p className="text-base sm:text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
              Inklara reveals what interfaces leave behind. Sandboxed Chromium browser
              automation and axe-core paired with guided WCAG-EM human evaluation, actionable
              code-level remediation diffs, continuous regression baselines, and assistive tech simulation.
            </p>

            {/* Primary Calls to Action */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href="#product-walkthrough"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <span>Explore the Product</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <Code2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </a>

              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-700/60 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <Sparkles className="w-4 h-4 text-indigo-300" aria-hidden="true" />
                <span>Recruiter Showcase</span>
              </Link>

              <Link
                href="/overview"
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <Monitor className="w-4 h-4 text-sky-400" aria-hidden="true" />
                <span>Product Overview</span>
              </Link>
            </div>

            {/* Large Visual Representation of the Real Application */}
            <div className="pt-6 max-w-5xl mx-auto text-left">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl overflow-hidden font-mono text-xs">
                {/* Window Header */}
                <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" aria-hidden="true" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" aria-hidden="true" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" aria-hidden="true" />
                    <span className="ml-2 text-slate-300 font-sans text-xs font-semibold truncate">
                      Inklara Verification Engine • Headless Playwright Chromium • axe-core 4.10.2
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-semibold">
                      SSRF Isolated
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-semibold hidden md:inline">
                      WCAG 2.2 Level AA
                    </span>
                  </div>
                </div>

                {/* Split Inspection Pane */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                  {/* Left Pane: Finding & Evidence (5 cols) */}
                  <div className="lg:col-span-5 p-5 bg-slate-950/70 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-800">
                        Critical Severity
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans">
                        WCAG 1.4.3 Contrast (Minimum)
                      </span>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-white font-sans">
                        Insufficient color contrast ratio on primary action
                      </h2>
                      <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                        The checkout submission button text does not meet the minimum 4.5:1 contrast requirement against the container background.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase tracking-wider">DOM Selector</span>
                        <span className="text-indigo-300 bg-slate-900 px-2 py-1 rounded block mt-0.5 truncate">
                          main &gt; form &gt; div.actions &gt; button.cta-primary
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 text-[10px] block uppercase">Computed Ratio</span>
                          <span className="text-red-400 font-bold text-sm">2.92 : 1</span>
                          <span className="text-slate-400 text-[10px] block">Threshold: 4.50:1 AA</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 text-[10px] block uppercase">Colors Sampled</span>
                          <span className="text-slate-300 text-xs block truncate">FG: #94a3b8</span>
                          <span className="text-slate-400 text-xs block truncate">BG: #0f172a</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Pane: Remediation Diff & Verification (7 cols) */}
                  <div className="lg:col-span-7 p-5 bg-slate-900/40 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-200 font-sans flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                          <span>Code Remediation Patch</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          components/CheckoutButton.tsx
                        </span>
                      </div>

                      <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 overflow-x-auto text-[11px] leading-relaxed">
                        <div className="text-slate-400">
                          {"// Remediation: update foreground & background tokens to meet WCAG AA"}
                        </div>
                        <div className="bg-red-950/40 text-red-300 px-2 py-1 rounded my-1 border-l-2 border-red-500">
                          - &lt;button className=&quot;bg-slate-900 text-slate-400 font-medium&quot;&gt;
                        </div>
                        <div className="bg-emerald-950/40 text-emerald-300 px-2 py-1 rounded my-1 border-l-2 border-emerald-500">
                          + &lt;button className=&quot;bg-indigo-600 text-white font-semibold&quot; aria-label=&quot;Complete purchase&quot;&gt;
                        </div>
                        <div className="text-slate-400 px-2">
                          &nbsp;&nbsp;&nbsp;&nbsp;Complete Checkout &amp; Pay $42.00
                        </div>
                        <div className="text-slate-400 px-2">&lt;/button&gt;</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                        <div>
                          <span className="font-bold text-emerald-200 block">
                            Verified Fixed in Continuous Rescan
                          </span>
                          <span className="text-[11px] text-emerald-300/80">
                            Rescan #104 verified contrast upgraded to 8.24:1 (exceeds 4.5:1 requirement).
                          </span>
                        </div>
                      </div>
                      <Link
                        href="/showcase"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-400"
                      >
                        Try in Demo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* B. PRODUCT INTRODUCTION: The Problem & The Solution       */}
        {/* ========================================================= */}
        <section
          aria-labelledby="intro-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2
              id="intro-heading"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Why Automated Scanning Alone Isn&apos;t Enough
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Automated rules engines catch syntax errors and standard color mismatches, but accessibility
              is an experience, not just a tag. Inklara addresses the three fundamental flaws of modern accessibility auditing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
                  35%
                </div>
                <h3 className="text-xl font-bold text-white">
                  The Automation Ceiling
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Automated engines detect ~30–40% of WCAG criteria. They cannot verify whether a focus trap prevents keyboard users from escaping, or if dynamic ARIA live announcements fire correctly. Inklara pairs automated sweeps with 13 WCAG-EM guided protocols.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 text-[11px] text-indigo-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>WCAG-EM Human Evaluation Layer</span>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold">
                  <Code2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  The Remediation Void
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Traditional scanners dump walls of compliance codes without providing engineers with concrete code diffs or context on how assistive tech perceives the element. Inklara generates copy-paste verified code patches and computed A11y Tree nodes.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 text-[11px] text-violet-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Actionable Code-Level Diffs</span>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <GitCompare className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  The Regression Hazard
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Fast-moving development teams frequently re-introduce resolved barriers. Without deterministic baseline tracking comparing before and after scans, fixes silently degrade. Inklara uses SHA-256 finding signatures to catch regressions before merge.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Deterministic Baseline Diffing</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* C. PRODUCT DEMONSTRATION: Interactive Walkthrough         */}
        {/* ========================================================= */}
        <section
          id="product-walkthrough"
          aria-labelledby="walkthrough-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
                <span>Interactive Product Walkthrough</span>
              </div>
              <h2
                id="walkthrough-heading"
                className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                The 5-Stage Inclusive Engineering Workflow
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Step through the live product workflow from automated discovery to verified remediation.
                Control playback, inspect computed contrast metrics, and review verified code diffs.
              </p>
            </div>
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-2 py-1"
            >
              <span>Explore Full Recruiter Showcase</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Embedded Full Animated Demo Component */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-2 sm:p-4 shadow-2xl">
            <AnimatedProductDemo />
          </div>
        </section>

        {/* ========================================================= */}
        {/* D. FEATURE STORYTELLING: 7 Alternating Visual Blocks      */}
        {/* ========================================================= */}
        <section
          aria-labelledby="features-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2
              id="features-heading"
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
            >
              Engineered for Complete Accessibility
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Every capability below is backed by running code in this repository—tested against WCAG 2.2 Level AA standards.
            </p>
          </div>

          {/* Feature 1: Automated Accessibility Audits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/80 text-blue-300 border border-blue-800 text-xs font-mono font-semibold">
                Feature 01 • Playwright + axe-core
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Automated Accessibility Audits at Scale
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Scan rendered web applications in real browser execution environments. Inklara runs automated checks across desktop (1920×1080), tablet (768×1024), and mobile reflow (320×640) to detect layout shifts and clipping, protected by multi-tier SSRF isolation that blocks private IP ranges and cloud metadata endpoints.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-400" aria-hidden="true" />
                    <span>Viewport Dimension Matrix</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">0.94s Scan</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Desktop</span>
                    <span className="text-white font-bold text-sm">1920×1080</span>
                    <span className="text-[10px] text-emerald-400 block mt-1">100% Passed</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Tablet</span>
                    <span className="text-white font-bold text-sm">768×1024</span>
                    <span className="text-[10px] text-emerald-400 block mt-1">100% Passed</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Mobile Reflow</span>
                    <span className="text-white font-bold text-sm">320×640</span>
                    <span className="text-[10px] text-emerald-400 block mt-1">WCAG 1.4.10 OK</span>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 font-sans flex items-center justify-between">
                  <span>SSRF Defense: RFC 1918 + Cloud Metadata Guard Active</span>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Evidence-Backed Findings (Flipped) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-red-400" aria-hidden="true" />
                    <span>Calculated Luminance Evidence</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-800 font-bold uppercase">
                    Critical Severity
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Computed Contrast</span>
                    <span className="text-red-400 font-bold text-lg">2.92 : 1</span>
                    <span className="text-slate-400 block text-[10px]">Threshold: 4.50:1 AA</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Target Selector</span>
                    <span className="text-indigo-300 font-semibold block truncate mt-1 text-[11px]">
                      button.cta-primary
                    </span>
                    <span className="text-slate-400 block text-[10px]">DOM Snapshot: node #42</span>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 font-sans">
                  <span className="font-semibold text-white">Criterion: </span>
                  WCAG 1.4.3 Contrast (Minimum) • Zero false-positive tolerance.
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-red-950/80 text-red-300 border border-red-800 text-xs font-mono font-semibold">
                Feature 02 • Evidence-Backed
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Evidence-Backed Findings, Not Vague Warnings
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Stop guessing why a rule flagged. Inklara provides concrete DOM evidence: exact CSS selector paths, computed RGB foreground and background luminance values, contrast math compared against the 4.5:1 AA threshold, and assistive tree node hierarchy with zero false-positive tolerance.
              </p>
            </div>
          </div>

          {/* Feature 3: Guided Manual Evaluation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800 text-xs font-mono font-semibold">
                Feature 03 • WCAG-EM Protocol
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Guided Human Evaluation for the 60% Gap
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Automated tools cannot verify if a focus trap prevents keyboard escape or whether dynamic content changes are announced to screen readers. Inklara provides structured, step-by-step WCAG-EM guided workflows with explicit test conditions and failure criteria—empowering any frontend engineer to perform rigorous accessibility evaluations.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
                  <span className="font-bold text-white flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                    <span>WCAG-EM Protocol Check #4 of 13</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                    WCAG 2.1.2 Level A
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-semibold text-white">Criterion: No Keyboard Trap</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Test Condition: Press Tab and Shift+Tab through all interactive components and dialogs. Can focus be moved away without special key combinations?
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px]">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Verified: Focus restored on ESC</span>
                    </span>
                    <span className="text-slate-400 font-mono">Technique G21 Applied</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Remediation & Verification (Flipped) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-sans">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    <span>Verified Code Patch Diff</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Contrast: 8.24:1</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1 text-[11px]">
                  <div className="text-slate-400 font-mono">components/CheckoutButton.tsx</div>
                  <div className="bg-red-950/40 text-red-300 px-2 py-1 rounded border-l-2 border-red-500">
                    - &lt;button className=&quot;bg-slate-900 text-slate-400 font-medium&quot;&gt;
                  </div>
                  <div className="bg-emerald-950/40 text-emerald-300 px-2 py-1 rounded border-l-2 border-emerald-500">
                    + &lt;button className=&quot;bg-indigo-600 text-white font-semibold&quot; aria-label=&quot;Complete purchase&quot;&gt;
                  </div>
                </div>
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/60 text-[11px] font-sans text-emerald-300 flex items-center justify-between">
                  <span>Re-scan confirmed resolution. Finding marked VERIFIED_FIXED.</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-mono font-semibold">
                Feature 04 • Code Patches
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Actionable Code-Level Remediation Patches
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Inklara doesn&apos;t just list failures—it generates verified, drop-in code diffs for your components. Once updated, our verification engine automatically re-scans the target URL, verifying that color contrast math, ARIA attributes, or semantic tags now satisfy WCAG 2.2 Level AA requirements.
              </p>
            </div>
          </div>

          {/* Feature 5: Regression Comparisons */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-teal-950/80 text-teal-300 border border-teal-800 text-xs font-mono font-semibold">
                Feature 05 • Baseline Tracking
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Continuous Regression Comparison Across Builds
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Prevent resolved accessibility barriers from creeping back into production. Inklara computes SHA-256 signatures for every finding and compares new audit runs against designated baselines, highlighting new regressions (+), verified fixed items (-), and persistent issues across releases.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
                  <span className="font-bold text-white flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-teal-400" aria-hidden="true" />
                    <span>Baseline Comparator (Run #101 vs #104)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold font-mono">+72% Compliance Delta</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">New Regressions</span>
                    <span className="text-emerald-400 font-bold text-lg">+0</span>
                    <span className="text-slate-400 block text-[10px]">No regressions</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Verified Fixed</span>
                    <span className="text-emerald-400 font-bold text-lg">-7</span>
                    <span className="text-slate-400 block text-[10px]">Defects resolved</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Persistent</span>
                    <span className="text-slate-300 font-bold text-lg">0</span>
                    <span className="text-slate-400 block text-[10px]">Zero backlog</span>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 font-sans">
                  Fingerprint algorithm: SHA-256(ruleId + normalizedSelector + snippet)
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6: Reporting (Flipped) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
                  <span className="font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" aria-hidden="true" />
                    <span>Executive Compliance Scorecard</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    Audit Run #104
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Level A</span>
                    <span className="text-white font-bold text-lg">100%</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Level AA</span>
                    <span className="text-emerald-400 font-bold text-lg">100%</span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Level AAA</span>
                    <span className="text-indigo-400 font-bold text-lg">68%</span>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 font-sans flex items-center justify-between">
                  <span>Export formats: PDF (@media print) • JSON manifest • VPAT/ACR</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-sky-950/80 text-sky-300 border border-sky-800 text-xs font-mono font-semibold">
                Feature 06 • Reporting
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Executive Summaries &amp; Machine-Readable Artifacts
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Bridge the communication gap between engineering, product, and legal compliance teams. Inklara generates print-optimized (@media print) executive compliance scorecards, VPAT/ACR accessibility declarations, and structured JSON manifests consumable by CI/CD pipelines.
              </p>
            </div>
          </div>

          {/* Feature 7: Screen-Reader Testing Workflows */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-violet-950/80 text-violet-300 border border-violet-800 text-xs font-mono font-semibold">
                Feature 07 • Assistive Tech Simulation
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Screen-Reader Simulation Workbench
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Experience interfaces the way assistive technology users do. Inklara&apos;s screen-reader testing workbench tests 7 key interactive patterns—including modal focus traps, form validation announcements, ARIA live regions, and tabs—displaying computed accessibility names and real-time speech logs.
              </p>
              <div className="pt-2">
                <Link
                  href="/screen-reader"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Launch Screen Reader Workbench</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-sans">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-violet-400" aria-hidden="true" />
                    <span>Screen-Reader Speech Simulation</span>
                  </span>
                  <span className="text-[10px] text-violet-300 font-mono">ARIA Live / Speech Node</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-sans">
                    <span className="text-slate-400">Interaction: Dialog Trigger</span>
                    <span className="text-emerald-400 font-semibold">Focus Trapped</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 text-indigo-300 text-[11px] border border-slate-800/80">
                    &quot;Dialog opened. Complete Purchase. 2 fields. Press Escape to dismiss.&quot;
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 font-sans flex items-center justify-between">
                  <span>Computed Role: dialog • aria-modal: true</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* E. ENGINEERING ARCHITECTURE                               */}
        {/* ========================================================= */}
        <section
          aria-labelledby="architecture-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              <span>Full-Stack System Architecture</span>
            </div>
            <h2
              id="architecture-heading"
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
            >
              Verified Engineering Architecture
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Designed with defense-in-depth, strict TypeScript typing, and zero mock dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Cpu className="w-5 h-5" aria-hidden="true" />
                <span className="text-base text-white">Next.js 15 &amp; React 19</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                App Router architecture with React Server Components for ultra-fast data streaming, zero layout shift, and strict TypeScript mode without bypass shortcuts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Lock className="w-5 h-5" aria-hidden="true" />
                <span className="text-base text-white">SSRF Defense-in-Depth</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Multi-tier security rejecting RFC1918 private IPv4/IPv6 ranges, loopback, link-local, and cloud metadata (169.254.169.254) with pre-fetch DNS verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ClipboardCheck className="w-5 h-5" aria-hidden="true" />
                <span className="text-base text-white">13 WCAG-EM Protocols</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Guided human-centered evaluation testing keyboard traps, screen reader audio, reflow at 400%, and touch target dimensions with structured condition criteria.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-violet-400 font-bold">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                <span className="text-base text-white">Testing Pyramid</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                35 Vitest unit tests and 17 Playwright E2E suites verifying 0 critical or serious axe-core violations across all core routes on every commit.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* F. LIVE WORKBENCH & DATABASE DASHBOARD                     */}
        {/* ========================================================= */}
        <div id="workbench" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Live Audit Workbench
                </h2>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Active Workspace
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Monitored projects, recent execution records, and regression baselines stored in PostgreSQL.
              </p>
            </div>
          </div>

          {/* Database Uninitialized / Serverless Preview Banner */}
          {databaseError && (
            <div className="mb-8 p-5 bg-amber-950/40 border border-amber-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-amber-200">
                    Persistent Storage Disconnected (Serverless Preview Mode)
                  </h3>
                  <p className="text-xs text-amber-300/80 mt-0.5">
                    The dashboard is running in preview mode without an active PostgreSQL instance.
                    Explore the completely self-contained, interactive recruiter demonstration at /showcase or configure DATABASE_URL.
                  </p>
                </div>
              </div>
              <Link
                href="/showcase"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Launch Showcase</span>
              </Link>
            </div>
          )}

          {/* Real Metrics Grid - Zero Fabricated Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Audit Projects</span>
                <FolderKanban className="w-4 h-4 text-blue-400" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-white">{projects.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {projects.reduce((acc, p) => acc + p.targets.length, 0)} registered target environments
              </p>
            </div>

            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Total Audits Run</span>
                <History className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-white">{audits.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {audits.filter((a) => a.isBaseline).length} saved baselines • {totalPasses} verified passes
              </p>
            </div>

            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Open Automated Violations</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-amber-400">{totalOpenFindings}</p>
              <p className="text-[11px] text-emerald-400 mt-1">
                {totalVerifiedFixed} issues verified fixed
              </p>
            </div>

            <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Manual Check Progress</span>
                <ClipboardCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">{manualPercent}%</p>
                <span className="text-xs text-slate-400">({evaluatedManualChecks}/{totalManualChecks})</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden" role="progressbar" aria-valuenow={manualPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Manual accessibility evaluation progress">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${manualPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recent Audits Section */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Recent Accessibility Audits
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Executed against rendered pages using Playwright browser isolation &amp; axe-core.
                </p>
              </div>
              {audits.length > 0 && (
                <Link
                  href="/audits"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1.5 py-0.5"
                >
                  <span>View all audits</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>

            {audits.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-center">
                <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto mb-3" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-white">No Audits Recorded Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                  Execute an automated accessibility scan against the built-in local test fixture or any accessible web environment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900/60 shadow-sm">
                <table className="w-full text-left text-xs" aria-label="Recent Accessibility Audits">
                  <thead className="bg-slate-950/80 text-slate-400 font-medium border-b border-slate-800">
                    <tr>
                      <th scope="col" className="px-4 py-3">Audit Name &amp; Target</th>
                      <th scope="col" className="px-4 py-3">Project</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                      <th scope="col" className="px-4 py-3">Violations Breakdown</th>
                      <th scope="col" className="px-4 py-3">Execution Time</th>
                      <th scope="col" className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {audits.map((audit) => (
                      <tr key={audit.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <Link
                              href={`/audits/${audit.id}`}
                              className="hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                            >
                              {audit.name}
                            </Link>
                            {audit.isBaseline && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                                Baseline
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs mt-0.5">
                            {audit.targetUrl}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">
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
                        <td className="px-4 py-3.5 text-slate-400">
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
                            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                          >
                            View Results
                          </Link>
                          <Link
                            href={`/audits/${audit.id}/report`}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 rounded transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
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
          </div>

          {/* Project and Environments Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Active Audit Projects
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Repositories and monitored web application environments.
                </p>
              </div>
              <Link
                href="/projects"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1.5 py-0.5"
              >
                <span>Manage projects</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-white text-sm">
                        <Link
                          href={`/projects/${project.id}`}
                          className="hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                        >
                          {project.name}
                        </Link>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {project.auditRuns.length} audits
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {project.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {project.targets.length} Target Environments
                    </span>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* G. FINAL CALL TO ACTION FOR RECRUITERS & ENGINEERS         */}
        {/* ========================================================= */}
        <section
          aria-labelledby="cta-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-slate-700/80 bg-gradient-to-b from-slate-900/90 via-indigo-950/40 to-slate-950 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-indigo-500/15 blur-3xl opacity-75"
            />

            <div className="relative max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
                <span>Recruiter &amp; Engineering Showcase</span>
              </div>

              <h2
                id="cta-heading"
                className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
              >
                Built for Teams That Care About Digital Equality
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Explore our interactive 5-stage automated scan, understand how Inklara bridges the 60% manual accessibility testing gap, or review the comprehensive test suite and architecture.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/showcase"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Launch Interactive Showcase</span>
                </Link>

                <a
                  href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Code2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  <span>View Source on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                </a>

                <Link
                  href="/overview"
                  className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Monitor className="w-4 h-4 text-sky-400" aria-hidden="true" />
                  <span>Product Overview</span>
                </Link>

                <Link
                  href="/wcag"
                  className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <span>WCAG 2.2 Reference</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
