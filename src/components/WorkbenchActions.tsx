"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Play, Sparkles, Loader2 } from "lucide-react";

export function WorkbenchActions() {
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Fallback
    } finally {
      setIsSeeding(false);
    }
  };

  const handleOpenAudit = () => {
    window.dispatchEvent(new CustomEvent("inklara:open-audit"));
  };

  const handleOpenProject = () => {
    window.dispatchEvent(new CustomEvent("inklara:open-project"));
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={handleSeed}
        disabled={isSeeding}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
        title="Initialize standard benchmark project and local fixtures"
      >
        {isSeeding ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" aria-hidden="true" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
        )}
        <span>{isSeeding ? "Seeding..." : "Seed Benchmark Fixtures"}</span>
      </button>

      <button
        type="button"
        onClick={handleOpenProject}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <Plus className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        <span>New Project</span>
      </button>

      <button
        type="button"
        onClick={handleOpenAudit}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
        <span>Execute Audit</span>
      </button>
    </div>
  );
}
