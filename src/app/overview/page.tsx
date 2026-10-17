import React from "react";
import type { Metadata } from "next";
import { OverviewClient } from "./OverviewClient";

export const metadata: Metadata = {
  title: "Product Overview — Inklara Inclusive Engineering Platform",
  description:
    "Comprehensive accessibility verification platform for desktop, mobile, and web applications. Automated browser testing, guided WCAG-EM human evaluation, and regression tracking.",
  openGraph: {
    title: "Product Overview — Inklara Inclusive Engineering Platform",
    description:
      "Comprehensive accessibility verification platform for desktop, mobile, and web applications. Automated browser testing, guided WCAG-EM human evaluation, and continuous verification.",
    url: "https://inklara.vercel.app/overview",
    siteName: "Inklara",
    images: [
      {
        url: "https://inklara.vercel.app/brand/inklara-social-preview.png",
        width: 1200,
        height: 630,
        alt: "Inklara Inclusive Engineering Platform — Product Overview",
      },
    ],
  },
};

export default function OverviewPage() {
  return <OverviewClient />;
}
