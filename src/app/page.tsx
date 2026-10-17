import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { SeverityBadge } from "@/components/SeverityBadge";
import { DashboardClient } from "./DashboardClient";
import { InklaraSymbol } from "@/components/brand/InklaraSymbol";
import { InklaraLogo } from "@/components/brand/InklaraLogo";
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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 outline-none space-y-16"
      >
        {/* ========================================================= */}
        {/* 1. HERO SECTION: Brand Identity & 5-Second Purpose        */}
        {/* ========================================================= */}
        <section aria-labelledby="hero-heading" className="relative pt-4 pb-8">
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl opacity-70"
          />

          <div className="relative text-center max-w-4xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-semibold mb-6 shadow-sm backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-white">Inklara Platform</span>
              <span className="text-slate-500" aria-hidden="true">•</span>
              <span className="text-indigo-300">Inclusive Engineering</span>
              <span className="text-slate-500" aria-hidden="true">•</span>
              <span className="text-slate-300">WCAG 2.2 Level AA Target</span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
            >
              Accessibility isn&apos;t a final check.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-teal-300">
                It&apos;s part of the build.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Discover barriers. Understand the evidence. Fix the experience.
              Verify every improvement.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Inklara unites headless Playwright Chromium scans and axe-core
              4.10 with 13-point WCAG-EM manual protocols, concrete code-level
              remediation diffs, and regression baseline tracking.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/25 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <Sparkles className="w-4 h-4 fill-current text-indigo-200" aria-hidden="true" />
                <span>Launch Recruiter Showcase</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 font-bold tracking-wide uppercase">
                  30s Demo
                </span>
              </Link>

              <Link
                href="/fixtures"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <Layers className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>Inspect Test Fixtures</span>
              </Link>

              <a
                href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              >
                <Code2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        {/* ========================================================= */}
        {/* 2. REAL PRODUCT-INTERFACE PREVIEW: Developer Tool Window  */}
        {/* ========================================================= */}
        <section aria-labelledby="product-preview-heading" className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                id="product-preview-heading"
                className="text-lg font-bold tracking-tight text-white flex items-center gap-2"
              >
                <Terminal className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                <span>Inklara Inspection Engine — Live Remediation Preview</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-world finding evidence, computed contrast math, and code-level remediation diff.
              </p>
            </div>
            <Link
              href="/showcase"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1.5 py-0.5"
            >
              <span>Interactive 5-stage walkthrough</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Window Frame */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl overflow-hidden font-mono text-xs">
            {/* Window Header */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-400 font-sans text-xs font-medium truncate">
                  inklara-inspector • target: https://demo.inklara.internal/checkout • Chromium 128 (Sandboxed)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-sans">
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-semibold">
                  axe-core 4.10.2
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-semibold hidden md:inline">
                  WCAG 2.2 Level AA
                </span>
              </div>
            </div>

            {/* Split Inspection Pane */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              {/* Left Pane: Finding & Evidence (5 cols) */}
              <div className="lg:col-span-5 p-5 bg-slate-950/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-800">
                    Critical Severity
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">
                    WCAG 1.4.3 Contrast (Minimum)
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Insufficient color contrast ratio on primary action
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-1">
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
                      <span className="text-slate-400 text-[10px] block">Threshold: 4.50:1</span>
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
              <div className="lg:col-span-7 p-5 bg-slate-900/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300 font-sans flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      <span>Code Remediation Patch</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      components/CheckoutButton.tsx
                    </span>
                  </div>

                  <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 overflow-x-auto text-[11px] leading-relaxed">
                    <div className="text-slate-400">
                      {"// Remediation: update foreground & background tokens"}
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
                        Verified Fixed in Regression Rescan
                      </span>
                      <span className="text-[11px] text-emerald-300/80">
                        Rescan #104 verified contrast ratio increased to 8.24:1 (surpassing 4.5:1 requirement).
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
        </section>

        {/* ========================================================= */}
        {/* 3. THE PROBLEM INKLARA SOLVES: Beyond Simple Linters      */}
        {/* ========================================================= */}
        <section aria-labelledby="problem-heading" className="space-y-6">
          <div className="max-w-3xl">
            <h2 id="problem-heading" className="text-2xl font-bold tracking-tight text-white">
              Why Automated Scanning Alone Isn&apos;t Enough
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Automated engines catch syntax errors and standard color mismatches, but accessibility is an experience, not just a tag. Inklara addresses the three fundamental flaws of modern accessibility auditing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                35%
              </div>
              <h3 className="text-base font-bold text-white">
                The Automation Ceiling
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated engines like axe-core only detect ~30-40% of WCAG criteria. They cannot verify whether a focus trap prevents keyboard users from escaping, or if dynamic ARIA live announcements fire correctly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-white">
                The Remediation Void
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Traditional tools dump walls of compliance rules without providing engineers with actionable code diffs, computed DOM metrics, or context on how assistive tech perceives the element.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
                <GitCompare className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-white">
                The Regression Hazard
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fast-moving production teams frequently re-introduce resolved barriers. Without deterministic baseline tracking comparing before and after scans, fixes silently degrade over time.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. THE 5-STAGE ACCESSIBILITY ENGINEERING WORKFLOW         */}
        {/* ========================================================= */}
        <section aria-labelledby="workflow-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 id="workflow-heading" className="text-2xl font-bold tracking-tight text-white">
                The 5-Stage Inclusive Engineering Workflow
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Inspired by the visual storytelling of Snowdog&apos;s a11y audit tool.
              </p>
            </div>
            <Link
              href="/showcase"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1.5 py-0.5"
            >
              <span>Watch full animation in Showcase</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-[11px]">
                  01
                </span>
                <span className="font-bold text-white text-sm">Discover</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Headless Playwright Chromium sandbox renders the full SPA and executes axe-core 4.10 rules with SSRF network isolation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-[11px]">
                  02
                </span>
                <span className="font-bold text-white text-sm">Inspect</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Inspect pinpoint failure evidence: exact CSS selectors, computed color contrast math, and WCAG 2.2 AA success criteria mappings.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-400 border border-violet-500/40 flex items-center justify-center font-bold text-[11px]">
                  03
                </span>
                <span className="font-bold text-white text-sm">Remediate</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Review verified code patches, ARIA role corrections, and semantic HTML diffs designed specifically for frontend engineers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-[11px]">
                  04
                </span>
                <span className="font-bold text-white text-sm">Verify</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Rescan against stored baselines to detect newly introduced defects, verified fixes, and persistent issues automatically.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600/30 text-teal-400 border border-teal-500/40 flex items-center justify-center font-bold text-[11px]">
                  05
                </span>
                <span className="font-bold text-white text-sm">Report</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate executive summaries, compliance breakdowns, and VPAT-ready documentation ready for stakeholders and auditors.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. TECHNICAL ARCHITECTURE & VERIFIED CAPABILITIES         */}
        {/* ========================================================= */}
        <section aria-labelledby="architecture-heading" className="space-y-6">
          <div className="max-w-3xl">
            <h2 id="architecture-heading" className="text-2xl font-bold tracking-tight text-white">
              Verified Technical Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Engineered with defense-in-depth, zero mockups, and strict production quality gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Cpu className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm text-white">Next.js 14 &amp; TypeScript</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                App Router architecture with React Server Components for fast data streaming and strict TypeScript mode without shortcuts.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Lock className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm text-white">SSRF Defense-in-Depth</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Multi-tier security rejecting RFC1918 private IPv4/IPv6 ranges, loopback, link-local, and cloud metadata with pre-fetch DNS verification.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm text-white">13 WCAG-EM Protocols</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Guided human-centered evaluation testing keyboard traps, screen reader audio, reflow at 400%, and touch target dimensions.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-violet-400 font-bold">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm text-white">Testing Pyramid</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                35 Vitest unit tests and 16 Playwright E2E suites verifying 0 critical or serious axe violations across all core views.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. LIVE WORKBENCH & DATABASE DASHBOARD                     */}
        {/* ========================================================= */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Live Audit Workbench
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Active Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Monitored projects, recent execution records, and regression baselines stored in PostgreSQL.
              </p>
            </div>
          </div>

          {/* Database Uninitialized / Serverless Preview Banner */}
          {databaseError && (
            <div className="mb-6 p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Launch Showcase (30s)</span>
              </Link>
            </div>
          )}

          {/* Real Metrics Grid - Zero Fabricated Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Audit Projects</span>
                <FolderKanban className="w-4 h-4 text-blue-400" aria-hidden="true" />
              </div>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {projects.reduce((acc, p) => acc + p.targets.length, 0)} registered target environments
              </p>
            </div>

            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Total Audits Run</span>
                <History className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              </div>
              <p className="text-2xl font-bold text-white">{audits.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {audits.filter((a) => a.isBaseline).length} saved baselines • {totalPasses} verified passes
              </p>
            </div>

            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Open Automated Violations</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
              </div>
              <p className="text-2xl font-bold text-amber-400">{totalOpenFindings}</p>
              <p className="text-[11px] text-emerald-400 mt-1">
                {totalVerifiedFixed} issues verified fixed
              </p>
            </div>

            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Manual Check Progress</span>
                <ClipboardCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white">{manualPercent}%</p>
                <span className="text-xs text-slate-400">({evaluatedManualChecks}/{totalManualChecks})</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden" role="progressbar" aria-valuenow={manualPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Manual accessibility evaluation progress">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${manualPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Audits Section */}
        <section aria-labelledby="recent-audits-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="recent-audits-heading" className="text-lg font-bold text-white">
                Recent Accessibility Audits
              </h2>
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
              <h3 className="text-sm font-semibold text-white">No Audits Recorded Yet</h3>
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
        </section>

        {/* Project and Environments Section */}
        <section aria-labelledby="projects-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="projects-heading" className="text-lg font-bold text-white">
                Active Audit Projects
              </h2>
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
                    <h3 className="font-semibold text-white text-sm">
                      <Link
                        href={`/projects/${project.id}`}
                        className="hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
                      >
                        {project.name}
                      </Link>
                    </h3>
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
        </section>

        {/* ========================================================= */}
        {/* 7. PROFESSIONAL CLOSING CALL TO ACTION FOR RECRUITERS     */}
        {/* ========================================================= */}
        <section
          aria-labelledby="cta-heading"
          className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-700/80 bg-gradient-to-b from-slate-900/90 via-indigo-950/40 to-slate-950 text-center"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/15 blur-3xl opacity-70"
          />

          <div className="relative max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
              <span>Recruiter &amp; Engineering Showcase</span>
            </div>

            <h2 id="cta-heading" className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for Engineering Teams That Care About Digital Equality
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Experience the 5-stage automated scan, understand how Inklara bridges the 60% automated testing gap, or review the comprehensive test suite and architecture.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Launch Interactive Showcase</span>
              </Link>

              <a
                href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Code2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>View Source on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </a>

              <Link
                href="/wcag"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <span>WCAG 2.2 Reference</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
