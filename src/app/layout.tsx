import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inklara — Inclusive Engineering Platform | Accessibility Workbench",
  description:
    "Production-grade accessibility engineering workbench. Automated axe-core scanning, screen-reader scenario testing, guided manual evaluation, remediation tracking, and regression analysis.",
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
      </head>
      <body className="min-h-screen bg-apple-canvas text-apple-text antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
