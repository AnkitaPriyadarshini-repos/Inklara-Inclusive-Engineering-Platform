import React from "react";
import { Navbar } from "@/components/Navbar";
import { WCAG_CATALOG } from "@/lib/wcag/catalog";
import { BookOpen, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function WcagReferencePage() {
  const criteriaList = Object.values(WCAG_CATALOG);

  const principles = ["Perceivable", "Operable", "Understandable", "Robust"] as const;

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

        {/* Group by Principle */}
        <div className="space-y-8">
          {principles.map((principle) => {
            const items = criteriaList.filter((c) => c.principle === principle);

            return (
              <section key={principle} aria-labelledby={`principle-${principle}`} className="space-y-4">
                <div className="flex items-center justify-between border-b border-apple-border pb-2">
                  <h2 id={`principle-${principle}`} className="text-lg font-bold text-white">
                    Principle: {principle}
                  </h2>
                  <span className="text-xs text-apple-muted">
                    {items.length} Success Criteria
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((criterion) => (
                    <article
                      key={criterion.id}
                      className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                              {criterion.num}
                            </span>
                            <span className="text-xs font-bold uppercase text-slate-300">
                              Level {criterion.level}
                            </span>
                            <span className="text-[10px] text-apple-muted font-mono">
                              v{criterion.version}
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-white mt-1">
                            {criterion.title}
                          </h3>
                        </div>

                        <a
                          href={criterion.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-apple-muted hover:text-white p-1 rounded focus-visible:ring-1 focus-visible:ring-apple-focus"
                          aria-label={`Open W3C Understanding ${criterion.num} documentation`}
                        >
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      </div>

                      <p className="text-xs text-apple-muted leading-relaxed">
                        {criterion.description}
                      </p>

                      <div className="pt-2 border-t border-apple-border/70 text-[11px]">
                        <span className="text-apple-muted block mb-1 font-semibold">
                          Associated Axe Rules:
                        </span>
                        {criterion.associatedAxeRules.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {criterion.associatedAxeRules.map((r) => (
                              <span
                                key={r}
                                className="px-1.5 py-0.5 rounded bg-apple-elevated text-slate-300 font-mono text-[10px] border border-apple-border"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-amber-400 font-sans italic">
                            Requires human manual verification (no reliable automated check)
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
