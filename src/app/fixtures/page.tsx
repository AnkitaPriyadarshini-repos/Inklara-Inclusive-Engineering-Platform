import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Layers, AlertTriangle, CheckCircle2, ExternalLink, ArrowRight, Volume2 } from "lucide-react";

export default function FixturesPage() {
  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none space-y-8">
        <div className="pb-5 border-b border-apple-border">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Controlled Test Targets
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Accessibility Demonstration Fixtures
          </h1>
          <p className="text-xs text-apple-muted mt-1 max-w-3xl">
            Controlled local environments designed to demonstrate that the Inklara scanning engine, verification workflow, screen reader workbench, and regression comparator distinguish defective and remediated implementations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Inaccessible Target Card */}
          <div className="p-6 bg-apple-surface border border-red-950/60 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-950 text-red-300 border border-red-800">
                    Target A — Deliberately Inaccessible
                  </span>
                  <h2 className="text-lg font-bold text-white mt-2">
                    E-Commerce Portal with Defects
                  </h2>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" aria-hidden="true" />
              </div>

              <p className="text-xs text-apple-muted leading-relaxed">
                Contains deliberate WCAG 2.2 Level A and AA failures for automated and manual testing:
              </p>

              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>
                  <strong>WCAG 1.4.3:</strong> Low contrast gray text (2.3:1) on white inputs
                </li>
                <li>
                  <strong>WCAG 1.1.1:</strong> Security SSL image missing <code className="text-red-300">alt</code> attribute
                </li>
                <li>
                  <strong>WCAG 4.1.2:</strong> Button with icon but no accessible name or visible label
                </li>
                <li>
                  <strong>WCAG 3.3.2:</strong> Form input controls without associated <code className="text-red-300">&lt;label&gt;</code> elements
                </li>
                <li>
                  <strong>WCAG 2.4.3:</strong> Positive <code className="text-red-300">tabindex=&quot;5&quot;</code> disrupting natural keyboard reading order
                </li>
                <li>
                  <strong>WCAG 1.3.1:</strong> Skipped heading level jumping directly from <code className="text-red-300">&lt;h1&gt;</code> to <code className="text-red-300">&lt;h4&gt;</code>
                </li>
                <li>
                  <strong>WCAG 4.1.2:</strong> Non-standard ARIA <code className="text-red-300">role=&quot;custom-button&quot;</code>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-apple-border flex items-center justify-between">
              <a
                href="/demo/inaccessible"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1.5"
              >
                <span>View Rendered Fixture</span>
                <ExternalLink className="w-3.5 h-3.5 text-apple-muted" aria-hidden="true" />
              </a>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors"
              >
                <span>Scan from Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Accessible Target Card */}
          <div className="p-6 bg-apple-surface border border-emerald-950/60 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Target B — Remediated & Verified
                  </span>
                  <h2 className="text-lg font-bold text-white mt-2">
                    E-Commerce Portal Remediated
                  </h2>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" aria-hidden="true" />
              </div>

              <p className="text-xs text-apple-muted leading-relaxed">
                Companion fixture demonstrating complete WCAG 2.2 Level AA compliance:
              </p>

              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>
                  <strong>WCAG 2.4.1:</strong> Accessible keyboard skip link to main content landmark
                </li>
                <li>
                  <strong>WCAG 1.4.3:</strong> High-contrast text (9.5:1 ratio) exceeding AA standards
                </li>
                <li>
                  <strong>WCAG 1.1.1:</strong> Descriptive alt attribute on SSL security graphic
                </li>
                <li>
                  <strong>WCAG 4.1.2:</strong> Clear button with visible label and aria-hidden icon
                </li>
                <li>
                  <strong>WCAG 3.3.2:</strong> Explicit <code className="text-emerald-300">&lt;label for=&quot;...&quot;&gt;</code> associated with each input
                </li>
                <li>
                  <strong>WCAG 2.4.3:</strong> Natural DOM tab order without positive tabindex
                </li>
                <li>
                  <strong>WCAG 1.3.1:</strong> Sequential headings hierarchy (<code className="text-emerald-300">h1 -&gt; h2</code>)
                </li>
                <li>
                  <strong>WCAG 4.1.2:</strong> Native semantic HTML <code className="text-emerald-300">&lt;button type=&quot;submit&quot;&gt;</code>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-apple-border flex items-center justify-between">
              <a
                href="/demo/accessible"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1.5"
              >
                <span>View Rendered Fixture</span>
                <ExternalLink className="w-3.5 h-3.5 text-apple-muted" aria-hidden="true" />
              </a>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
              >
                <span>Scan from Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Screen Reader Scenarios Card */}
          <div className="p-6 bg-apple-surface border border-blue-950/60 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    Target C — WAI-ARIA Interactive
                  </span>
                  <h2 className="text-lg font-bold text-white mt-2">
                    Screen Reader Scenarios Fixture
                  </h2>
                </div>
                <Volume2 className="w-6 h-6 text-blue-400 shrink-0" aria-hidden="true" />
              </div>

              <p className="text-xs text-apple-muted leading-relaxed">
                Controlled complex assistive technology and screen-reader patterns:
              </p>

              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>
                  <strong>Dialog & Focus:</strong> <code className="text-blue-300">role=&quot;dialog&quot;</code> with trapped tab navigation & Escape key dismiss
                </li>
                <li>
                  <strong>Live Regions:</strong> <code className="text-blue-300">aria-live=&quot;polite&quot;</code> shopping cart status announcement
                </li>
                <li>
                  <strong>Form Validation:</strong> Dynamic <code className="text-blue-300">aria-invalid</code> and <code className="text-blue-300">aria-describedby</code> error
                </li>
                <li>
                  <strong>Tabs Pattern:</strong> WAI-ARIA tablist with keyboard-controlled tabpanels
                </li>
                <li>
                  <strong>Disclosure:</strong> Expandable panel with <code className="text-blue-300">aria-expanded</code> and control binding
                </li>
                <li>
                  <strong>Switch Widget:</strong> Accessible toggle button using <code className="text-blue-300">role=&quot;switch&quot;</code>
                </li>
                <li>
                  <strong>Icon Buttons:</strong> Unlabeled icon controls paired with <code className="text-blue-300">aria-label</code>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-apple-border flex items-center justify-between">
              <a
                href="/demo/screen-reader"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1.5"
              >
                <span>View Rendered Fixture</span>
                <ExternalLink className="w-3.5 h-3.5 text-apple-muted" aria-hidden="true" />
              </a>

              <Link
                href="/screen-reader"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
              >
                <span>Open in Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
