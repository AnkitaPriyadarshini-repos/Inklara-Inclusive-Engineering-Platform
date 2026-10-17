"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "./Modal";
import { Play, Loader2, AlertCircle, Sparkles } from "lucide-react";

interface ProjectOption {
  id: string;
  name: string;
}

interface RunAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: ProjectOption[];
  defaultProjectId?: string;
  defaultTargetUrl?: string;
}

export function RunAuditModal({
  isOpen,
  onClose,
  projects = [],
  defaultProjectId,
  defaultTargetUrl,
}: RunAuditModalProps) {
  const router = useRouter();
  const [projectId, setProjectId] = useState(defaultProjectId || (projects[0]?.id ?? ""));
  const [newProjectName, setNewProjectName] = useState("");
  const [name, setName] = useState("Automated WCAG 2.2 AA Audit");
  const [targetUrl, setTargetUrl] = useState(defaultTargetUrl || "http://localhost:3000/demo/inaccessible");
  const [scopeType, setScopeType] = useState<"single-page" | "multi-page" | "wcag-em-sample">("single-page");
  const [wcagLevel, setWcagLevel] = useState("WCAG_2_2_AA");
  const [isBaseline, setIsBaseline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAuditId, setFailedAuditId] = useState<string | null>(null);

  // Sync selected projectId and targetUrl whenever modal opens or defaults update
  useEffect(() => {
    if (isOpen) {
      if (defaultTargetUrl) {
        setTargetUrl(defaultTargetUrl);
      }
      if (projects.length > 0) {
        if (!projectId || !projects.some((p) => p.id === projectId)) {
          setProjectId(defaultProjectId || projects[0].id);
        }
      }
    }
  }, [isOpen, projects, defaultProjectId, projectId, defaultTargetUrl]);

  const getPresetUrl = (path: string) => {
    if (typeof window !== "undefined" && window.location.origin) {
      return `${window.location.origin}${path}`;
    }
    return `http://localhost:3000${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFailedAuditId(null);
    setIsLoading(true);

    try {
      let finalProjectId = projectId;

      // Fallback to first available project if none explicitly selected
      if (!finalProjectId && projects.length > 0) {
        finalProjectId = projects[0].id;
      }

      // If user chose to create a new project inline
      if (!finalProjectId && newProjectName.trim()) {
        const projRes = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newProjectName.trim() }),
        });
        if (!projRes.ok) {
          throw new Error("Failed to create new project.");
        }
        const projData = await projRes.json();
        finalProjectId = projData.project.id;
      }

      if (!finalProjectId) {
        throw new Error("Please select or create an audit project.");
      }

      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: finalProjectId,
          name,
          targetUrl,
          scopeType,
          wcagLevel,
          isBaseline,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.auditRunId) {
          setFailedAuditId(data.auditRunId);
        }
        throw new Error(data.message || data.error || "Failed to execute audit.");
      }

      onClose();
      router.push(`/audits/${data.auditRun.id}`);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Execute Accessibility Audit"
      description="Launch automated WCAG 2.2 evaluation with Playwright and axe-core."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        {error && (
          <div
            role="alert"
            className="p-3 bg-red-950/70 border border-red-800 rounded-lg text-red-200 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold">Audit Execution Error</p>
              <p>{error}</p>
              {failedAuditId && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/audits/${failedAuditId}`);
                  }}
                  className="underline text-blue-400 hover:text-blue-300 font-mono text-[11px] block mt-1"
                >
                  View recorded failure audit #{failedAuditId.slice(0, 8)}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Project Selection */}
        <div>
          <label htmlFor="audit-project-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Audit Project <span className="text-red-400">*</span>
          </label>
          {projects.length > 0 ? (
            <select
              id="audit-project-select"
              value={projectId || (projects[0]?.id ?? "")}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="audit-project-select"
              type="text"
              required
              placeholder="e.g. Enterprise Core Experience / Checkout Flow"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
            />
          )}
        </div>

        {/* Target URL with Quick Presets */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="audit-url-input" className="block text-xs font-semibold text-slate-300">
              Target URL <span className="text-red-400">*</span>
            </label>
            <span className="text-[11px] text-apple-muted">SSRF protected</span>
          </div>
          <input
            id="audit-url-input"
            type="url"
            required
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-apple-elevated border border-apple-border text-white text-xs font-mono rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
          />

          {/* Quick presets for evaluation demo */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-apple-muted">Presets:</span>
            <button
              type="button"
              onClick={() => {
                setTargetUrl(getPresetUrl("/demo/inaccessible"));
                setName("Inaccessible Demo Baseline");
              }}
              className="px-2 py-1 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 text-red-300 rounded text-[11px] transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
            >
              ⚡ Inaccessible Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetUrl(getPresetUrl("/demo/accessible"));
                setName("Remediated Accessible Verification");
              }}
              className="px-2 py-1 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 rounded text-[11px] transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
            >
              ✓ Remediated Accessible
            </button>
          </div>
        </div>

        {/* Audit Run Name */}
        <div>
          <label htmlFor="audit-name-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Audit Name / Scope Descriptor <span className="text-red-400">*</span>
          </label>
          <input
            id="audit-name-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
          />
        </div>

        {/* Grid for Scope and WCAG target */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="audit-wcag-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Evaluation Target
            </label>
            <select
              id="audit-wcag-select"
              value={wcagLevel}
              onChange={(e) => setWcagLevel(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
            >
              <option value="WCAG_2_2_AA">WCAG 2.2 Level AA (Standard)</option>
              <option value="WCAG_2_1_AA">WCAG 2.1 Level AA</option>
              <option value="WCAG_2_0_AA">WCAG 2.0 Level AA</option>
            </select>
          </div>

          <div>
            <label htmlFor="audit-scope-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Scope Model
            </label>
            <select
              id="audit-scope-select"
              value={scopeType}
              onChange={(e) =>
                setScopeType(
                  e.target.value as "single-page" | "multi-page" | "wcag-em-sample"
                )
              }
              className="w-full bg-apple-elevated border border-apple-border text-white text-xs rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
            >
              <option value="single-page">Single Page Audit</option>
              <option value="multi-page">Bounded Multi-Page</option>
              <option value="wcag-em-sample">WCAG-EM Sample Set</option>
            </select>
          </div>
        </div>

        {/* Baseline Checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            id="audit-baseline-check"
            type="checkbox"
            checked={isBaseline}
            onChange={(e) => setIsBaseline(e.target.checked)}
            className="w-4 h-4 rounded border-apple-border bg-apple-elevated text-blue-600 focus:ring-apple-focus focus:ring-offset-apple-surface"
          />
          <label htmlFor="audit-baseline-check" className="text-xs text-slate-300 cursor-pointer select-none">
            Mark this run as an official project baseline for regression diffing
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-apple-border">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-apple-elevated transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Running Axe Analysis...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Start Evaluation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
