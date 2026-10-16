import React from "react";

export const metadata = {
  title: "Deliberately Inaccessible Test Page — Inklara Fixture",
  description: "Test fixture with intentional WCAG 2.2 violations for automated scanner verification.",
};

export default function InaccessibleDemoPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      {/* Intentionally missing skip-link */}

      {/* Intentionally malformed header without landmark */}
      <div className="border-b pb-4 mb-6">
        <span className="text-2xl font-bold">Inaccessible Demo Fixture</span>
        <p className="text-gray-400 text-sm">
          Notice: This page contains deliberate accessibility defects designed to test the Inklara scanning engine.
        </p>
      </div>

      {/* Heading Order Violation: h1 followed directly by h4 */}
      <h1 className="text-3xl font-extrabold mb-2">Checkout Portal</h1>
      <h4 className="text-xl font-bold mb-4">Customer Details</h4>

      {/* Low Contrast Text (Violates WCAG 1.4.3 Contrast Minimum) */}
      <section className="mb-8 p-4 bg-gray-50 border rounded">
        <h2 className="text-lg font-bold mb-2">Billing Information</h2>
        {/* Contrast ratio #a1a1aa on #f9fafb is ~2.3:1 (fails AA 4.5:1) */}
        <p style={{ color: "#a1a1aa", backgroundColor: "#f9fafb" }} className="text-sm mb-4">
          Please enter your credit card information carefully to complete the purchase.
        </p>

        <form className="space-y-4">
          {/* Form Label Violation (Violates WCAG 3.3.2 & 4.1.2) - Missing label */}
          <div>
            <p className="text-sm font-semibold">Full Name:</p>
            <input
              type="text"
              name="fullname"
              placeholder="e.g. Jane Doe"
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Form Label Violation - Input without label or aria-label */}
          <div>
            <p className="text-sm font-semibold">Account Email:</p>
            <input
              type="email"
              name="email"
              placeholder="jane@example.com"
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Broken Tab Index: positive tabindex disrupts logical focus order (Violates WCAG 2.4.3) */}
          <div>
            <p className="text-sm font-semibold">Coupon Code:</p>
            <input
              type="text"
              name="coupon"
              tabIndex={5}
              placeholder="DISCOUNT20"
              className="border p-2 w-full rounded"
            />
          </div>
        </form>
      </section>

      {/* Missing Image Alt Violation (Violates WCAG 1.1.1 Non-text Content) */}
      <section className="mb-8 p-4 bg-gray-50 border rounded">
        <h2 className="text-lg font-bold mb-2">Security Verification</h2>
        {/* Missing alt attribute entirely */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='40'><rect fill='%232563eb' width='100' height='40'/><text fill='white' x='10' y='25'>SECURE</text></svg>"
          className="mb-4 rounded"
        />

        {/* Empty Button Violation (Violates WCAG 4.1.2 Button Name) */}
        <div className="flex gap-4 items-center">
          <p className="text-sm font-medium">Clear items:</p>
          <button
            type="button"
            className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center"
            // Intentionally missing aria-label or visible text
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Empty Link Violation (Violates WCAG 2.4.4 & 4.1.2) */}
        <div className="mt-4">
          <a
            href="#help"
            className="inline-block p-1 text-blue-500"
            // Intentionally empty anchor
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </a>
        </div>
      </section>

      {/* Invalid ARIA Role (Violates WCAG 4.1.2) */}
      <section className="mb-8 p-4 bg-gray-50 border rounded">
        <h2 className="text-lg font-bold mb-2">Custom Controls</h2>
        {/* role="custom-button" is not a valid WAI-ARIA role */}
        <div
          role="custom-button"
          tabIndex={0}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded inline-block"
        >
          Submit Order
        </div>
      </section>
    </div>
  );
}
