import React from "react";
import type { Metadata } from "next";
import OverviewPage, { metadata as overviewMetadata } from "../overview/page";

export const metadata: Metadata = {
  ...overviewMetadata,
  title: "Product Overview | Inklara Inclusive Engineering Platform",
};

export default function ProductPage() {
  return <OverviewPage />;
}
