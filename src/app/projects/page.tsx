import React from "react";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { ProjectsClient } from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await db.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        targets: true,
        auditRuns: {
          orderBy: { startedAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Database unavailable on projects page:", error);
  }

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none">
        <ProjectsClient projects={projects} />
      </main>
    </div>
  );
}
