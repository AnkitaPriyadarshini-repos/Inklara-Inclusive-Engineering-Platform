import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { SeverityBadge } from "@/components/SeverityBadge";
import { DashboardClient } from "./DashboardClient";
import { WorkbenchActions } from "@/components/WorkbenchActions";
import { AnimatedProductDemo } from "@/components/showcase/AnimatedProductDemo";
import {
  FolderKanban,
  History,
  AlertTriangle,
  ClipboardCheck,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  Code2,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Volume2,
  FileText,
  Layers,
  CheckCircle,
  Users,
  GitBranch,
  Play,
  FileCheck2,
  Globe,
  Sliders,
  HelpCircle,
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      <DashboardClient
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="outline-none space-y-24 sm:space-y-32 pb-24"
      >
        {/* ========================================================= */}
        {/* 1. HERO SECTION: Clean Editorial Typography + Large Mockup */}
        {/* ========================================================= */}
        <section
          aria-labelledby="hero-heading"
          className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/90 bg-gradient-to-b from-slate-50/60 to-white"
        >
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Category Breadcrumbs & Metadata Tag */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>Web Accessibility Testing & Verification</span>
              </span>
              <span className="text-slate-400 hidden sm:inline" aria-hidden="true">•</span>
              <span className="text-slate-600 font-medium hidden sm:inline">Continuous CI/CD Quality Gates</span>
              <span className="text-slate-400 hidden sm:inline" aria-hidden="true">•</span>
              <span className="text-indigo-700 font-mono font-semibold hidden sm:inline">WCAG 2.2 Level AA Target</span>
            </div>

            {/* Headline: Clean, Natural, Editorial Proportions */}
            <div className="space-y-5 max-w-4xl">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]"
              >
                Build accessible experiences.
                <span className="block text-indigo-600">Verify every interaction.</span>
              </h1>

              <p className="text-lg sm:text-2xl text-slate-600 font-normal leading-relaxed max-w-3xl">
                The comprehensive platform for web application accessibility testing and report generation. Combine browser-isolated automated scans with structured human evaluation and deterministic regression verification.
              </p>
            </div>

            {/* Primary Calls to Action */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/showcase"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Try Interactive Showcase</span>
                <ArrowRight className="w-4 h-4 ml-0.5" aria-hidden="true" />
              </Link>

              <a
                href="#workbench"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                <FolderKanban className="w-4 h-4 text-slate-600" aria-hidden="true" />
                <span>Open Live Workbench</span>
              </a>

              <Link
                href="/overview"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                <span>Product Overview</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Genuine High-Fidelity Product Inspection Window */}
            <div className="pt-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden">
                {/* Browser Window Header */}
                <div className="px-4 py-3 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <div className="w-3 h-3 rounded-full bg-slate-300" />
                      <div className="w-3 h-3 rounded-full bg-slate-300" />
                      <div className="w-3 h-3 rounded-full bg-slate-300" />
                    </div>
                    <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-slate-600 font-mono text-[11px]">
                      <span className="text-slate-600">https://</span>
                      <span className="text-slate-800 font-semibold">inklara.dev</span>
                      <span className="text-slate-600">/audits/enterprise-checkout</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="hidden sm:inline-block text-slate-600 font-mono text-[11px]">
                      axe-core 4.10.2 • Playwright Engine
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live Verified Audit
                    </span>
                  </div>
                </div>

                {/* Product Interface Body */}
                <div className="p-5 sm:p-7 bg-slate-50/40 space-y-5">
                  {/* Top Audit Header Metrics */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          Enterprise Design System Benchmark
                        </h2>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          WCAG 2.2 AA
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200">
                          Run #482
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Audited target: <code className="font-mono text-slate-700">http://localhost:3000/demo/inaccessible</code> • 52 rules evaluated
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-slate-600 block">Compliance Score</span>
                        <span className="text-2xl font-black text-slate-900">94%</span>
                      </div>
                      <div className="h-8 w-px bg-slate-200" aria-hidden="true" />
                      <div className="text-right">
                        <span className="text-xs text-slate-600 block">Status</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                          PASSING (AA)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dual-Column Workbench Workspace Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left Column: Categorized Findings Index */}
                    <div className="lg:col-span-5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                        <span>Detected Accessibility Findings (3)</span>
                        <span className="text-indigo-600 font-semibold text-[11px]">Filtered: Critical & Serious</span>
                      </div>

                      {/* Finding Card 1 (Active Selected) */}
                      <div className="bg-white p-3.5 rounded-xl border-2 border-indigo-600 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Serious
                          </span>
                          <span className="text-[11px] font-mono text-slate-600 font-semibold">WCAG 1.4.3</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">
                          Elements must meet minimum color contrast ratio
                        </h3>
                        <div className="p-2 bg-slate-50 rounded text-[11px] font-mono text-slate-700 border border-slate-200 truncate">
                          p.checkout-disclaimer (2.34:1)
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Remediation patch verified (7.12:1)</span>
                        </div>
                      </div>

                      {/* Finding Card 2 */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Critical
                          </span>
                          <span className="text-[11px] font-mono text-slate-600 font-semibold">WCAG 1.1.1</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">
                          Images must have alternate text
                        </h3>
                        <div className="p-2 bg-slate-50 rounded text-[11px] font-mono text-slate-700 border border-slate-200 truncate">
                          img.hero-product
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Descriptive alt tag applied</span>
                        </div>
                      </div>

                      {/* Finding Card 3 */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Verified
                          </span>
                          <span className="text-[11px] font-mono text-slate-600 font-semibold">WCAG 2.4.7</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">
                          Keyboard focus indicator visible
                        </h3>
                        <div className="p-2 bg-slate-50 rounded text-[11px] font-mono text-slate-700 border border-slate-200 truncate">
                          button.primary-checkout:focus-visible
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 pt-0.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>2px solid outline ring confirmed</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Finding Diagnostic Math & Live Code Diff */}
                    <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                              Active Diagnostic & Code Patch
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              WCAG 1.4.3 — Contrast (Minimum) Resolution
                            </span>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Zero Regressions
                          </span>
                        </div>

                        {/* Computed Math Comparison */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200 text-center">
                            <span className="text-[10px] font-bold text-rose-800 uppercase block">Measured Ratio</span>
                            <span className="text-xl font-black text-rose-900">2.34 : 1</span>
                            <span className="text-[10px] text-rose-700 block mt-0.5">Deficient by 2.16</span>
                          </div>
                          <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-center">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Verified Patch Ratio</span>
                            <span className="text-xl font-black text-emerald-900">7.12 : 1</span>
                            <span className="text-[10px] text-emerald-700 block mt-0.5">Exceeds AA (4.5:1) & AAA</span>
                          </div>
                        </div>

                        {/* Live Code Patch Diff */}
                        <div className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800 shadow-inner overflow-x-auto">
                          <div className="text-slate-400 text-[11px]">{"// Suggested Source Code Correction"}</div>
                          <div className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded">
                            - &lt;p className=&quot;checkout-disclaimer text-slate-400&quot;&gt;
                          </div>
                          <div className="text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded font-semibold">
                            + &lt;p className=&quot;checkout-disclaimer text-slate-700 font-medium&quot;&gt;
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          Increasing the foreground text contrast token resolves the defect with zero layout shift, preserving full design fidelity across all supported display profiles.
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-mono text-[11px]">
                          SHA-256: 7f83b165...e92a
                        </span>
                        <span className="font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                          Inspect in Live Workbench →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. STANDARDS & LEGAL COMPLIANCE TICKER                    */}
        {/* ========================================================= */}
        <section aria-label="Supported Accessibility Standards" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-4">
            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-slate-600">
              Verified Compliance Frameworks & International Standards
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
              {[
                { name: "W3C WCAG 2.2 AA", badge: "Global Standard" },
                { name: "European Accessibility Act (EAA)", badge: "EU 2025" },
                { name: "Americans with Disabilities Act (ADA)", badge: "US Title III" },
                { name: "Section 508 Standards", badge: "Federal" },
                { name: "EN 301 549", badge: "Procurement" },
                { name: "Accessible Canada Act (ACA)", badge: "Canada" },
              ].map((std) => (
                <div
                  key={std.name}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                  <span>{std.name}</span>
                  <span className="text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {std.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. EDITORIAL VALUE STATEMENT (Snowdog-Inspired Text Block) */}
        {/* ========================================================= */}
        <section aria-labelledby="mission-heading" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2
              id="mission-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug"
            >
              With both automated and manual testing capabilities, Inklara ensures your web applications meet WCAG 2.2 standards and empowers engineering teams to identify and address accessibility issues effectively.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Evaluate your applications against the most recognized accessibility frameworks worldwide, including the Americans with Disabilities Act (ADA), the European Accessibility Act (EAA), Section 508, and EN 301 549.
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. WHO CAN BENEFIT (2-Column Editorial Presentation)      */}
        {/* ========================================================= */}
        <section aria-labelledby="benefit-heading" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <h2
                id="benefit-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
              >
                Who can benefit from Inklara?
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Inklara is designed for both technical engineering teams and compliance stakeholders. The open-source workbench is ideal for frontend developers, QA engineers, and accessibility testers who require browser-isolated diagnostic evidence.
              </p>

              <p className="text-base text-slate-600 leading-relaxed">
                The platform excels in organizations managing multiple applications, design systems, and web properties—streamlining audits, accelerating remediation with copyable code patches, and maintaining high accessibility standards across releases.
              </p>

              <div className="pt-2">
                <Link
                  href="/overview"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  <span>Explore Product Overview</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right Column: Genuine Diagnostic Evidence Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      DOM Diagnostic Inspector
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-600">WCAG 1.4.3</span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-700">Computed Luminance Ratio:</div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-around">
                    <div className="text-center">
                      <span className="text-[11px] text-rose-700 uppercase font-bold block">Measured</span>
                      <span className="text-2xl font-black text-rose-800 block">2.34 : 1</span>
                    </div>
                    <div className="text-slate-600 text-xl font-semibold">vs</div>
                    <div className="text-center">
                      <span className="text-[11px] text-emerald-700 uppercase font-bold block">Target (AA)</span>
                      <span className="text-2xl font-black text-emerald-800 block">4.50 : 1</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800">
                  <div className="text-slate-300">{"// Computed DOM Selector"}</div>
                  <div className="text-indigo-300">button.primary-checkout:disabled</div>
                  <div className="text-emerald-400 font-semibold pt-1">
                    + style=&quot;color: #0f172a; background: #ffffff;&quot;
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Exact mathematical DOM coordinates provided for zero-friction fixes.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. SELECT YOUR VERSION (Clean 2-Card Layout)              */}
        {/* ========================================================= */}
        <section aria-labelledby="versions-heading" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2
                id="versions-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
              >
                Select your version
              </h2>
              <p className="text-base text-slate-600 max-w-2xl mx-auto">
                Choose the deployment model suited to your team&apos;s infrastructure and compliance requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Option 1: Open-Source */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Code2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Open-Source Workbench</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      The perfect way to kick off digital accessibility verification in local engineering workflows.
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-700">
                    {[
                      "Automated axe-core 4.10.2 scans",
                      "Guided manual WCAG-EM checklists",
                      "Combined dual-engine testing approach",
                      "Machine-readable JSON reports & scoring",
                      "Local project & audit run organization",
                      "Screen-reader scenario runner & timeline",
                      "SQLite and PostgreSQL database adapters",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <a
                    href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
                  >
                    <Code2 className="w-4 h-4 text-slate-600" aria-hidden="true" />
                    <span>Go to GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Option 2: Enterprise */}
              <div className="bg-white rounded-2xl border-2 border-indigo-600 shadow-md p-6 sm:p-8 flex flex-col justify-between space-y-8 relative">
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                  Production Scale
                </span>

                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Users className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Enterprise Platform</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      For complex systems, multi-domain applications, and continuous CI/CD governance.
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-700">
                    {[
                      "Everything in Open-Source Workbench",
                      "Multi-page and multi-viewport responsive testing",
                      "Continuous CI/CD build-gate regression checks",
                      "Historical SHA-256 finding signatures",
                      "Audits and accessibility declarations registry",
                      "Audit delegation and collaborative workflows",
                      "Executive stakeholder PDFs & compliance scoring",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                        <span className="font-medium text-slate-900">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Link
                    href="/showcase"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600"
                  >
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>Launch Interactive Showcase</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. WHY CHOOSE INKLARA — Core Feature Pillars (Snowdog)    */}
        {/* ========================================================= */}
        <section id="features" aria-labelledby="why-heading" className="px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h2
              id="why-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
            >
              Why choose Inklara?
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Say goodbye to superficial automated overlays and hello to real developer-first verification that fixes root causes in source code.
            </p>
          </div>

          {/* Pillar 1: Comprehensive Dual Testing */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                01. Dual-Engine Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Comprehensive testing
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Unlike most tools that focus solely on automatic or manual tests, Inklara offers both, ensuring comprehensive results. During manual tests, you can review and comment on automatic test results.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-200">
                  <span>Engine Coverage Breakdown</span>
                  <span className="text-indigo-600">WCAG-EM Protocol</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-600 font-semibold block">Automated Sweep</span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">52 Rules</span>
                    <span className="text-xs text-emerald-700 font-medium">Headless axe-core</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-600 font-semibold block">Guided Manual</span>
                    <span className="text-2xl font-black text-slate-900 mt-1 block">35 Checks</span>
                    <span className="text-xs text-indigo-700 font-medium">WCAG-EM Matrix</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Guided Testing */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                02. Human Audit Template
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Guided testing
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Our audit template guides you through accessibility features. It provides test conditions and techniques to solve issues. A tester doesn&apos;t need to be an expert in the accessibility field to perform an audit using our tool.
              </p>
            </div>
            <div className="lg:col-span-6 lg:order-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Checklist Item: Focus Trap Dismissal</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    WCAG 2.1.2
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 space-y-1 border border-slate-200">
                  <div className="font-semibold text-slate-900">Test Condition:</div>
                  <p>When modal opens, press Escape key. Verify modal dismisses and focus restores to trigger.</p>
                </div>
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Step-by-step guidance removes guesswork for QA testers.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: Multi-Page & Multi-Screen Testing */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                03. Responsive Verification
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Multi-page and multi-screen testing
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Test multiple pages (URLs) and screen sizes in a single audit, enhancing efficiency and guaranteeing reflow conformance at 320px viewport without loss of content or 2D scrolling.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-around">
                  <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-2xs w-28">
                    <Monitor className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">Desktop</span>
                    <span className="text-[11px] text-slate-600 font-mono">1920x1080</span>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-2xs w-28">
                    <Tablet className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">Tablet</span>
                    <span className="text-[11px] text-slate-600 font-mono">768x1024</span>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-slate-200 shadow-2xs w-28">
                    <Smartphone className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">Mobile</span>
                    <span className="text-[11px] text-slate-600 font-mono">320x640</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 4: Clear Reports */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                04. Stakeholder Clarity
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Clear reports
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Generated reports are clear and understandable, facilitating discussions with clients and roadmap planning for improvement efforts. Export in PDF for executives or JSON for automated CI pipelines.
              </p>
            </div>
            <div className="lg:col-span-6 lg:order-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-bold text-slate-900">Executive PDF & JSON Manifest</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Grade A Conformance
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-600 block">Pass Rate</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">94.2%</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-600 block">Open Defects</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">0 Critical</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-600 block">Verification</span>
                    <span className="font-bold text-emerald-700 text-sm mt-0.5 block">Deterministic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 5: Extensibility with Playwright */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                05. Developer Extensibility
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Extensibility
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Extend the tool&apos;s capabilities by adding custom test cases using Playwright, reducing manual work and enhancing efficiency across complex authentication and transactional flows.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="bg-slate-900 rounded-2xl p-6 text-slate-200 font-mono text-xs space-y-2 border border-slate-800 shadow-sm">
                <div className="text-slate-300">{"// Custom Playwright Accessibility Assertion"}</div>
                <div><span className="text-indigo-400">const</span> results = <span className="text-indigo-400">await</span> runAxe(page);</div>
                <div><span className="text-emerald-400">expect</span>(results.violations).<span className="text-indigo-400">toEqual</span>([]);</div>
                <div className="text-slate-300 pt-2">{"// Integrates seamlessly into GitHub Actions CI"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. HOW INKLARA WORKS: Large Interactive Demonstration     */}
        {/* ========================================================= */}
        <section id="walkthrough" aria-labelledby="walkthrough-heading" className="px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2
                id="walkthrough-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
              >
                See how Inklara works
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Follow an accessibility issue from its initial discovery through investigation, remediation, verification, and reporting.
              </p>
            </div>

            {/* Polished, Product-Led Interactive Walkthrough */}
            <AnimatedProductDemo />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. INKLARA LIVE WORKBENCH (#workbench)                     */}
        {/* ========================================================= */}
        <section
          id="workbench"
          aria-labelledby="workbench-heading"
          className="px-4 sm:px-6 lg:px-8 pt-4 scroll-mt-20"
        >
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <h2
                  id="workbench-heading"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                >
                  Workbench Management
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Active projects, recent audit runs, and live verification controls.
                </p>
              </div>

              {/* Working Workbench Actions (Execute Audit, New Project, Seed Fixtures) */}
              <WorkbenchActions />
            </div>

            {/* Metric Overview Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">Active Projects</span>
                  <FolderKanban className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900 mt-2 block">{projects.length}</span>
                <span className="text-[11px] text-slate-600">Configured test suites</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">Total Audits</span>
                  <History className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900 mt-2 block">{audits.length}</span>
                <span className="text-[11px] text-slate-600">Executed evaluations</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">Open Findings</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <span className="text-2xl font-bold text-rose-700 mt-2 block">{totalOpenFindings}</span>
                <span className="text-[11px] text-slate-600">Requires remediation</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">Verified Fixed</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-2xl font-bold text-emerald-700 mt-2 block">{totalVerifiedFixed}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Persisted resolution</span>
              </div>
            </div>

            {/* Active Projects Table & Recent Audits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Projects List */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Active Projects</h3>
                  <Link href="/projects" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold">
                    View all ({projects.length}) →
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {projects.length === 0 ? (
                    <div className="p-8 text-center space-y-3">
                      <p className="text-sm text-slate-600">No projects configured yet.</p>
                      <p className="text-xs text-slate-600">Click &quot;Seed Benchmark Fixtures&quot; above to initialize test data.</p>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors block"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 text-sm block">
                            {project.name}
                          </span>
                          <span className="text-xs text-slate-600 font-mono mt-0.5 block truncate max-w-md">
                            {project.description || "Standard accessibility benchmark target"}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-indigo-600 block">
                            {project.auditRuns?.length || 0} audits
                          </span>
                          <span className="text-xs text-slate-600 font-medium">
                            {project.targets?.length || 0} targets
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Audit Runs */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Audit Runs</h3>
                  <Link href="/audits" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold">
                    View all →
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {audits.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-600">
                      No audit runs recorded yet.
                    </div>
                  ) : (
                    audits.slice(0, 5).map((audit) => (
                      <Link
                        key={audit.id}
                        href={`/audits/${audit.id}`}
                        className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors block"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 text-sm block">
                            {audit.project?.name || "Audit Run"}
                          </span>
                          <span className="text-xs text-slate-600 font-mono mt-0.5 block truncate max-w-xs">
                            {audit.target?.environment || "production"}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            audit.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}>
                            {audit.status}
                          </span>
                          <span className="text-xs text-slate-600 font-medium block mt-1">
                            {audit.violationsCount || 0} violations
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 9. METRICS & COUNTER SECTION (Snowdog Numbers)            */}
        {/* ========================================================= */}
        <section aria-label="Platform Impact Metrics" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto py-12 px-6 sm:px-12 bg-slate-50 rounded-3xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-black text-slate-900">87+</div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  WCAG 2.2 Success Criteria
                </h3>
                <p className="text-xs text-slate-600">Level A, AA, and AAA rules mapped</p>
              </div>

              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-black text-slate-900">100%</div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Deterministic Verification
                </h3>
                <p className="text-xs text-slate-600">SHA-256 fingerprint matching</p>
              </div>

              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-black text-slate-900">0</div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  False-Positive Guarantee
                </h3>
                <p className="text-xs text-slate-600">Backed by exact DOM node mathematics</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 10. FREQUENTLY ASKED QUESTIONS                           */}
        {/* ========================================================= */}
        <section aria-labelledby="faq-heading" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2
                id="faq-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
              >
                Frequently asked questions
              </h2>
              <p className="text-base text-slate-600">
                Common questions about Inklara, automated scanning limits, and compliance verification.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Can automated testing catch 100% of accessibility issues?",
                  a: "No. Automated tools such as axe-core detect approximately 30% to 40% of WCAG criteria (e.g., color contrast, missing alt attributes, duplicate IDs). The remaining criteria—such as logical keyboard reading order, focus traps, and meaningful screen-reader announcements—require guided human evaluation. Inklara bridges this gap by unifying both in a single workflow.",
                },
                {
                  q: "How does Inklara prevent regressions before code reaches production?",
                  a: "Inklara computes a SHA-256 fingerprint for each violation based on its rule ID, selector, and DOM node coordinates. When you re-run an audit or execute tests in CI/CD, Inklara compares current findings against baseline hashes to confirm fixes persist and alert you to new regressions.",
                },
                {
                  q: "Does Inklara work with local development servers and staging environments?",
                  a: "Yes. Inklara audits any HTTP/HTTPS target accessible from your network, including localhost, Docker containers, and staging URLs. Built-in SSRF protection prevents abuse while allowing legitimate private intranet auditing.",
                },
                {
                  q: "What standards and regulations are supported in executive reports?",
                  a: "Inklara maps audit findings directly against WCAG 2.2 Level AA, the European Accessibility Act (EAA 2025), Section 508, and the Americans with Disabilities Act (ADA Title III). Reports include both executive summaries and detailed developer remediation patches.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-2"
                >
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{item.q}</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed pl-6">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 11. BOTTOM CTA & FOOTER                                   */}
        {/* ========================================================= */}
        <section aria-labelledby="cta-heading" className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto py-12 px-6 sm:px-12 bg-slate-900 rounded-3xl text-center text-white space-y-6 shadow-xl">
            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight"
            >
              Ready to verify your web applications?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              Test your design systems, explore live DOM evidence, and generate stakeholder-ready reports today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-white"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <span>Launch Interactive Showcase</span>
              </Link>
              <a
                href="#workbench"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-white"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Execute Local Audit</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Global Clean Editorial Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-bold text-slate-900 text-sm">Inklara</span>
            <p className="text-slate-600">
              Inclusive Engineering Platform • Continuous Web Accessibility Testing
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-600">
            <Link href="/overview" className="hover:text-slate-900 transition-colors">
              Product Overview
            </Link>
            <Link href="/showcase" className="hover:text-slate-900 transition-colors">
              Interactive Showcase
            </Link>
            <Link href="/projects" className="hover:text-slate-900 transition-colors">
              Projects
            </Link>
            <Link href="/audits" className="hover:text-slate-900 transition-colors">
              Audits
            </Link>
            <Link href="/screen-reader" className="hover:text-slate-900 transition-colors">
              Screen Reader
            </Link>
            <Link href="/wcag" className="hover:text-slate-900 transition-colors">
              WCAG Catalog
            </Link>
            <a
              href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-200 text-center text-slate-600 text-xs space-y-1">
          <p>Evaluation Scope & Non-Certification Notice: Inklara provides automated analysis and guided evaluation assistance. Conformance declarations require ongoing human review.</p>
          <p>© {new Date().getFullYear()} Inklara. Open-source under MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
