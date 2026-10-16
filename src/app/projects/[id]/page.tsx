import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { ProjectDetailClient } from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: {
      targets: { orderBy: { createdAt: "asc" } },
      auditRuns: { orderBy: { startedAt: "desc" } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none">
        <ProjectDetailClient project={project} />
      </main>
    </div>
  );
}
