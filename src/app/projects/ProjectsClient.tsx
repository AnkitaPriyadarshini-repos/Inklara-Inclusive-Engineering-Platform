"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { Plus, FolderKanban, ArrowRight, ExternalLink } from "lucide-react";
import type { Project, Target, AuditRun } from "@prisma/client";

interface ProjectWithStats extends Project {
  targets: Target[];
  auditRuns: AuditRun[];
}

interface ProjectsClientProps {
  projects: ProjectWithStats[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          repositoryUrl: repositoryUrl.trim() || undefined,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setName("");
        setDescription("");
        setRepositoryUrl("");
        router.refresh();
      }
    } catch {
      // Handle error
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-apple-border">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Projects</h1>
          <p className="text-xs text-apple-muted mt-0.5">
            Manage tracked applications, environments, and team repositories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-apple-border rounded-xl bg-apple-surface">
          <FolderKanban className="w-10 h-10 text-apple-muted mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">No Projects Registered</h2>
          <p className="text-xs text-apple-muted max-w-sm mx-auto mt-1 mb-4">
            Create an audit project to organize web applications and target environments.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-5 bg-apple-surface border border-apple-border rounded-xl shadow-sm flex flex-col justify-between space-y-4 hover:border-apple-subtle transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-white text-base">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-blue-400 focus-visible:ring-1 focus-visible:ring-apple-focus rounded"
                    >
                      {project.name}
                    </Link>
                  </h2>
                </div>

                <p className="text-xs text-apple-muted line-clamp-3 mb-4">
                  {project.description || "No description provided."}
                </p>

                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-mono mb-3"
                  >
                    <span>Repository</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {project.targets.map((t) => (
                    <span
                      key={t.id}
                      className="text-[10px] px-2 py-0.5 rounded bg-apple-elevated text-slate-300 border border-apple-border"
                    >
                      {t.name} ({t.environment})
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-apple-border flex items-center justify-between text-xs">
                <span className="text-apple-muted">
                  {project.auditRuns.length} Total Audits
                </span>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-apple-focus rounded"
                >
                  <span>Open Project</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Global Design System & Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Application purpose, user journeys, accessibility goals..."
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Repository URL (Optional)
            </label>
            <input
              type="url"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/apple/..."
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-apple-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 text-slate-300 hover:text-white rounded-md hover:bg-apple-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
