import React from "react";
import { Navbar } from "@/components/Navbar";
import { WCAG_CATALOG } from "@/lib/wcag/catalog";
import { BookOpen } from "lucide-react";
import { WcagCatalogClient } from "./WcagCatalogClient";

export default function WcagReferencePage() {
  const criteriaList = Object.values(WCAG_CATALOG);

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none space-y-8">
        <div className="pb-5 border-b border-apple-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 uppercase tracking-wider">
              WCAG 2.2 AA Reference
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            W3C WCAG 2.2 Success Criteria Catalog
          </h1>
          <p className="text-xs text-apple-muted mt-1 max-w-3xl">
            Authoritative criteria mapping layer connecting automated axe-core rules and guided manual testing protocols with official W3C specifications.
          </p>
        </div>

        {/* Methodology note */}
        <div className="p-4 bg-apple-surface border border-apple-border rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold">
            <BookOpen className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <span>WCAG-EM Evaluation Methodology</span>
          </div>
          <p className="text-apple-muted leading-relaxed">
            Inklara adheres to the W3C Website Accessibility Conformance Evaluation Methodology (WCAG-EM 1.0). An evaluation comprises defining scope, exploring the target website, selecting a representative sample, auditing each sampled page, and recording structured evidence.
          </p>
        </div>

        {/* Interactive Criteria Browser */}
        <WcagCatalogClient criteria={criteriaList} />
      </main>
    </div>
  );
}

