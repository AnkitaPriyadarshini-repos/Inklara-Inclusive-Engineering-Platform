import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inklara.vercel.app"),
  title: "Inklara — Inclusive Engineering Platform",
  description:
    "Inklara reveals what interfaces leave behind. Sandboxed axe-core automation, Screen-Reader Testing Workbench, and continuous WCAG 2.2 Level AA verification.",
  icons: {
    icon: "/favicon.svg",
    apple: "/brand/inklara-symbol.svg",
  },
  openGraph: {
    title: "Inklara — Inclusive Engineering Platform",
    description:
      "Inklara reveals what interfaces leave behind. Sandboxed axe-core automation, Screen-Reader Testing Workbench, and continuous WCAG 2.2 Level AA verification.",
    url: "https://inklara.vercel.app",
    siteName: "Inklara",
    images: [
      {
        url: "/brand/inklara-social-preview.png",
        width: 1200,
        height: 630,
        alt: "Inklara Inclusive Engineering Platform — Discover, Understand, Remediate, Verify",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inklara — Inclusive Engineering Platform",
    description:
      "Inklara reveals what interfaces leave behind. Continuous accessibility verification and developer tooling.",
    images: ["/brand/inklara-social-preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
