import React from "react";
import type { Metadata } from "next";
import OverviewPage, { metadata as overviewMetadata } from "../overview/page";

export const metadata: Metadata = {
  ...overviewMetadata,
  title: "A11y Audit Tool | Inklara Product Overview",
};

export default function ProductPage() {
  return <OverviewPage />;
}
