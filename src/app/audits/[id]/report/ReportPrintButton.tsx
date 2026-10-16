"use client";

import React from "react";
import { Printer } from "lucide-react";

export function ReportPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <Printer className="w-3.5 h-3.5" aria-hidden="true" />
      <span>Print / Save as PDF</span>
    </button>
  );
}
