"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, ShoppingCart, X, Plus, Trash2 } from "lucide-react";

export default function ScreenReaderDemoFixturePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("invalid-user-email");
  const [isEmailInvalid, setIsEmailInvalid] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(3);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"shipping" | "billing">("shipping");
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      {/* Skip Navigation Link */}
      <a href="#sr-fixture-main" className="skip-link">
        Skip to fixture content
      </a>

      <header className="max-w-4xl mx-auto pb-6 border-b border-slate-800 mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/screen-reader"
              className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-blue-400 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Workbench</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Screen Reader Test Scenarios Fixture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Controlled interactive UI patterns with accessible names, semantic roles, focus trapping, and ARIA live regions for Inklara scenario evaluation.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
          WAI-ARIA Compliant
        </span>
      </header>

      <main id="sr-fixture-main" tabIndex={-1} className="max-w-4xl mx-auto space-y-8 outline-none">
        {/* Scenario 1: Modal Dialog */}
        <section aria-labelledby="sec-modal-heading" className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">
                Scenario 1 — Dialogs &amp; Focus Trapping
              </span>
              <h2 id="sec-modal-heading" className="text-base font-bold text-white mt-0.5">
                Modal Dialog Pattern
              </h2>
            </div>
            <button
              id="sr-open-modal-btn"
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-haspopup="dialog"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Review Order
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Clicking &quot;Review Order&quot; opens a dialog with <code className="text-blue-300">role=&quot;dialog&quot;</code> and <code className="text-blue-300">aria-modal=&quot;true&quot;</code>. Focus moves to the close button and dismisses on Escape.
          </p>

          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              role="presentation"
            >
              <div
                id="sr-demo-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sr-modal-title"
                className="w-full max-w-md bg-slate-800 border border-slate-600 rounded-xl p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h3 id="sr-modal-title" className="text-base font-bold text-white">
                    Order Summary
                  </h3>
                  <button
                    id="sr-close-modal-btn"
                    type="button"
                    autoFocus
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-md focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You have 2 items in your cart. Express shipping is selected. Focus is constrained inside this dialog.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-md focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Confirm &amp; Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Scenario 2: Form Input Validation */}
        <section aria-labelledby="sec-form-heading" className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
          <div>
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
              Scenario 2 — Forms &amp; Error Identification
            </span>
            <h2 id="sec-form-heading" className="text-base font-bold text-white mt-0.5">
              Live Error Announcement &amp; aria-invalid
            </h2>
          </div>

          <div className="max-w-md space-y-2">
            <label htmlFor="sr-email-input" className="block text-xs font-semibold text-slate-200">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              id="sr-email-input"
              type="text"
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value);
                setIsEmailInvalid(!e.target.value.includes("@"));
              }}
              aria-invalid={isEmailInvalid ? "true" : "false"}
              aria-describedby={isEmailInvalid ? "sr-email-error-msg" : undefined}
              className="w-full bg-slate-900 border border-rose-500 rounded-lg px-3 py-2 text-xs text-white font-mono focus-visible:ring-2 focus-visible:ring-rose-400 outline-none"
            />
            {isEmailInvalid && (
              <div
                id="sr-email-error-msg"
                role="alert"
                aria-live="assertive"
                className="text-xs text-rose-400 flex items-center gap-1.5 pt-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Please enter a valid email address with @.</span>
              </div>
            )}
          </div>
        </section>

        {/* Scenario 3: ARIA Live Region */}
        <section aria-labelledby="sec-live-heading" className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                Scenario 3 — ARIA Live Regions (WCAG 4.1.3)
              </span>
              <h2 id="sec-live-heading" className="text-base font-bold text-white mt-0.5">
                Dynamic Cart Politeness Status
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCartItemsCount((c) => c + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <div
            id="sr-live-counter-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>
              {cartItemsCount} items in order, total ${(cartItemsCount * 29.66).toFixed(2)}.
            </span>
          </div>
        </section>

        {/* Scenario 4: Disclosure Menu */}
        <section aria-labelledby="sec-disclosure-heading" className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
          <div>
            <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider">
              Scenario 4 — Navigation Disclosures
            </span>
            <h2 id="sec-disclosure-heading" className="text-base font-bold text-white mt-0.5">
              Expandable Disclosure Trigger
            </h2>
          </div>

          <div>
            <button
              id="sr-disclosure-btn"
              type="button"
              onClick={() => setIsDisclosureOpen((o) => !o)}
              aria-expanded={isDisclosureOpen}
              aria-controls="sr-disclosure-panel"
              className="w-full text-left px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-white flex items-center justify-between focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span>Payment Methods</span>
              <span className="text-[10px] text-slate-400 uppercase">
                {isDisclosureOpen ? "Collapse [-]" : "Expand [+]"}
              </span>
            </button>

            {isDisclosureOpen && (
              <div
                id="sr-disclosure-panel"
                role="region"
                aria-label="Payment Methods Details"
                className="mt-2 p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-1"
              >
                <p>Digital Wallet • Credit Card ending in 4242</p>
                <p className="text-slate-400 text-[11px]">Billing address verified.</p>
              </div>
            )}
          </div>
        </section>

        {/* Scenario 5: Icon-Only Action Button */}
        <section aria-labelledby="sec-icon-heading" className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                Scenario 5 — Controls &amp; Buttons
              </span>
              <h2 id="sec-icon-heading" className="text-base font-bold text-white mt-0.5">
                Icon-Only Action Button
              </h2>
            </div>
            <button
              id="sr-icon-remove-btn"
              type="button"
              aria-label="Remove item from cart"
              className="p-2 text-rose-400 hover:text-white hover:bg-rose-950/60 border border-rose-800/50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-400"
              title="Remove item from cart"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            The trash button contains no visible text. It relies on <code className="text-cyan-300">aria-label=&quot;Remove item from cart&quot;</code> and <code className="text-cyan-300">aria-hidden=&quot;true&quot;</code> on the SVG to compute a discernible accessible name.
          </p>
        </section>

        {/* Scenario 6: Accessible Tabs Widget */}
        <section aria-labelledby="sec-tabs-heading" className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
          <div>
            <span className="text-[11px] text-purple-400 font-bold uppercase tracking-wider">
              Scenario 6 — WAI-ARIA Tabs Pattern
            </span>
            <h2 id="sec-tabs-heading" className="text-base font-bold text-white mt-0.5">
              Accessible Tablist &amp; Panels
            </h2>
          </div>

          <div>
            <div role="tablist" aria-label="Checkout Steps" className="flex border-b border-slate-700">
              <button
                id="sr-tab-shipping"
                role="tab"
                type="button"
                aria-selected={activeTab === "shipping"}
                aria-controls="sr-tabpanel-shipping"
                onClick={() => setActiveTab("shipping")}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  activeTab === "shipping"
                    ? "border-blue-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Shipping
              </button>
              <button
                id="sr-tab-billing"
                role="tab"
                type="button"
                aria-selected={activeTab === "billing"}
                aria-controls="sr-tabpanel-billing"
                onClick={() => setActiveTab("billing")}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  activeTab === "billing"
                    ? "border-blue-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Billing
              </button>
            </div>

            {activeTab === "shipping" ? (
              <div
                id="sr-tabpanel-shipping"
                role="tabpanel"
                tabIndex={0}
                aria-labelledby="sr-tab-shipping"
                aria-label="Shipping Options"
                className="p-4 bg-slate-900 rounded-b-lg text-xs text-slate-300 outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
              >
                <p className="font-semibold text-white">Express Delivery (1-2 business days)</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Signature required upon arrival.</p>
              </div>
            ) : (
              <div
                id="sr-tabpanel-billing"
                role="tabpanel"
                tabIndex={0}
                aria-labelledby="sr-tab-billing"
                aria-label="Billing Information"
                className="p-4 bg-slate-900 rounded-b-lg text-xs text-slate-300 outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
              >
                <p className="font-semibold text-white">Digital Wallet Default Card</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Authorized for contactless tokenization.</p>
              </div>
            )}
          </div>
        </section>

        {/* Scenario 7: Toggle Switch Widget */}
        <section aria-labelledby="sec-switch-heading" className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                Scenario 7 — Controls &amp; Switches
              </span>
              <h2 id="sec-switch-heading" className="text-base font-bold text-white mt-0.5">
                Toggle Switch Widget
              </h2>
            </div>
            <button
              id="sr-toggle-switch"
              type="button"
              role="switch"
              aria-checked={isSwitchOn}
              onClick={() => setIsSwitchOn((s) => !s)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isSwitchOn ? "bg-emerald-600 justify-end" : "bg-slate-700 justify-start"
              }`}
              aria-label="Enable Express Checkout"
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Control uses <code className="text-emerald-300">role=&quot;switch&quot;</code> and dynamically communicates state via <code className="text-emerald-300">aria-checked=&quot;{isSwitchOn ? "true" : "false"}&quot;</code>.
          </p>
        </section>
      </main>
    </div>
  );
}
