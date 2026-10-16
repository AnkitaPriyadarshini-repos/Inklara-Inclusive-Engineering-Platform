import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ShowcaseClient } from "./ShowcaseClient";

export const metadata: Metadata = {
  title: "Recruiter Showcase — Inklara Inclusive Engineering Platform",
  description:
    "Interactive 60-second end-to-end accessibility engineering demonstration, architectural blueprints, role-specific engineering deep dives, and live verification workflows.",
};

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <ShowcaseClient />
      </main>
    </div>
  );
}
