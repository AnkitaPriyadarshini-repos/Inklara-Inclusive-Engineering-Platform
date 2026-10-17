import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ShowcaseClient } from "./ShowcaseClient";

export const metadata: Metadata = {
  title: "Interactive Demonstration — Inklara Inclusive Engineering Platform",
  description:
    "Interactive end-to-end accessibility engineering demonstration, role-based architecture deep dives, component remediation diffs, and verified compliance workflows.",
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
