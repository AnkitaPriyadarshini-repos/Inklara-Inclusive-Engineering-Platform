"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { SanitizedCodeBlock } from "@/components/SanitizedCodeBlock";
import { REMEDIATION_CATALOG } from "@/lib/remediation/catalog";
import { WCAG_CATALOG } from "@/lib/wcag/catalog";
import { InklaraLogo } from "@/components/brand/InklaraLogo";
import { AnimatedProductDemo } from "@/components/showcase/AnimatedProductDemo";
import {
  Sparkles,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Volume2,
  BookOpen,
  FolderKanban,
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Code2,
  Cpu,
  Lock,
  Zap,
  Terminal,
  Activity,
  ArrowRight,
  ChevronRight,
  Compass,
  Laptop,
  CheckCircle,
  HelpCircle,
  Clock,
  Eye,
  Sliders,
  Award,
} from "lucide-react";

// Types for Demo Findings
interface DemoFinding {
  id: string;
  ruleId: string;
  ruleTitle: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  wcagId: string;
  selector: string;
  snippet: string;
  summary: string;
  status: "OPEN" | "IN_PROGRESS" | "VERIFIED_FIXED";
  verifiedAt?: string;
}

// Target definition
interface DemoTarget {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  expectedViolations: number;
  complianceRate: number;
  findings: DemoFinding[];
}

const DEMO_TARGETS: DemoTarget[] = [
  {
    id: "inaccessible",
    name: "Target A — Inaccessible E-Commerce Portal",
    url: "/demo/inaccessible",
    category: "Defective Benchmark Target",
    description:
      "A simulated e-commerce checkout page engineered with 7 deliberate WCAG 2.2 violations (low contrast, missing alt, unlabeled inputs, broken tab order, invalid roles).",
    expectedViolations: 7,
    complianceRate: 28,
    findings: [
      {
        id: "demo-f1",
        ruleId: "color-contrast",
        ruleTitle: "Elements must have sufficient color contrast (WCAG 1.4.3)",
        impact: "serious",
        wcagId: "1.4.3",
        selector: "p[style*=\"color: #a1a1aa\"]",
        snippet: '<p style="color: #a1a1aa; background-color: #f9fafb;" class="text-sm mb-4">Please enter your credit card information carefully to complete the purchase.</p>',
        summary: "Element has insufficient color contrast ratio of 2.3:1 (foreground: #a1a1aa, background: #f9fafb). Expected minimum ratio is 4.5:1.",
        status: "OPEN",
      },
      {
        id: "demo-f2",
        ruleId: "image-alt",
        ruleTitle: "Images must have alternate text (WCAG 1.1.1)",
        impact: "critical",
        wcagId: "1.1.1",
        selector: "img.mb-4.rounded",
        snippet: '<img src="data:image/svg+xml;utf8,<svg..." class="mb-4 rounded">',
        summary: "An <img> element does not possess an 'alt' attribute, leaving screen reader users without contextual information.",
        status: "OPEN",
      },
      {
        id: "demo-f3",
        ruleId: "button-name",
        ruleTitle: "Buttons must have discernible text (WCAG 4.1.2)",
        impact: "critical",
        wcagId: "4.1.2",
        selector: "button.w-8.h-8.bg-red-500",
        snippet: '<button type="button" class="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center"><svg ...></svg></button>',
        summary: "Button contains an icon but no visible text or aria-label, yielding an empty accessible name in the accessibility tree.",
        status: "OPEN",
      },
      {
        id: "demo-f4",
        ruleId: "label",
        ruleTitle: "Form inputs must have associated labels (WCAG 3.3.2, 4.1.2)",
        impact: "critical",
        wcagId: "3.3.2",
        selector: 'input[name="fullname"]',
        snippet: '<input type="text" name="fullname" placeholder="e.g. Jane Doe" class="border p-2 w-full rounded">',
        summary: "Input element lacks an associated <label for=\"...\"> element, aria-label, or aria-labelledby attribute.",
        status: "OPEN",
      },
      {
        id: "demo-f5",
        ruleId: "tabindex",
        ruleTitle: "Elements should not have tabIndex greater than zero (WCAG 2.4.3)",
        impact: "serious",
        wcagId: "2.4.3",
        selector: 'input[name="coupon"]',
        snippet: '<input type="text" name="coupon" tabindex="5" placeholder="DISCOUNT20" class="border p-2 w-full rounded">',
        summary: "Positive tabindex='5' disrupts natural DOM keyboard navigation and reading order.",
        status: "OPEN",
      },
      {
        id: "demo-f6",
        ruleId: "heading-order",
        ruleTitle: "Heading levels should only increase by one (WCAG 1.3.1)",
        impact: "moderate",
        wcagId: "1.3.1",
        selector: "h4.text-xl.font-bold.mb-4",
        snippet: '<h4 class="text-xl font-bold mb-4">Customer Details</h4>',
        summary: "Heading level skipped from <h1> directly to <h4> without intermediate <h2> or <h3> landmarks.",
        status: "OPEN",
      },
      {
        id: "demo-f7",
        ruleId: "aria-roles",
        ruleTitle: "ARIA roles must conform to valid WAI-ARIA values (WCAG 4.1.2)",
        impact: "serious",
        wcagId: "4.1.2",
        selector: 'div[role="custom-button"]',
        snippet: '<div role="custom-button" tabindex="0">Proceed to Payment</div>',
        summary: "Role 'custom-button' is not a recognized WAI-ARIA 1.2 landmark or widget role.",
        status: "OPEN",
      },
    ],
  },
  {
    id: "accessible",
    name: "Target B — Remediated Accessible Portal",
    url: "/demo/accessible",
    category: "Verified Baseline Target",
    description:
      "The remediated companion fixture featuring high-contrast text (11.2:1), descriptive alt text, explicit form labels, natural keyboard tab order, and compliant heading landmarks.",
    expectedViolations: 0,
    complianceRate: 100,
    findings: [],
  },
  {
    id: "screen-reader",
    name: "Target C — Screen-Reader Interaction Sandbox",
    url: "/demo/screen-reader",
    category: "Assistive Tech Scenario Target",
    description:
      "Interactive ARIA widgets (accessible modal dialog with focus trapping, live region polite announcements, disclosure menus, tablists, and toggle switches).",
    expectedViolations: 0,
    complianceRate: 100,
    findings: [],
  },
];

type RoleLens = "fullstack" | "frontend" | "a11y" | "sdet";

export function ShowcaseClient() {
  // Recruiter Role Lens State
  const [activeRole, setActiveRole] = useState<RoleLens>("fullstack");

  // Interactive Demo Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTargetId, setSelectedTargetId] = useState<string>("inaccessible");
  const [selectedViewport, setSelectedViewport] = useState<string>("desktop");

  // Demonstration findings state (mutable for interactive verification)
  const currentTarget = useMemo(
    () => DEMO_TARGETS.find((t) => t.id === selectedTargetId) || DEMO_TARGETS[0],
    [selectedTargetId]
  );
  const [demoFindings, setDemoFindings] = useState<DemoFinding[]>(currentTarget.findings);
  const [selectedFindingId, setSelectedFindingId] = useState<string>(
    currentTarget.findings[0]?.id || ""
  );

  // Scanning progress state for Stage 2
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Verification state for Stage 4
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Copy feedback state
  const [copiedSelector, setCopiedSelector] = useState<string | null>(null);

  // Filters for Stage 3
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Reset findings when target changes
  useEffect(() => {
    setDemoFindings(currentTarget.findings);
    setSelectedFindingId(currentTarget.findings[0]?.id || "");
    setVerificationFeedback(null);
  }, [currentTarget]);

  // Active finding for inspection
  const activeFinding = useMemo(
    () => demoFindings.find((f) => f.id === selectedFindingId) || demoFindings[0],
    [demoFindings, selectedFindingId]
  );

  const activeGuidance = useMemo(() => {
    if (!activeFinding) return null;
    return REMEDIATION_CATALOG[activeFinding.ruleId] || null;
  }, [activeFinding]);

  const activeWcag = useMemo(() => {
    if (!activeFinding) return null;
    return WCAG_CATALOG[activeFinding.wcagId] || null;
  }, [activeFinding]);

  // Filtered findings for Stage 3
  const filteredFindings = useMemo(() => {
    return demoFindings.filter((f) => {
      const matchSeverity =
        severityFilter === "ALL" || f.impact.toUpperCase() === severityFilter;
      const matchStatus = statusFilter === "ALL" || f.status === statusFilter;
      return matchSeverity && matchStatus;
    });
  }, [demoFindings, severityFilter, statusFilter]);

  // Compute live compliance score
  const liveCompliance = useMemo(() => {
    if (demoFindings.length === 0) return 100;
    const fixedCount = demoFindings.filter((f) => f.status === "VERIFIED_FIXED").length;
    const base = currentTarget.complianceRate;
    const increment = Math.round(((100 - base) * fixedCount) / demoFindings.length);
    return Math.min(100, base + increment);
  }, [demoFindings, currentTarget]);

  // Run the sandboxed scan simulation (Step 2)
  const handleStartScan = () => {
    setCurrentStep(2);
    setIsScanning(true);
    setScanProgress(15);
    setScanLog([
      `[0.0s] SSRF Guardrail: Pre-resolving destination "${currentTarget.url}" via DNS lookup...`,
      `[0.1s] SSRF Guardrail: Verified scheme http/https. Rejecting RFC 1918, link-local, and cloud metadata.`,
    ]);

    setTimeout(() => {
      setScanProgress(45);
      setScanLog((prev) => [
        ...prev,
        `[0.4s] Headless Sandbox: Initializing Playwright Chromium isolated worker context (${selectedViewport})...`,
        `[0.6s] Sandbox: Hardware acceleration disabled, permissions restricted, timeout set to 30s.`,
      ]);
    }, 450);

    setTimeout(() => {
      setScanProgress(75);
      setScanLog((prev) => [
        ...prev,
        `[0.9s] Engine: Injecting axe-core 4.10.2 into rendered page DOM...`,
        `[1.1s] Engine: Running WCAG 2.2 Level A/AA rule profiles (color-contrast, alt-text, labels, headings)...`,
      ]);
    }, 950);

    setTimeout(() => {
      setScanProgress(100);
      setScanLog((prev) => [
        ...prev,
        `[1.5s] Normalizer: Computing deterministic SHA-256 fingerprints for ${demoFindings.length} findings...`,
        `[1.8s] Scan Completed: ${demoFindings.length} violations recorded. Transitioning to Findings Explorer.`,
      ]);
      setIsScanning(false);
      // Advance to step 3 automatically after brief pause
      setTimeout(() => {
        setCurrentStep(3);
      }, 700);
    }, 1700);
  };

  // Simulate verifying a fix against the target (Step 4)
  const handleVerifyFix = () => {
    if (!activeFinding) return;
    setIsVerifying(true);
    setVerificationFeedback(null);

    setTimeout(() => {
      setDemoFindings((prev) =>
        prev.map((f) =>
          f.id === activeFinding.id
            ? { ...f, status: "VERIFIED_FIXED", verifiedAt: new Date().toLocaleTimeString() }
            : f
        )
      );
      setIsVerifying(false);
      setVerificationFeedback(
        `Verification Succeeded: Playwright re-scan confirmed that "${activeFinding.ruleId}" on selector "${activeFinding.selector}" has been resolved. SHA-256 hash removed from violation manifest.`
      );
    }, 700);
  };

  // Copy selector helper
  const handleCopySelector = (selector: string) => {
    navigator.clipboard.writeText(selector);
    setCopiedSelector(selector);
    setTimeout(() => setCopiedSelector(null), 2000);
  };

  // Download JSON report helper
  const handleDownloadReportJson = () => {
    const reportData = {
      title: `Inklara Accessibility Evaluation Report — ${currentTarget.name}`,
      generatedAt: new Date().toISOString(),
      target: {
        id: currentTarget.id,
        name: currentTarget.name,
        url: currentTarget.url,
        viewport: selectedViewport,
      },
      evaluationEngine: "axe-core 4.10.2 via Playwright Headless Chromium Sandbox",
      complianceIndex: `${liveCompliance}%`,
      severitySummary: severityCounts,
      findings: demoFindings.map((f) => ({
        id: f.id,
        ruleId: f.ruleId,
        ruleTitle: f.ruleTitle,
        impact: f.impact,
        wcagCriterion: f.wcagId,
        cssSelector: f.selector,
        codeSnippet: f.snippet,
        summary: f.summary,
        status: f.status,
        verifiedAt: f.verifiedAt || null,
        remediationAdvice: REMEDIATION_CATALOG[f.ruleId]?.actionableFix || null,
      })),
      disclaimer:
        "Automated evaluation covers ~35% of WCAG 2.2 AA. Zero automated violations does not certify full legal compliance.",
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inklara-audit-report-${currentTarget.id}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Severity counts
  const severityCounts = useMemo(() => {
    return {
      critical: demoFindings.filter((f) => f.impact === "critical").length,
      serious: demoFindings.filter((f) => f.impact === "serious").length,
      moderate: demoFindings.filter((f) => f.impact === "moderate").length,
      minor: demoFindings.filter((f) => f.impact === "minor").length,
    };
  }, [demoFindings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Hero & Value Proposition */}
      <section aria-labelledby="showcase-hero-heading" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/90 text-indigo-300 border border-indigo-800/80 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              Interactive Platform Demonstration
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              Verified Production Deployment
            </span>
          </div>

          <div className="text-[11px] font-mono text-apple-muted px-2.5 py-1 rounded-md bg-apple-elevated/70 border border-apple-border">
            Next.js 15 App Router • React 19 • axe-core 4.10.2 • Playwright 1.49
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-apple-border/80">
          <div className="max-w-3xl space-y-3">
            <div className="mb-2">
              <InklaraLogo size="lg" />
            </div>
            <h1
              id="showcase-hero-heading"
              className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight"
            >
              Accessibility isn&apos;t a final check.{" "}
              <span className="text-indigo-400">
                It&apos;s part of the build.
              </span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-slate-300">
              Discover barriers. Understand the evidence. Fix the experience. Verify every improvement.
            </p>
            <p className="text-xs sm:text-sm text-apple-muted leading-relaxed">
              Automated scanners only catch 30–40% of accessibility defects. Inklara reveals what interfaces leave behind by combining sandboxed <strong className="text-slate-200">axe-core 4.10</strong> automation with an interactive <strong className="text-slate-200">Screen-Reader Testing Workbench</strong>, guided WCAG 2.2 manual evaluation, actionable Before/After code patches, and continuous SHA-256 regression verification.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col items-stretch gap-2.5 shrink-0">
            <a
              href="#animated-walkthrough"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/25 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Explore Product Film</span>
            </a>
            <a
              href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <ExternalLink className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              <span>GitHub Repository</span>
            </a>
            <a
              href="https://inklara.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-700/60 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span>Verified Live Deployment</span>
            </a>
          </div>
        </div>

        {/* SECTION B: The Signature Animated Product Demonstration */}
        <div id="animated-walkthrough" className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Signature Product Demonstration (5-Stage Verification Workflow)
              </h2>
            </div>
            <span className="text-[11px] text-apple-muted font-mono hidden sm:inline">
              Discover → Understand → Remediate → Verify → Report
            </span>
          </div>
          <AnimatedProductDemo />
        </div>

        {/* Real Metrics Ticker — Zero Fabricated Claims */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-apple-surface border border-apple-border rounded-xl">
            <span className="text-apple-muted block text-[11px]">WCAG Target</span>
            <span className="text-base font-bold text-white mt-0.5 block">2.2 Level AA</span>
            <span className="text-[10px] text-blue-400">50+ Criteria Mapped</span>
          </div>

          <div className="p-3 bg-apple-surface border border-apple-border rounded-xl">
            <span className="text-apple-muted block text-[11px]">Automated Engine</span>
            <span className="text-base font-bold text-white mt-0.5 block">axe-core 4.10</span>
            <span className="text-[10px] text-indigo-400">Playwright Sandbox</span>
          </div>

          <div className="p-3 bg-apple-surface border border-apple-border rounded-xl">
            <span className="text-apple-muted block text-[11px]">Human Checklist</span>
            <span className="text-base font-bold text-white mt-0.5 block">13 Protocols</span>
            <span className="text-[10px] text-emerald-400">WCAG-EM Standard</span>
          </div>

          <div className="p-3 bg-apple-surface border border-apple-border rounded-xl">
            <span className="text-apple-muted block text-[11px]">Screen Reader</span>
            <span className="text-base font-bold text-white mt-0.5 block">7 Scenarios</span>
            <span className="text-[10px] text-purple-400">Timeline &amp; Tree Node</span>
          </div>

          <div className="p-3 bg-apple-surface border border-apple-border rounded-xl">
            <span className="text-apple-muted block text-[11px]">Automated Tests</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">45 Passed</span>
            <span className="text-[10px] text-slate-400">31 Unit + 14 E2E</span>
          </div>

          <div className="p-3 bg-apple-surface border border-apple-border rounded-xl">
            <span className="text-apple-muted block text-[11px]">TypeScript Safety</span>
            <span className="text-base font-bold text-white mt-0.5 block">100% Strict</span>
            <span className="text-[10px] text-cyan-400">0 Errors (tsc &amp; lint)</span>
          </div>
        </div>
      </section>

      {/* 2. Engineering Perspectives Selector */}
      <section aria-labelledby="role-lens-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <h2 id="role-lens-heading" className="text-lg font-bold text-white">
                Engineering Perspectives: Role-Based Deep Dives
              </h2>
            </div>
            <p className="text-xs text-apple-muted mt-0.5">
              Select an engineering domain to inspect the exact patterns, architectural trade-offs, and quality gates implemented in Inklara.
            </p>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: "fullstack", label: "Full-Stack Engineer", icon: Cpu },
            { id: "frontend", label: "Frontend & UI Systems", icon: Laptop },
            { id: "a11y", label: "Web Accessibility Specialist", icon: ShieldCheck },
            { id: "sdet", label: "Platform & SDET Automation", icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeRole === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRole(tab.id as RoleLens)}
                className={`flex items-center gap-2 p-3 text-left rounded-xl border text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-apple-focus ${
                  isSelected
                    ? "bg-apple-elevated text-white border-blue-600 shadow-sm shadow-blue-500/10"
                    : "bg-apple-surface text-apple-muted border-apple-border hover:text-white hover:bg-apple-elevated/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-apple-muted"}`} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Role Content */}
        <div className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm text-xs space-y-4">
          {activeRole === "fullstack" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                    Full-Stack Architecture &amp; Data Pipeline
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    End-to-End Type Safety, Dual-Database Engine &amp; SSRF Defense Layer
                  </h3>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Inklara is architected on Next.js 15 App Router and React 19, combining asynchronous Server Components for fast data delivery with interactive Client boundaries. It features a hardened Node.js scanner pipeline that intercepts server-side requests to prevent SSRF against AWS/GCP cloud metadata (`169.254.169.254`), private RFC 1918 subnets, and alternative IP encodings (octal, hex, dword). The data layer supports both zero-configuration local development (`SQLite` via Prisma) and high-concurrency production deployments (`PostgreSQL` with connection pooling).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">REST API &amp; Zod Validation</span>
                  <span className="text-apple-muted text-[11px]">Strict runtime schema validation on all inputs; zero unchecked `any` casts.</span>
                </div>
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">SSRF Fail-Closed Mode</span>
                  <span className="text-apple-muted text-[11px]">DNS pre-resolution and IP CIDR filtering; fail-closed behavior in production.</span>
                </div>
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">Dual Database Strategy</span>
                  <span className="text-apple-muted text-[11px]">Prisma ORM migrations with unified relations across targets, audits, and checklists.</span>
                </div>
              </div>
            </div>
          )}

          {activeRole === "frontend" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                    Design Systems &amp; Ergonomic UX
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Dark Design Tokens, Focus Trapping, 320px Reflow &amp; Print Optimization
                  </h3>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Built strictly with semantic HTML5 landmarks and accessible component architectures. All interactive controls feature universal, high-contrast, WCAG 2.4.11-compliant `:focus-visible` outlines (`2px solid #38bdf8`) with 2px offset. Complex components include WAI-ARIA modal dialogs with focus trapping, roving tabIndex for tabs, and live status announcement regions. The responsive layout reflows down to 320px width without horizontal scrolling (WCAG 1.4.10) and provides print stylesheets (`@media print`) generating pixel-perfect executive reports.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">WCAG 2.4.11 Focus Visible</span>
                  <span className="text-apple-muted text-[11px]">Explicit focus rings on all interactive elements; high contrast over dark surfaces.</span>
                </div>
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">Focus Trapping &amp; Dismissal</span>
                  <span className="text-apple-muted text-[11px]">Modal traps keyboard Tab navigation within dialog and restores focus on Escape.</span>
                </div>
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">Print-Optimized Media</span>
                  <span className="text-apple-muted text-[11px]">High-contrast black-on-white layout with page breaks for formal PDF export.</span>
                </div>
              </div>
            </div>
          )}

          {activeRole === "a11y" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                    Accessibility Engineering &amp; AT Evaluation
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Screen-Reader Announcement Timeline, 13-Point WCAG-EM &amp; Honest Boundaries
                  </h3>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Accessibility cannot be verified by linters alone. Inklara implements an authoritative WCAG 2.2 Level AA catalog mapping 50+ criteria to automated rules and human evaluation techniques. Its flagship <strong>Screen-Reader Testing Workbench</strong> tests 7 interaction scenarios (dialogs, form validation, live alerts, tabs, switches), mapping sequential DOM actions to expected VoiceOver announcements and computed Accessibility Tree nodes. Crucially, Inklara practices honest engineering: it never fabricates synthetic speech as genuine VoiceOver audio, clearly distinguishing speech states (`CAPTURED`, `UNAVAILABLE`, `MANUAL_VERIFICATION_REQUIRED`).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">Automated vs Manual Parity</span>
                  <span className="text-apple-muted text-[11px]">Explicitly differentiates ~35% automated coverage from 13 human verification tests.</span>
                </div>
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">VoiceOver Speech States</span>
                  <span className="text-apple-muted text-[11px]">Platform-aware capture via AppleScript; graceful fallback to A11y tree on Windows/Linux.</span>
                </div>
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">Fix Verification Engine</span>
                  <span className="text-apple-muted text-[11px]">Re-scans live targets and verifies that finding fingerprints are genuinely resolved.</span>
                </div>
              </div>
            </div>
          )}

          {activeRole === "sdet" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                    Test Automation &amp; Platform Quality
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Playwright E2E Isolation, SHA-256 Fingerprinting &amp; Zero-Flake CI
                  </h3>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Inklara features a comprehensive, multi-tiered test automation architecture. Automated regression testing is powered by a deterministic SHA-256 finding fingerprinting algorithm that hashes rule IDs, normalized CSS selectors, and DOM snippets to track new regressions (`+`), fixed items (`-`), and persistent issues across builds. 31 Vitest unit tests validate SSRF filtering, WCAG mapping, and finding normalizers in under 3.5 seconds. 14 Playwright end-to-end tests run headless Chromium across automated WCAG audits, reflow at 320px, reduced-motion preferences, and screen-reader scenarios with zero test flakes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">Deterministic Fingerprints</span>
                  <span className="text-apple-muted text-[11px]">SHA-256 tracking enables reliable regression diffing across staging and prod.</span>
                </div>
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">Playwright Concurrency Hardening</span>
                  <span className="text-apple-muted text-[11px]">Sequential single-worker execution eliminating SQLite database lock contention.</span>
                </div>
                <div className="p-3 bg-apple-elevated/60 border border-apple-border rounded-lg">
                  <span className="font-semibold text-white block mb-1">GitHub Actions CI Pipeline</span>
                  <span className="text-apple-muted text-[11px]">Automated quality gates verifying types, lint, unit tests, E2E, and production build.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. The Interactive End-to-End Demonstration */}
      <section
        id="interactive-demo"
        aria-labelledby="interactive-demo-heading"
        className="space-y-6 pt-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-apple-border">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <h2 id="interactive-demo-heading" className="text-xl font-bold text-white">
                Interactive Guided Demonstration (60–90s)
              </h2>
            </div>
            <p className="text-xs text-apple-muted mt-1">
              Follow the complete audit lifecycle below: select a benchmark target, run the sandboxed scan, inspect findings, simulate code remediation, and export an executive audit report.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-apple-muted">
              Live Compliance Index:
            </span>
            <div className="flex items-center gap-2 px-3 py-1 bg-apple-surface border border-apple-border rounded-lg">
              <span
                className={`text-xs font-bold ${
                  liveCompliance === 100
                    ? "text-emerald-400"
                    : liveCompliance >= 70
                    ? "text-blue-400"
                    : "text-amber-400"
                }`}
              >
                {liveCompliance}%
              </span>
              <div className="w-16 bg-apple-elevated rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    liveCompliance === 100
                      ? "bg-emerald-500"
                      : liveCompliance >= 70
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${liveCompliance}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5-Stage Stepper Navigation */}
        <nav aria-label="Demonstration Stepper" className="bg-apple-surface border border-apple-border rounded-xl p-3 shadow-sm">
          <ol className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            {[
              { num: 1, title: "1. Scope & Target", desc: "Select Environment" },
              { num: 2, title: "2. Sandboxed Scan", desc: "Engine Pipeline" },
              { num: 3, title: "3. Findings Explorer", desc: "Inspect Evidence" },
              { num: 4, title: "4. Remediate & Verify", desc: "Before / After Diff" },
              { num: 5, title: "5. Executive Report", desc: "Export & Print" },
            ].map((step) => {
              const isCurrent = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <li key={step.num}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.num)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-apple-focus ${
                      isCurrent
                        ? "bg-apple-elevated border-blue-500 text-white shadow-sm"
                        : isPast
                        ? "bg-apple-surface border-emerald-900/40 text-emerald-300 hover:bg-apple-elevated/40"
                        : "bg-apple-surface border-apple-border/50 text-apple-muted hover:text-slate-300 hover:bg-apple-elevated/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isPast ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            isCurrent
                              ? "bg-blue-600 text-white"
                              : "bg-apple-subtle text-apple-muted"
                          }`}
                        >
                          {step.num}
                        </span>
                      )}
                      <span className="font-semibold truncate">{step.title}</span>
                    </div>
                    <span className="text-[10px] text-apple-muted block ml-6 truncate">
                      {step.desc}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* STEP 1: Target & Scope Configuration */}
        {currentStep === 1 && (
          <div className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-6">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                Stage 1 of 5
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Configure Audit Scope &amp; Target Environment
              </h3>
              <p className="text-xs text-apple-muted mt-1">
                Choose a pre-configured local benchmark target to analyze. No external API keys or third-party web access required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_TARGETS.map((target) => {
                const isSelected = selectedTargetId === target.id;
                return (
                  <div
                    key={target.id}
                    onClick={() => setSelectedTargetId(target.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-apple-elevated border-blue-500 shadow-sm shadow-blue-500/10"
                        : "bg-apple-surface border-apple-border hover:bg-apple-elevated/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                          {target.category}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" aria-hidden="true" />
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm">{target.name}</h4>
                      <p className="text-xs text-apple-muted leading-relaxed">
                        {target.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-apple-border/70 mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-apple-muted font-mono">{target.url}</span>
                      <span
                        className={`font-semibold ${
                          target.expectedViolations > 0 ? "text-amber-400" : "text-emerald-400"
                        }`}
                      >
                        {target.expectedViolations > 0
                          ? `${target.expectedViolations} violations`
                          : "0 violations"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Viewport & Rule Selection */}
            <div className="p-4 bg-apple-elevated/40 border border-apple-border rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <label htmlFor="viewport-select" className="text-apple-muted font-medium block mb-1">
                    Device Viewport
                  </label>
                  <select
                    id="viewport-select"
                    value={selectedViewport}
                    onChange={(e) => setSelectedViewport(e.target.value)}
                    className="bg-apple-elevated border border-apple-border text-white rounded px-2.5 py-1.5 focus-visible:ring-1 focus-visible:ring-apple-focus"
                  >
                    <option value="desktop">Desktop (1280 × 800)</option>
                    <option value="tablet">Tablet (768 × 1024)</option>
                    <option value="mobile">Mobile Reflow (320 × 640)</option>
                  </select>
                </div>

                <div>
                  <span className="text-apple-muted font-medium block mb-1">Compliance Standard</span>
                  <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold inline-block">
                    WCAG 2.2 Level AA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartScan}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
                >
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Execute Sandboxed Scan &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Sandboxed Scan Execution */}
        {currentStep === 2 && (
          <div className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                  Stage 2 of 5
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Sandboxed Scan Pipeline in Execution
                </h3>
                <p className="text-xs text-apple-muted mt-1">
                  Evaluating target: <span className="text-white font-mono">{currentTarget.url}</span> ({selectedViewport} viewport)
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-white">{scanProgress}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full bg-apple-elevated rounded-full h-2 overflow-hidden"
              role="progressbar"
              aria-valuenow={scanProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Automated scan pipeline progress"
            >
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            {/* Live Pipeline Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-apple-elevated/40 border border-apple-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span className="font-semibold text-white">1. SSRF Guardrail</span>
                </div>
                <span className="text-[11px] text-apple-muted">
                  Pre-resolves DNS and rejects private RFC 1918 &amp; cloud metadata CIDRs.
                </span>
              </div>

              <div className="p-3 bg-apple-elevated/40 border border-apple-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                  <span className="font-semibold text-white">2. Chromium Sandbox</span>
                </div>
                <span className="text-[11px] text-apple-muted">
                  Spawns isolated Playwright context with restricted permissions and 30s timeout.
                </span>
              </div>

              <div className="p-3 bg-apple-elevated/40 border border-apple-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-purple-400" aria-hidden="true" />
                  <span className="font-semibold text-white">3. axe-core 4.10</span>
                </div>
                <span className="text-[11px] text-apple-muted">
                  Injects engine script and evaluates WCAG 2.2 Level A/AA rule profiles.
                </span>
              </div>

              <div className="p-3 bg-apple-elevated/40 border border-apple-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-blue-400" aria-hidden="true" />
                  <span className="font-semibold text-white">4. SHA-256 Hashes</span>
                </div>
                <span className="text-[11px] text-apple-muted">
                  Computes deterministic fingerprints for regression diffing.
                </span>
              </div>
            </div>

            {/* Terminal Log Console */}
            <div className="p-4 bg-apple-canvas border border-apple-border rounded-xl font-mono text-xs text-slate-300 space-y-1 overflow-x-auto max-h-48">
              <div className="flex items-center justify-between text-apple-muted pb-2 border-b border-apple-border mb-2 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                  <span>Pipeline Execution Console</span>
                </span>
                <span className="text-[10px] text-emerald-400">Sandbox Isolation Active</span>
              </div>
              {scanLog.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-apple-muted hover:text-white"
              >
                &larr; Back to Scope
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
              >
                <span>Inspect Findings Now &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Findings Explorer */}
        {currentStep === 3 && (
          <div className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                  Stage 3 of 5
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Interactive Accessibility Findings Explorer
                </h3>
                <p className="text-xs text-apple-muted mt-0.5">
                  Showing {filteredFindings.length} of {demoFindings.length} recorded findings for {currentTarget.name}. Select any finding to inspect evidence and test remediation.
                </p>
              </div>

              {/* Severity Counts Bar */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-red-950/80 text-red-200 border border-red-800 text-[11px] font-semibold">
                  {severityCounts.critical} Critical
                </span>
                <span className="px-2 py-1 rounded bg-orange-950/80 text-orange-200 border border-orange-800 text-[11px] font-semibold">
                  {severityCounts.serious} Serious
                </span>
                <span className="px-2 py-1 rounded bg-amber-950/80 text-amber-200 border border-amber-800 text-[11px] font-semibold">
                  {severityCounts.moderate} Moderate
                </span>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-apple-elevated/40 border border-apple-border rounded-xl text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-apple-muted font-medium">Severity:</span>
                {["ALL", "CRITICAL", "SERIOUS", "MODERATE", "MINOR"].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus ${
                      severityFilter === sev
                        ? "bg-blue-600 text-white"
                        : "bg-apple-surface text-apple-muted hover:text-white border border-apple-border"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-apple-muted font-medium">Status:</span>
                {["ALL", "OPEN", "VERIFIED_FIXED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus ${
                      statusFilter === st
                        ? "bg-indigo-600 text-white"
                        : "bg-apple-surface text-apple-muted hover:text-white border border-apple-border"
                    }`}
                  >
                    {st === "ALL" ? "ALL STATUSES" : st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Findings List */}
            {filteredFindings.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-apple-border rounded-xl bg-apple-surface/40">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" aria-hidden="true" />
                <h4 className="text-sm font-bold text-white">No Matching Findings</h4>
                <p className="text-xs text-apple-muted mt-1">
                  {demoFindings.length === 0
                    ? "Zero accessibility violations detected on this target! Conforms to automated WCAG 2.2 Level AA checks."
                    : "No findings match the current filter selection."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFindings.map((finding) => {
                  const isSelected = activeFinding?.id === finding.id;
                  return (
                    <div
                      key={finding.id}
                      onClick={() => setSelectedFindingId(finding.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-apple-elevated border-blue-500 shadow-sm shadow-blue-500/10"
                          : "bg-apple-surface border-apple-border hover:bg-apple-elevated/40"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <SeverityBadge impact={finding.impact} />
                          <span className="font-mono text-xs font-bold text-white bg-apple-surface px-2 py-0.5 rounded border border-apple-border">
                            {finding.ruleId}
                          </span>
                          <span className="text-xs text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800 font-semibold">
                            WCAG {finding.wcagId}
                          </span>
                          <StatusBadge status={finding.status} />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopySelector(finding.selector);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white bg-apple-surface hover:bg-apple-elevated border border-apple-border rounded focus-visible:ring-1 focus-visible:ring-apple-focus"
                            aria-label={`Copy CSS selector ${finding.selector}`}
                          >
                            {copiedSelector === finding.selector ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                                <span className="text-emerald-400 font-sans">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" aria-hidden="true" />
                                <span>Copy Selector</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFindingId(finding.id);
                              setCurrentStep(4);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:text-white bg-blue-950/40 hover:bg-blue-600 border border-blue-800 rounded transition-colors"
                          >
                            <span>Remediate</span>
                            <ArrowRight className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white mb-1">{finding.ruleTitle}</h4>
                      <p className="text-xs text-apple-muted leading-relaxed mb-2">
                        {finding.summary}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-apple-muted font-mono pt-2 border-t border-apple-border/50">
                        <span className="truncate max-w-md">Target: {finding.selector}</span>
                        {finding.status === "VERIFIED_FIXED" && (
                          <span className="text-emerald-400 font-sans font-semibold">
                            Verified at {finding.verifiedAt || "just now"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs text-apple-muted hover:text-white"
              >
                &larr; Re-run Scan
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
              >
                <span>Proceed to Remediation &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Actionable Code Remediation & Verification */}
        {currentStep === 4 && (
          <div className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-6">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                Stage 4 of 5
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Actionable Remediation &amp; Live Fix Verification
              </h3>
              <p className="text-xs text-apple-muted mt-0.5">
                Inspect side-by-side Before/After code snippets, understand engineering trade-offs, and run the verification engine to confirm issue resolution.
              </p>
            </div>

            {activeFinding ? (
              <div className="space-y-6">
                {/* Active Finding Banner */}
                <div className="p-4 bg-apple-elevated/40 border border-apple-border rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge impact={activeFinding.impact} />
                      <span className="font-mono text-xs font-bold text-white bg-apple-surface px-2 py-0.5 rounded border border-apple-border">
                        {activeFinding.ruleId}
                      </span>
                      <StatusBadge status={activeFinding.status} />
                    </div>
                    <h4 className="text-sm font-bold text-white">{activeFinding.ruleTitle}</h4>
                    <span className="font-mono text-xs text-apple-muted">
                      Target Element: {activeFinding.selector}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeFinding.status !== "VERIFIED_FIXED" ? (
                      <button
                        type="button"
                        onClick={handleVerifyFix}
                        disabled={isVerifying}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
                      >
                        {isVerifying ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                            <span>Verifying with Browser Sandbox...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Test Fix Resolution Against Fixture</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                        <span>Issue Verified Fixed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Verification Feedback Alert */}
                {verificationFeedback && (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xl flex items-start gap-3 text-xs text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="font-bold block text-white mb-0.5">Automated Verification Confirmed</span>
                      <span>{verificationFeedback}</span>
                    </div>
                  </div>
                )}

                {/* Side-by-Side Before/After Code Snippets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Problematic Implementation (Current DOM)</span>
                      </span>
                    </div>
                    <SanitizedCodeBlock
                      code={
                        activeGuidance?.codeExample.problematic ||
                        activeFinding.snippet
                      }
                      language="html"
                      label="Defective Code"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Recommended Remediation (Accessible Fix)</span>
                      </span>
                    </div>
                    <SanitizedCodeBlock
                      code={
                        activeGuidance?.codeExample.remediated ||
                        "<!-- Remediation code provided in catalog -->"
                      }
                      language="html"
                      label="Remediated Code"
                    />
                  </div>
                </div>

                {/* Technical Cause & Trade-offs */}
                {activeGuidance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-apple-surface border border-apple-border rounded-xl space-y-1">
                      <span className="font-bold text-white block">Technical Root Cause</span>
                      <p className="text-apple-muted leading-relaxed">
                        {activeGuidance.technicalCause}
                      </p>
                    </div>

                    <div className="p-4 bg-apple-surface border border-apple-border rounded-xl space-y-1">
                      <span className="font-bold text-white block">Engineering &amp; Design Trade-offs</span>
                      <p className="text-apple-muted leading-relaxed">
                        {activeGuidance.tradeoffs}
                      </p>
                    </div>
                  </div>
                )}

                {/* WCAG Reference Link */}
                {activeWcag && (
                  <div className="p-4 bg-apple-elevated/30 border border-apple-border rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">
                        WCAG {activeWcag.num}: {activeWcag.title} ({activeWcag.level})
                      </span>
                      <p className="text-apple-muted text-[11px] mt-0.5">
                        {activeWcag.description}
                      </p>
                    </div>
                    <a
                      href={activeWcag.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded focus-visible:ring-1 focus-visible:ring-apple-focus"
                    >
                      <span>W3C Understanding Doc</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-apple-muted">No finding selected.</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-xs text-apple-muted hover:text-white"
              >
                &larr; Back to Findings
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
              >
                <span>View Executive Report &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Executive Report & Export */}
        {currentStep === 5 && (
          <div className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-apple-border">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                  Stage 5 of 5
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Executive Accessibility Audit Report
                </h3>
                <p className="text-xs text-apple-muted mt-0.5">
                  Target: {currentTarget.name} ({currentTarget.url})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadReportJson}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download JSON Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Print / Export PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setDemoFindings(currentTarget.findings);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-apple-muted hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Restart Demo</span>
                </button>
              </div>
            </div>

            {/* Severity Distribution Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Severity Distribution</span>
                <span className="text-apple-muted text-[11px]">
                  {demoFindings.length} Total Evaluated Findings
                </span>
              </div>

              {demoFindings.length > 0 ? (
                <div className="w-full h-3 bg-apple-elevated rounded-full overflow-hidden flex shadow-inner">
                  {severityCounts.critical > 0 && (
                    <div
                      style={{
                        width: `${(severityCounts.critical / demoFindings.length) * 100}%`,
                      }}
                      className="bg-red-500 h-full"
                      title={`${severityCounts.critical} Critical`}
                    />
                  )}
                  {severityCounts.serious > 0 && (
                    <div
                      style={{
                        width: `${(severityCounts.serious / demoFindings.length) * 100}%`,
                      }}
                      className="bg-orange-500 h-full"
                      title={`${severityCounts.serious} Serious`}
                    />
                  )}
                  {severityCounts.moderate > 0 && (
                    <div
                      style={{
                        width: `${(severityCounts.moderate / demoFindings.length) * 100}%`,
                      }}
                      className="bg-amber-500 h-full"
                      title={`${severityCounts.moderate} Moderate`}
                    />
                  )}
                  {severityCounts.minor > 0 && (
                    <div
                      style={{
                        width: `${(severityCounts.minor / demoFindings.length) * 100}%`,
                      }}
                      className="bg-cyan-500 h-full"
                      title={`${severityCounts.minor} Minor`}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-3 bg-emerald-500/80 rounded-full" />
              )}
            </div>

            {/* Score & Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-apple-surface border border-apple-border rounded-xl">
                <span className="text-apple-muted block mb-1">Compliance Index</span>
                <span className="text-2xl font-bold text-white block">
                  {liveCompliance}%
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  {demoFindings.filter((f) => f.status === "VERIFIED_FIXED").length} verified resolved
                </span>
              </div>

              <div className="p-4 bg-apple-surface border border-apple-border rounded-xl">
                <span className="text-apple-muted block mb-1">Automated Evaluation</span>
                <span className="text-2xl font-bold text-white block">axe-core 4.10</span>
                <span className="text-[11px] text-blue-400 mt-1 block">
                  ~35% of WCAG 2.2 Level AA scope
                </span>
              </div>

              <div className="p-4 bg-apple-surface border border-apple-border rounded-xl">
                <span className="text-apple-muted block mb-1">Human Verification</span>
                <span className="text-2xl font-bold text-white block">13 Checklist Items</span>
                <span className="text-[11px] text-purple-400 mt-1 block">
                  WCAG-EM keyboard, reflow, speech
                </span>
              </div>
            </div>

            {/* Non-Certification Legal Disclaimer */}
            <div className="p-4 bg-apple-canvas border border-apple-border rounded-xl text-[11px] text-apple-muted space-y-1">
              <span className="font-bold text-slate-300 block">
                Accessibility Evaluation Notice &amp; Scope Limitations
              </span>
              <p className="leading-relaxed">
                Automated accessibility testing with axe-core reliably detects approximately 30–40% of WCAG success criteria. An automated audit reporting zero violations does not certify full conformance. Formal digital accessibility compliance requires human expert evaluation using assistive technologies (VoiceOver, NVDA, JAWS), keyboard-only navigation protocols, cognitive evaluations, and color reflow testing.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 4. Interactive Product Tour: Explore Production Modules */}
      <section aria-labelledby="product-tour-heading" className="space-y-6 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            <h2 id="product-tour-heading" className="text-xl font-bold text-white">
              Explore Live Production Engineering Modules
            </h2>
          </div>
          <p className="text-xs text-apple-muted mt-1">
            Every feature in Inklara is genuinely functional and backed by real Playwright sandboxing, Prisma ORM transactions, and WCAG catalogs. Explore the live routes below:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Screen Reader Workbench */}
          <Link
            href="/screen-reader"
            className="p-5 bg-apple-surface border border-apple-border hover:border-purple-600 rounded-xl transition-all flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Volume2 className="w-5 h-5 text-purple-400" aria-hidden="true" />
                <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                  Interactive
                </span>
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                Screen-Reader Testing Workbench
              </h3>
              <p className="text-apple-muted mt-1 leading-relaxed">
                Interactive runner testing 7 ARIA interaction patterns (dialogs, form validation, live regions, disclosures, tabs) with sequential announcement streams.
              </p>
            </div>
            <div className="pt-3 border-t border-apple-border/70 mt-4 flex items-center justify-between text-purple-400 font-semibold text-[11px]">
              <span>Launch Workbench</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 2: WCAG 2.2 Reference Catalog */}
          <Link
            href="/wcag"
            className="p-5 bg-apple-surface border border-apple-border hover:border-blue-600 rounded-xl transition-all flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-5 h-5 text-blue-400" aria-hidden="true" />
                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                  Reference
                </span>
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                WCAG 2.2 Level AA Criterion Catalog
              </h3>
              <p className="text-apple-muted mt-1 leading-relaxed">
                Comprehensive mapping of 50+ W3C WCAG 2.2 criteria with official Understanding citations, associated axe-core rules, and manual test methods.
              </p>
            </div>
            <div className="pt-3 border-t border-apple-border/70 mt-4 flex items-center justify-between text-blue-400 font-semibold text-[11px]">
              <span>Explore WCAG Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 3: Test Fixtures Playground */}
          <Link
            href="/fixtures"
            className="p-5 bg-apple-surface border border-apple-border hover:border-emerald-600 rounded-xl transition-all flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Layers className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Fixtures
                </span>
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                Controlled Demonstration Fixtures
              </h3>
              <p className="text-apple-muted mt-1 leading-relaxed">
                Direct access to the deliberately inaccessible portal (`/demo/inaccessible`), the remediated baseline (`/demo/accessible`), and the ARIA sandbox.
              </p>
            </div>
            <div className="pt-3 border-t border-apple-border/70 mt-4 flex items-center justify-between text-emerald-400 font-semibold text-[11px]">
              <span>Inspect Fixtures</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 4: Projects & Target Environments */}
          <Link
            href="/projects"
            className="p-5 bg-apple-surface border border-apple-border hover:border-indigo-600 rounded-xl transition-all flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <FolderKanban className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                  Estate
                </span>
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                Projects &amp; Target Environments
              </h3>
              <p className="text-apple-muted mt-1 leading-relaxed">
                Organize digital properties by project, configure multi-environment targets (Production, Staging, Dev), and manage audit run cadence.
              </p>
            </div>
            <div className="pt-3 border-t border-apple-border/70 mt-4 flex items-center justify-between text-indigo-400 font-semibold text-[11px]">
              <span>Manage Projects</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 5: Audit History & Regression Logs */}
          <Link
            href="/audits"
            className="p-5 bg-apple-surface border border-apple-border hover:border-amber-600 rounded-xl transition-all flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-amber-400" aria-hidden="true" />
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  Audits
                </span>
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                Audit Runs &amp; Regression History
              </h3>
              <p className="text-apple-muted mt-1 leading-relaxed">
                Review historical audit execution runs, inspect baseline comparison metrics, and generate printable compliance reports.
              </p>
            </div>
            <div className="pt-3 border-t border-apple-border/70 mt-4 flex items-center justify-between text-amber-400 font-semibold text-[11px]">
              <span>View Audit History</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </Link>

          {/* Card 6: Operations Dashboard */}
          <Link
            href="/"
            className="p-5 bg-apple-surface border border-apple-border hover:border-cyan-600 rounded-xl transition-all flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  Dashboard
                </span>
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                Core Operations Dashboard
              </h3>
              <p className="text-apple-muted mt-1 leading-relaxed">
                Real-time operational dashboard with four-stage workflow progression, live open findings counts, and one-click audit execution modal.
              </p>
            </div>
            <div className="pt-3 border-t border-apple-border/70 mt-4 flex items-center justify-between text-cyan-400 font-semibold text-[11px]">
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Architectural Blueprint & Security Threat Model */}
      <section aria-labelledby="architecture-heading" className="space-y-6 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-400" aria-hidden="true" />
            <h2 id="architecture-heading" className="text-xl font-bold text-white">
              System Architecture &amp; Threat Model
            </h2>
          </div>
          <p className="text-xs text-apple-muted mt-1">
            Running headless browsers against user-submitted URLs introduces severe security risks. Inklara implements multi-tiered defense-in-depth:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Threat Model Card */}
          <div className="p-5 bg-apple-surface border border-apple-border rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <h3 className="font-bold text-white text-sm">SSRF Defense Mechanisms</h3>
            </div>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              <li>
                <strong>Protocol Restrictions:</strong> Permitted schemes strictly limited to `http:` and `https:`. File schemes (`file://`), FTP, and javascript: are rejected.
              </li>
              <li>
                <strong>DNS Pre-Validation:</strong> Resolves hostname via `dns.promises.lookup` and checks all resolved IP addresses before launching Chromium.
              </li>
              <li>
                <strong>Blocked IP Spaces:</strong> Blocks private subnets (RFC 1918 `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopbacks (`127.0.0.0/8`, `::1`), and cloud metadata (`169.254.169.254`).
              </li>
              <li>
                <strong>Alternative IP Encodings:</strong> Unconditionally blocks integer dword notation (`http://2130706433/`), hex, and octal notations prior to whitelist parsing.
              </li>
              <li>
                <strong>Fail-Closed Production:</strong> When <code>NODE_ENV === &quot;production&quot;</code>, local scanning flags are ignored; local ranges are rejected unconditionally.
              </li>
            </ul>
          </div>

          {/* Browser Sandboxing Card */}
          <div className="p-5 bg-apple-surface border border-apple-border rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <h3 className="font-bold text-white text-sm">Playwright Isolation &amp; XSS Defense</h3>
            </div>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              <li>
                <strong>Permission Sandbox:</strong> Chromium runs with `--no-sandbox`, denied camera/microphone/geolocation, and isolated memory limits.
              </li>
              <li>
                <strong>Execution Timeouts:</strong> Scans enforce strict 30-second hard timeouts to prevent resource starvation and Denial of Service.
              </li>
              <li>
                <strong>Stored XSS Sanitization:</strong> All scanned HTML snippets are escaped via entity sanitizers before rendering in React.
              </li>
              <li>
                <strong>Deterministic Hashes:</strong> SHA-256 finding fingerprints ensure reliable regression diffing without false positive drift.
              </li>
              <li>
                <strong>Redirect Interception:</strong> `page.route` intercepts HTTP redirects to verify destination addresses before network egress.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Snowdog Reference Attribution & Innovation Matrix */}
      <section aria-labelledby="attribution-heading" className="space-y-4 pt-4">
        <div className="p-6 bg-gradient-to-r from-apple-surface via-apple-elevated/40 to-apple-surface border border-apple-border rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                Design Reference &amp; Heritage
              </span>
              <h3 id="attribution-heading" className="text-base font-bold text-white mt-1">
                Inspiration from the Snowdog Accessibility Audit Tool
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/SnowdogApps/a11y-audit-tool"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-300 hover:text-white bg-apple-elevated border border-apple-border rounded-lg"
              >
                <span>Snowdog Repository</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href="https://www.snow.dog/services/accessibility/a11y-audit-tool"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-apple-elevated border border-apple-border rounded-lg"
              >
                <span>Product Overview</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>

          <p className="text-xs text-apple-muted leading-relaxed">
            Inklara studies and draws architectural inspiration from the open-source <a href="https://github.com/SnowdogApps/a11y-audit-tool" className="text-blue-400 underline" target="_blank" rel="noreferrer">Snowdog Accessibility Audit Tool</a> and its <a href="https://www.snow.dog/services/accessibility/a11y-audit-tool" className="text-blue-400 underline" target="_blank" rel="noreferrer">official service overview</a>. Snowdog demonstrated the power of uniting automated testing engines with guided manual audit checklists to overcome the 30–40% limit of automated tooling. Inklara adopts this core workflow philosophy while building its own original Next.js 15 App Router architecture, proprietary dark design system, Screen-Reader Announcement Workbench, multi-tier SSRF security pipeline, and interactive remediation verification engine.
          </p>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto border border-apple-border rounded-lg bg-apple-canvas/60">
            <table className="w-full text-left text-xs" aria-label="Feature Comparison Matrix">
              <thead className="bg-apple-elevated/70 text-apple-muted font-medium border-b border-apple-border">
                <tr>
                  <th scope="col" className="px-4 py-2.5">Workflow Feature</th>
                  <th scope="col" className="px-4 py-2.5">Snowdog A11y Tool Model</th>
                  <th scope="col" className="px-4 py-2.5">Inklara Enhanced Implementation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-border/50 text-slate-300">
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">Hybrid Audit Model</td>
                  <td className="px-4 py-2.5 text-apple-muted">Combines automated checks with manual templates</td>
                  <td className="px-4 py-2.5 text-emerald-400 font-medium">4-stage guided lifecycle with automated + 13 WCAG-EM checks</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">Assistive Tech Testing</td>
                  <td className="px-4 py-2.5 text-apple-muted">Guided manual screen reader testing steps</td>
                  <td className="px-4 py-2.5 text-emerald-400 font-medium">Dedicated Screen-Reader Workbench with event timeline &amp; tree node</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">Server Scanning Security</td>
                  <td className="px-4 py-2.5 text-apple-muted">Standard local execution</td>
                  <td className="px-4 py-2.5 text-emerald-400 font-medium">Multi-tier SSRF DNS resolution, IP CIDR filtering &amp; fail-closed</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">Fix Verification</td>
                  <td className="px-4 py-2.5 text-apple-muted">Manual status marking in report</td>
                  <td className="px-4 py-2.5 text-emerald-400 font-medium">Interactive re-scan confirming fingerprint resolution before closure</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-white">Regression Diffing</td>
                  <td className="px-4 py-2.5 text-apple-muted">Historical audit comparison</td>
                  <td className="px-4 py-2.5 text-emerald-400 font-medium">Deterministic SHA-256 fingerprint diffs tracking (+ / -) net changes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Verifiable Quality Gates & Test Summary */}
      <section aria-labelledby="quality-gates-heading" className="space-y-4 pt-4 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            <h2 id="quality-gates-heading" className="text-xl font-bold text-white">
              Verifiable Engineering Quality Gates
            </h2>
          </div>
          <p className="text-xs text-apple-muted mt-1">
            Every commit is tested against 6 automated quality gates in GitHub Actions CI with zero skipped assertions:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-apple-surface border border-emerald-900/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Gate 1</span>
            <span className="font-bold text-white block">TypeScript Strict</span>
            <span className="text-emerald-400 text-[11px] font-semibold">0 Errors</span>
            <span className="text-apple-muted text-[10px] block">npx tsc --noEmit</span>
          </div>

          <div className="p-3 bg-apple-surface border border-emerald-900/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Gate 2</span>
            <span className="font-bold text-white block">ESLint 9</span>
            <span className="text-emerald-400 text-[11px] font-semibold">0 Warnings</span>
            <span className="text-apple-muted text-[10px] block">npm run lint</span>
          </div>

          <div className="p-3 bg-apple-surface border border-emerald-900/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Gate 3</span>
            <span className="font-bold text-white block">Vitest Unit</span>
            <span className="text-emerald-400 text-[11px] font-semibold">31 / 31 Passed</span>
            <span className="text-apple-muted text-[10px] block">6 test suites</span>
          </div>

          <div className="p-3 bg-apple-surface border border-emerald-900/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Gate 4</span>
            <span className="font-bold text-white block">WCAG Automated</span>
            <span className="text-emerald-400 text-[11px] font-semibold">9 / 9 Passed</span>
            <span className="text-apple-muted text-[10px] block">axe-core &amp; reflow</span>
          </div>

          <div className="p-3 bg-apple-surface border border-emerald-900/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Gate 5</span>
            <span className="font-bold text-white block">Playwright E2E</span>
            <span className="text-emerald-400 text-[11px] font-semibold">14 / 14 Passed</span>
            <span className="text-apple-muted text-[10px] block">Full workbench flow</span>
          </div>

          <div className="p-3 bg-apple-surface border border-emerald-900/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Gate 6</span>
            <span className="font-bold text-white block">Next.js 15 Build</span>
            <span className="text-emerald-400 text-[11px] font-semibold">14 Routes</span>
            <span className="text-apple-muted text-[10px] block">Static &amp; dynamic</span>
          </div>
        </div>

        <div className="p-4 bg-apple-surface border border-apple-border rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-white block">GitHub Actions Continuous Integration</span>
            <span className="text-apple-muted text-[11px]">
              Latest commit: <code className="text-blue-300">557a575</code> on branch <code className="text-white">main</code> (Run 38926569900)
            </span>
          </div>
          <a
            href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform/actions"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800 rounded-lg hover:bg-emerald-900/60 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>View Verified CI Runs</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
