"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { InklaraLogo } from "@/components/brand/InklaraLogo";
import { InklaraSymbol } from "@/components/brand/InklaraSymbol";
import {
  ExternalLink,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Layers,
  Code2,
  Terminal,
  Cpu,
  Monitor,
  Tablet,
  Smartphone,
  FileCheck2,
  FileText,
  Send,
  Users,
  Check,
  GitBranch,
} from "lucide-react";

export function OverviewClient() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    version: "enterprise",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
  };

  const scrollToContact = () => {
    const el = document.getElementById("lets-talk");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* ========================================================= */}
        {/* BREADCRUMBS: Home > Product > Overview                    */}
        {/* ========================================================= */}
        <div className="border-b border-slate-800/80 bg-slate-950/60 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-400">
            <Link
              href="/"
              className="hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" aria-hidden="true" />
            <span className="text-slate-400">Product</span>
            <ChevronRight className="w-3 h-3 text-slate-600" aria-hidden="true" />
            <span className="text-white font-medium truncate">
              Overview &amp; Architecture
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. HERO BANNER: Editorial Headline & Clear Product Mission */}
        {/* ========================================================= */}
        <section aria-labelledby="hero-title" className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800/80">
          <div className="relative max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="text-white">Inklara Platform</span>
              <span className="text-slate-500" aria-hidden="true">•</span>
              <span className="text-slate-300">Product Capabilities</span>
            </div>

            <h1
              id="hero-title"
              className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]"
            >
              Inclusive Engineering at Scale
            </h1>

            <p className="text-base sm:text-xl font-normal text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive accessibility verification platform for desktop, mobile, and web applications, combining browser-isolated automated scans with structured human evaluation.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
                <span>Launch Interactive Demo</span>
              </Link>

              <a
                href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <Code2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <span>Contact Inquiries</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. SECTION: Who can benefit from the A11y Audit Tool?     */}
        {/* ========================================================= */}
        <section
          aria-labelledby="who-benefits-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-6 space-y-6">
              <h2
                id="who-benefits-heading"
                className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug"
              >
                Who can benefit from Inklara?
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Our tool is designed for both technical users and business clients.
                The open-source version is ideal for developers, testers, and agencies with basic technical knowledge who can integrate the tool.
                The enterprise version provides customizable features for business clients to meet specific needs.
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                This tool excels in organizations managing multiple websites, streamlining audits, speeding up workflows, and maintaining high accessibility standards across the organization.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <span>Let&apos;s Talk</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right Column: High-Craft Workbench Product Graphic */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-950 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                    <span className="text-white font-semibold">Inklara A11y Engine</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">Playwright + axe-core</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
                    WCAG 2.2 Level AA
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Evaluated Rules</span>
                    <span className="text-xl font-bold text-white mt-0.5 block">52 Rules</span>
                    <span className="text-[10px] text-emerald-400">45 Passed • 7 Flagged</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Guided Protocols</span>
                    <span className="text-xl font-bold text-white mt-0.5 block">13 Checks</span>
                    <span className="text-[10px] text-indigo-400">WCAG-EM Standard</span>
                  </div>
                </div>

                {/* Audit Finding Callout */}
                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Target Scope: Multi-Screen Storefront</span>
                    <span className="text-[10px] font-mono text-slate-400">1280px / 768px / 320px</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Automatically checks DOM hierarchy, focus order, ARIA attributes, color contrast math, and keyboard traps across rendered routes.
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Zero False-Positive Target</span>
                    </span>
                    <Link
                      href="/showcase"
                      className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                    >
                      <span>Try interactive demo</span>
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. SECTION: Select your version (Open-Source vs Enterprise) */}
        {/* ========================================================= */}
        <section
          aria-labelledby="version-heading"
          className="bg-slate-950/70 border-y border-slate-800/80 py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2
                id="version-heading"
                className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                Select your version
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Choose the right edition for your team, agency, or enterprise organization.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Card 1: Open-Source */}
              <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Code2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Open-Source</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      The perfect way to kick off your journey with digital accessibility.
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Automated tests (axe-core 4.10)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Manual tests (13 WCAG-EM protocols)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Combined testing approach</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Downloadable reports (HTML / JSON)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Project organization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Local benchmark test fixtures</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <a
                    href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <span>Go to GitHub</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Card 2: Enterprise */}
              <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900 border border-indigo-700/70 shadow-2xl shadow-indigo-950/40 flex flex-col justify-between space-y-6 relative">
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
                    Recommended
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center">
                    <Users className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Enterprise</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      For complex solutions and additional support from our experts.
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>All Open-Source capabilities included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Collaborative auditing &amp; multi-team history</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Audits and accessibility declarations registry (VPAT / ACR)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Continuous regression baseline comparison (SHA-256)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Screen-Reader Simulation Workbench with live timeline</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Single sign-on (SSO) &amp; role-based access control</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Dedicated technical support and custom SLA</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={scrollToContact}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <span>Let&apos;s Talk</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. SECTION: Why choose the A11y Audit Tool?               */}
        {/* ========================================================= */}
        <section
          aria-labelledby="why-choose-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20"
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2
              id="why-choose-heading"
              className="text-2xl sm:text-4xl font-bold text-white tracking-tight"
            >
              Why choose Inklara?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Bridge the 60% manual accessibility testing gap and maintain verified WCAG 2.2 Level AA compliance with continuous browser automation.
            </p>
          </div>

          {/* Feature 1: Comprehensive testing (Text Left, Image Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                Comprehensive testing
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Unlike most tools that focus solely on automatic or manual tests, our tool offers both, ensuring comprehensive results.
                During manual tests, you can review and comment on automatic test results.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-sans">
                  <span className="font-bold text-white">Hybrid Audit Execution</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Automated + Human-in-the-Loop</span>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>1. Automated Engine:</span>
                    <span className="text-emerald-400 font-semibold">axe-core 4.10.2 (0.9s scan)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>2. Human Verification:</span>
                    <span className="text-indigo-400 font-semibold">13 WCAG-EM Guided Criteria</span>
                  </div>
                </div>
                <div className="p-3 rounded bg-slate-950/60 border border-slate-800/80 text-[11px] font-sans text-slate-300">
                  <span className="font-semibold text-white block mb-0.5">Auditor Annotation:</span>
                  &quot;Verified modal dialog correctly traps focus; confirmed ESC key restores focus to previous button.&quot;
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Guided testing (Image Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white">WCAG-EM Protocol Guide</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Check #4 of 13
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-semibold text-white">WCAG 2.1.2: No Keyboard Trap (Level A)</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Test Condition: Press Tab and Shift+Tab through all interactive components. Can focus be moved away without special keys?
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      PASS (Verified)
                    </span>
                    <span className="text-[10px] text-slate-400">Technique G21 Applied</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
              <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                Guided testing
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Our audit template guides you through accessibility features. It provides test conditions and techniques to solve issues.
                A tester doesn&apos;t need to be an expert in the accessibility field to perform an audit using our tool.
              </p>
            </div>
          </div>

          {/* Feature 3: Multi-page and multi-screen testing (Text Left, Image Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                Multi-page and<br className="hidden sm:inline" /> multi-screen testing
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Test multiple pages (URLs) and screen sizes in a single audit, enhancing efficiency.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white">Viewport Dimension Matrix</span>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Monitor className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                    <Tablet className="w-4 h-4 text-sky-400" aria-hidden="true" />
                    <Smartphone className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-center">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Desktop</span>
                    <span className="text-white font-bold">1920×1080</span>
                    <span className="text-[10px] text-emerald-400 block mt-1">100% Passed</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Tablet</span>
                    <span className="text-white font-bold">768×1024</span>
                    <span className="text-[10px] text-emerald-400 block mt-1">100% Passed</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Mobile Reflow</span>
                    <span className="text-white font-bold">320×640</span>
                    <span className="text-[10px] text-emerald-400 block mt-1">WCAG 1.4.10 OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Clear reports (Image Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white">Executive Compliance Summary</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Ready to Export
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Level A</span>
                    <span className="text-lg font-bold text-white">100%</span>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Level AA</span>
                    <span className="text-lg font-bold text-emerald-400">100%</span>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Level AAA</span>
                    <span className="text-lg font-bold text-indigo-400">68%</span>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-950 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Export Formats: PDF, HTML, JSON, VPAT/ACR</span>
                  <FileText className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
              <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                Clear reports
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Generated reports are clear and understandable, facilitating discussions with clients and roadmap planning for improvement efforts.
              </p>
            </div>
          </div>

          {/* Feature 5: Extensibility (Text Left, Image Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                Extensibility
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Extend the tool&apos;s capabilities by adding custom test cases using Playwright, reducing manual work and enhancing efficiency.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl font-mono text-[11px] text-slate-300 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-sans text-xs">
                  <span className="text-white font-semibold">custom-audit-extension.ts</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Playwright Scripting</span>
                </div>
                <div className="text-slate-400">
                  {"// Inject custom assertions into Inklara runner"}
                </div>
                <div className="text-indigo-300">
                  test(&apos;custom brand a11y criteria&apos;, async (&#123; page &#125;) =&gt; &#123;
                </div>
                <div className="pl-4 text-slate-300">
                  await inklara.auditPage(page, &#123;<br />
                  &nbsp;&nbsp;ruleset: [&apos;wcag2aa&apos;, &apos;wcag22aa&apos;],<br />
                  &nbsp;&nbsp;ssrfGuard: true,<br />
                  &nbsp;&nbsp;customChecks: [assertTouchTargetMin44px]<br />
                  &#125;);
                </div>
                <div className="text-indigo-300">&#125;);</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. SECTION: Let's work together (Interactive Contact Form) */}
        {/* ========================================================= */}
        <section
          id="lets-talk"
          aria-labelledby="lets-talk-heading"
          className="border-t border-slate-800/80 bg-gradient-to-b from-slate-950/40 via-indigo-950/20 to-[#07090e] py-16 lg:py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />
                <span>Contact &amp; Architecture Inquiries</span>
              </div>
              <h2
                id="lets-talk-heading"
                className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight"
              >
                Let&apos;s work together
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Connect with our technical team to discuss how Inklara can empower your organization to deliver accessible, inclusive software from day one.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-800/80 text-center space-y-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white">Message Received!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out. We look forward to connecting with you about your digital accessibility roadmap.
                </p>
                <div className="pt-2">
                  <Link
                    href="/showcase"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <span>Explore the Live Showcase</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block font-semibold text-slate-300 mb-1">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block font-semibold text-slate-300 mb-1">
                      Work Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-company" className="block font-semibold text-slate-300 mb-1">
                      Company / Organization
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-version" className="block font-semibold text-slate-300 mb-1">
                      Interested In
                    </label>
                    <select
                      id="contact-version"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="enterprise">Enterprise Platform</option>
                      <option value="open-source">Open-Source Integration</option>
                      <option value="consulting">Audit &amp; Remediation Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block font-semibold text-slate-300 mb-1">
                    Project Details or Questions
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the web applications, design systems, or compliance targets you are evaluating..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    We respect your privacy. No spam.
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-400"
                  >
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
