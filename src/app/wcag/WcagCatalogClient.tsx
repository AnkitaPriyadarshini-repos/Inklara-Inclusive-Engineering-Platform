"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, ExternalLink, Search, Filter, Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import type { WcagCriterion } from "@/lib/wcag/catalog";

interface WcagCatalogClientProps {
  criteria: WcagCriterion[];
}

export function WcagCatalogClient({ criteria }: WcagCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");

  const principles = ["Perceivable", "Operable", "Understandable", "Robust"] as const;

  const filteredCriteria = useMemo(() => {
    return criteria.filter((criterion) => {
      if (selectedPrinciple !== "ALL" && criterion.principle !== selectedPrinciple) {
        return false;
      }
      if (selectedLevel !== "ALL" && criterion.level !== selectedLevel) {
        return false;
      }
      if (selectedMethod === "AUTOMATED" && criterion.associatedAxeRules.length === 0) {
        return false;
      }
      if (selectedMethod === "MANUAL" && criterion.associatedAxeRules.length > 0) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = criterion.num.toLowerCase().includes(q);
        const matchTitle = criterion.title.toLowerCase().includes(q);
        const matchDesc = criterion.description.toLowerCase().includes(q);
        const matchRules = criterion.associatedAxeRules.some((r) => r.toLowerCase().includes(q));
        if (!matchNum && !matchTitle && !matchDesc && !matchRules) {
          return false;
        }
      }
      return true;
    });
  }, [criteria, selectedPrinciple, selectedLevel, selectedMethod, searchQuery]);

  const activePrinciples = selectedPrinciple === "ALL"
    ? principles
    : principles.filter((p) => p === selectedPrinciple);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPrinciple("ALL");
    setSelectedLevel("ALL");
    setSelectedMethod("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="p-4 bg-apple-surface border border-apple-border rounded-xl space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-apple-muted absolute left-3 top-2.5" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search criteria by number (e.g. 1.1.1), title, or axe rule..."
              className="w-full bg-apple-elevated border border-apple-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-apple-muted focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
              aria-label="Search WCAG criteria"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-apple-muted">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Filters:</span>
            </div>

            <select
              value={selectedPrinciple}
              onChange={(e) => setSelectedPrinciple(e.target.value)}
              className="bg-apple-elevated border border-apple-border text-xs text-white rounded-lg px-2.5 py-1.5 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
              aria-label="Filter by Principle"
            >
              <option value="ALL">All Principles</option>
              <option value="Perceivable">Perceivable</option>
              <option value="Operable">Operable</option>
              <option value="Understandable">Understandable</option>
              <option value="Robust">Robust</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-apple-elevated border border-apple-border text-xs text-white rounded-lg px-2.5 py-1.5 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
              aria-label="Filter by Conformance Level"
            >
              <option value="ALL">All Levels</option>
              <option value="A">Level A</option>
              <option value="AA">Level AA</option>
              <option value="AAA">Level AAA</option>
            </select>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-apple-elevated border border-apple-border text-xs text-white rounded-lg px-2.5 py-1.5 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
              aria-label="Filter by Verification Method"
            >
              <option value="ALL">All Methods</option>
              <option value="AUTOMATED">Automated (axe-core)</option>
              <option value="MANUAL">Manual Review Required</option>
            </select>

            {(searchQuery || selectedPrinciple !== "ALL" || selectedLevel !== "ALL" || selectedMethod !== "ALL") && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-apple-muted hover:text-white rounded-lg hover:bg-apple-elevated transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Counter feedback */}
        <div className="flex items-center justify-between text-[11px] text-apple-muted pt-2 border-t border-apple-border/60">
          <span>
            Showing <strong className="text-white">{filteredCriteria.length}</strong> of {criteria.length} criteria
          </span>
          <span className="font-mono text-[10px]">
            WCAG 2.2 AA Conformance Target
          </span>
        </div>
      </div>

      {/* Criteria Listing */}
      {filteredCriteria.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-apple-border rounded-xl bg-apple-surface space-y-3">
          <BookOpen className="w-10 h-10 text-apple-muted mx-auto" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">No Criteria Found</h2>
          <p className="text-xs text-apple-muted max-w-sm mx-auto">
            No WCAG success criteria match your current filter parameters or search term.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {activePrinciples.map((principle) => {
            const items = filteredCriteria.filter((c) => c.principle === principle);
            if (items.length === 0) return null;

            return (
              <section key={principle} aria-labelledby={`principle-${principle}`} className="space-y-4">
                <div className="flex items-center justify-between border-b border-apple-border pb-2">
                  <h2 id={`principle-${principle}`} className="text-lg font-bold text-white">
                    Principle: {principle}
                  </h2>
                  <span className="text-xs text-apple-muted">
                    {items.length} {items.length === 1 ? "Criterion" : "Success Criteria"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((criterion) => (
                    <article
                      key={criterion.id}
                      className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm space-y-3 hover:border-apple-subtle transition-colors"
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
      )}
    </div>
  );
}
