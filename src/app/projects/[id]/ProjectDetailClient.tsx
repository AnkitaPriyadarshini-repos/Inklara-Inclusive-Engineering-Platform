"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Modal } from "@/components/Modal";
import { RunAuditModal } from "@/components/RunAuditModal";
import {
  ArrowLeft,
  Plus,
  Play,
  ExternalLink,
  Layers,
  History,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import type { Project, Target, AuditRun } from "@prisma/client";

interface ProjectWithDetails extends Project {
  targets: Target[];
  auditRuns: AuditRun[];
}

interface ProjectDetailClientProps {
  project: ProjectWithDetails;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter();
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedTargetUrl, setSelectedTargetUrl] = useState<string | undefined>();
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [deletingTargetId, setDeletingTargetId] = useState<string | null>(null);

  // New Target Form
  const [targetName, setTargetName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [environment, setEnvironment] = useState("development");
  const [isCreatingTarget, setIsCreatingTarget] = useState(false);

  const handleCreateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !targetUrl.trim()) return;

    setIsCreatingTarget(true);
    try {
      const res = await fetch("/api/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          name: targetName.trim(),
          url: targetUrl.trim(),
          environment,
        }),
      });

      if (res.ok) {
        setIsTargetModalOpen(false);
        setTargetName("");
        setTargetUrl("");
        router.refresh();
      }
    } catch {
      // Handle error
    } finally {
      setIsCreatingTarget(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsDeletingProject(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/projects");
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setIsDeletingProject(false);
      setIsDeleteProjectModalOpen(false);
    }
  };

  const handleDeleteTarget = async (targetId: string) => {
    if (!confirm("Are you sure you want to remove this target environment?")) return;
    setDeletingTargetId(targetId);
    try {
      const res = await fetch(`/api/targets/${targetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete target:", err);
    } finally {
      setDeletingTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs text-apple-muted hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus rounded px-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Header Banner */}
      <div className="p-6 bg-apple-surface border border-apple-border rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-apple-border/70">
          <div>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <p className="text-xs text-apple-muted mt-1 max-w-2xl">
              {project.description || "No project description provided."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/60 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Delete this project"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Delete Project</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedTargetUrl(project.targets[0]?.url);
                setIsAuditModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
            >
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>Run Project Audit</span>
            </button>
          </div>
        </div>

        {project.repositoryUrl && (
          <div className="pt-3">
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-mono"
            >
              <span>{project.repositoryUrl}</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      {/* Target Environments */}
      <section aria-labelledby="targets-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <h2 id="targets-heading" className="text-base font-semibold text-white">
              Target Environments ({project.targets.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsTargetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white bg-apple-elevated hover:bg-apple-subtle border border-apple-border rounded-md transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Environment</span>
          </button>
        </div>

        {project.targets.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-apple-border rounded-xl bg-apple-surface">
            <p className="text-xs text-apple-muted mb-3">
              No target environments configured yet.
            </p>
            <button
              type="button"
              onClick={() => setIsTargetModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-sm"
            >
              Add Target Environment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.targets.map((t) => (
              <div
                key={t.id}
                className="p-4 bg-apple-surface border border-apple-border rounded-xl shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white text-sm">{t.name}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-apple-elevated text-blue-300 border border-apple-border">
                      {t.environment}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-apple-muted truncate">
                    {t.url}
                  </p>
                </div>

                <div className="pt-2 border-t border-apple-border/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
                    >
                      <span>Visit Target</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      disabled={deletingTargetId === t.id}
                      onClick={() => handleDeleteTarget(t.id)}
                      className="text-apple-muted hover:text-rose-400 p-1 rounded transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
                      aria-label={`Remove environment ${t.name}`}
                      title="Remove environment"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTargetUrl(t.url);
                      setIsAuditModalOpen(true);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" aria-hidden="true" />
                    <span>Scan Target</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Project Audit Runs History */}
      <section aria-labelledby="history-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          <h2 id="history-heading" className="text-base font-semibold text-white">
            Audit Run History ({project.auditRuns.length})
          </h2>
        </div>

        {project.auditRuns.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-apple-border rounded-xl bg-apple-surface">
            <p className="text-xs text-apple-muted">
              No audits executed for this project yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-apple-border rounded-xl bg-apple-surface shadow-sm">
            <table className="w-full text-left text-xs" aria-label="Project Audit Runs">
              <thead className="bg-apple-elevated/60 text-apple-muted font-medium border-b border-apple-border">
                <tr>
                  <th scope="col" className="px-4 py-3">Audit Name</th>
                  <th scope="col" className="px-4 py-3">Target URL</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Violations</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-border/50">
                {project.auditRuns.map((a) => (
                  <tr key={a.id} className="hover:bg-apple-elevated/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      <Link
                        href={`/audits/${a.id}`}
                        className="hover:text-blue-400 underline decoration-apple-border"
                      >
                        {a.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-apple-muted truncate max-w-xs">
                      {a.targetUrl}
                    </td>
                    <td className="px-4 py-3">
                      {a.status === "COMPLETED" ? (
                        <span className="text-emerald-400 font-medium">Completed</span>
                      ) : (
                        <span className="text-rose-400 font-medium">Failed</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white">
                        {a.violationsCount} issues
                      </span>
                    </td>
                    <td className="px-4 py-3 text-apple-muted">
                      {new Date(a.startedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/audits/${a.id}`}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Target Modal */}
      <Modal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        title="Add Target Environment"
      >
        <form onSubmit={handleCreateTarget} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Environment Label <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Staging Portal"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Target URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://staging.apple.com/..."
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Environment Type
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
            >
              <option value="development">Development / Local</option>
              <option value="staging">Staging / QA</option>
              <option value="production">Production</option>
              <option value="test">Test Fixture</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-apple-border">
            <button
              type="button"
              onClick={() => setIsTargetModalOpen(false)}
              className="px-3.5 py-1.5 text-slate-300 hover:text-white rounded-md hover:bg-apple-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingTarget || !targetName.trim() || !targetUrl.trim()}
              className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md disabled:opacity-50"
            >
              {isCreatingTarget ? "Adding..." : "Add Target"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Run Audit Modal */}
      <RunAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        projects={[{ id: project.id, name: project.name }]}
        defaultProjectId={project.id}
        defaultTargetUrl={selectedTargetUrl}
      />

      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={isDeleteProjectModalOpen}
        onClose={() => setIsDeleteProjectModalOpen(false)}
        title="Delete Project Confirmation"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3 p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-rose-300">Permanent Action</p>
              <p className="mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">{project.name}</strong>? This will permanently delete all associated target environments, audit runs, findings evidence, and verification records.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-apple-border">
            <button
              type="button"
              onClick={() => setIsDeleteProjectModalOpen(false)}
              className="px-3.5 py-1.5 text-slate-300 hover:text-white rounded-md hover:bg-apple-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeletingProject}
              onClick={handleDeleteProject}
              className="px-4 py-1.5 font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors disabled:opacity-50"
            >
              {isDeletingProject ? "Deleting..." : "Confirm Delete Project"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
