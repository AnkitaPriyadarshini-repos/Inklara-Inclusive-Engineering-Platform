import React from "react";

export const metadata = {
  title: "Fully Remediated Accessible Page — Inklara Fixture",
  description: "Accessible companion fixture verifying remediations, passes, and zero regressions.",
};

export default function AccessibleDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* 2. Semantic Landmark Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Inklara Benchmark Store
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            WCAG 2.2 AA Verified
          </span>
        </div>
      </header>

      {/* 3. Semantic Main Landmark with ID for Skip Link */}
      <main id="main-content" tabIndex={-1} className="max-w-4xl mx-auto p-8 outline-none">
        {/* 4. Sequential Heading Hierarchy */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Checkout Portal
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          This page represents the fully remediated, accessible counterpart adhering to WCAG 2.2 Level AA.
        </p>

        {/* 5. High-Contrast Section with Accessible Forms */}
        <section aria-labelledby="billing-heading" className="mb-8 p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h2 id="billing-heading" className="text-xl font-bold text-slate-900 mb-2">
            Billing Information
          </h2>
          {/* Contrast ratio #334155 on #ffffff is 9.5:1 (exceeds 4.5:1 AA requirement) */}
          <p className="text-slate-700 text-sm mb-6">
            Please enter your billing details carefully to complete your purchase.
          </p>

          <form className="space-y-5">
            {/* Form Control with explicit label */}
            <div>
              <label htmlFor="fullname-input" className="block text-sm font-medium text-slate-800 mb-1">
                Full Name <span className="text-rose-600" aria-hidden="true">*</span>
              </label>
              <input
                id="fullname-input"
                type="text"
                name="fullname"
                required
                autoComplete="name"
                placeholder="Jane Doe"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-slate-900"
              />
            </div>

            {/* Form Control with explicit label and input purpose */}
            <div>
              <label htmlFor="email-input" className="block text-sm font-medium text-slate-800 mb-1">
                Account Email <span className="text-rose-600" aria-hidden="true">*</span>
              </label>
              <input
                id="email-input"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="jane@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-slate-900"
              />
            </div>

            {/* Natural tab order without positive tabindex */}
            <div>
              <label htmlFor="coupon-input" className="block text-sm font-medium text-slate-800 mb-1">
                Promotional Coupon Code (Optional)
              </label>
              <input
                id="coupon-input"
                type="text"
                name="coupon"
                placeholder="DISCOUNT20"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-slate-900"
              />
            </div>
          </form>
        </section>

        {/* 6. Media & Actions with Full Accessible Names */}
        <section aria-labelledby="security-heading" className="mb-8 p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h2 id="security-heading" className="text-xl font-bold text-slate-900 mb-4">
            Security &amp; Assistance
          </h2>

          {/* Descriptive Image Alt Attribute */}
          <div className="mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='40'><rect fill='%231e3a8a' width='140' height='40' rx='4'/><text fill='white' x='15' y='25' font-family='sans-serif' font-size='14' font-weight='bold'>256-BIT SSL</text></svg>"
              alt="256-bit SSL encrypted payment gateway verification badge"
              className="rounded"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {/* Button with clear visible text and accessible icon */}
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Clear Cart</span>
            </button>

            {/* Link with meaningful text and icon */}
            <a
              href="#support-guide"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 underline focus:ring-2 focus:ring-blue-500 rounded p-1"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Customer Support &amp; Refund Policy</span>
            </a>
          </div>
        </section>

        {/* 7. Native Semantic Controls */}
        <section aria-labelledby="submission-heading" className="mb-8 p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
          <h2 id="submission-heading" className="text-xl font-bold text-slate-900 mb-4">
            Final Confirmation
          </h2>
          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-2.5 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow"
          >
            Submit Order
          </button>
        </section>
      </main>

      {/* 8. Semantic Footer Landmark */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 Inklara Accessibility Benchmark Suite. For engineering evaluation only.</p>
      </footer>
    </div>
  );
}
