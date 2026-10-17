import React from "react";
import type { Metadata } from "next";
import { OverviewClient } from "./OverviewClient";

export const metadata: Metadata = {
  title: "Inklara A11y Audit Tool — Product Overview",
  description:
    "Your comprehensive solution for desktop, mobile, and web apps accessibility testing and report generation. Inspired by Snowdog's a11y audit tool.",
  openGraph: {
    title: "Inklara A11y Audit Tool — Product Overview",
    description:
      "Your comprehensive solution for desktop, mobile, and web apps accessibility testing and report generation.",
    url: "https://inklara.vercel.app/overview",
    siteName: "Inklara",
    images: [
      {
        url: "https://inklara.vercel.app/brand/inklara-social-preview.png",
        width: 1200,
        height: 630,
        alt: "Inklara A11y Audit Tool — Comprehensive Accessibility Engineering",
      },
    ],
  },
};

export default function OverviewPage() {
  return <OverviewClient />;
}
