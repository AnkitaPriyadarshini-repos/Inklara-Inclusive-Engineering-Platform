"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { RunAuditModal } from "@/components/RunAuditModal";
import { Modal } from "@/components/Modal";
import { Plus, Sparkles, Loader2 } from "lucide-react";

interface DashboardClientProps {
  projects: Array<{ id: string; name: string }>;
}

export function DashboardClient({ projects }: DashboardClientProps) {
  const router = useRouter();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  React.useEffect(() => {
    const handleOpenAudit = () => setIsAuditModalOpen(true);
    const handleOpenProject = () => setIsProjectModalOpen(true);

    window.addEventListener("inklara:open-audit", handleOpenAudit);
    window.addEventListener("inklara:open-project", handleOpenProject);

    return () => {
      window.removeEventListener("inklara:open-audit", handleOpenAudit);
      window.removeEventListener("inklara:open-project", handleOpenProject);
    };
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreatingProject(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDesc.trim() || undefined,
          repositoryUrl: newRepoUrl.trim() || undefined,
        }),
      });

      if (res.ok) {
        setIsProjectModalOpen(false);
        setNewProjectName("");
        setNewProjectDesc("");
        setNewRepoUrl("");
        router.refresh();
      }
    } catch {
      // Fallback
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <>
      <Navbar onOpenAuditModal={() => setIsAuditModalOpen(true)} />

      {/* Run Audit Modal */}
      <RunAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        projects={projects}
      />

      {/* New Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Audit Project"
        description="Organize environments, baseline audits, and remediation workflows."
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <div>
            <label htmlFor="modal-project-name" className="block font-semibold text-slate-300 mb-1">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              id="modal-project-name"
              type="text"
              required
              placeholder="e.g. Enterprise Cloud Console"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none"
            />
          </div>

          <div>
            <label htmlFor="modal-project-desc" className="block font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="modal-project-desc"
              rows={3}
              placeholder="High-level description of application scope and user journeys..."
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="modal-project-repo" className="block font-semibold text-slate-300 mb-1">
              Repository URL (Optional)
            </label>
            <input
              id="modal-project-repo"
              type="url"
              placeholder="https://github.com/org/repo"
              value={newRepoUrl}
              onChange={(e) => setNewRepoUrl(e.target.value)}
              className="w-full bg-apple-elevated border border-apple-border text-white rounded-lg px-3 py-2 focus-visible:ring-2 focus-visible:ring-apple-focus outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-apple-border">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-3.5 py-1.5 text-slate-300 hover:text-white rounded-md hover:bg-apple-elevated transition-colors focus-visible:ring-1 focus-visible:ring-apple-focus"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingProject || !newProjectName.trim()}
              className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus disabled:opacity-50"
            >
              {isCreatingProject ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
