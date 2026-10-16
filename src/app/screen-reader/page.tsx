import React from "react";
import { Navbar } from "@/components/Navbar";
import { getAllScenarios } from "@/lib/screenreader/scenarios";
import { getVoiceOverPlatformStatus } from "@/lib/screenreader/voiceover";
import { ScreenReaderClient } from "./ScreenReaderClient";

export const dynamic = "force-dynamic";

export default async function ScreenReaderWorkbenchPage() {
  const scenarios = getAllScenarios();
  const platformStatus = await getVoiceOverPlatformStatus();

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text font-sans">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none">
        <ScreenReaderClient
          initialScenarios={scenarios}
          initialPlatformStatus={platformStatus}
        />
      </main>
    </div>
  );
}
