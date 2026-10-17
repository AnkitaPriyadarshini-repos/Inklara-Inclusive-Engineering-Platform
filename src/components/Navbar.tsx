"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Play, FolderKanban, BookOpen, Layers, History, Volume2, Sparkles, Globe } from "lucide-react";
import { InklaraLogo } from "./brand/InklaraLogo";

interface NavbarProps {
  onOpenAuditModal?: () => void;
}

export function Navbar({ onOpenAuditModal }: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/overview", label: "Product", icon: Globe },
    { href: "/showcase", label: "Showcase", icon: Sparkles, highlight: true },
    { href: "/", label: "Dashboard", icon: ShieldCheck },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/audits", label: "Audits", icon: History },
    { href: "/screen-reader", label: "Screen Reader", icon: Volume2 },
    { href: "/wcag", label: "WCAG 2.2 Reference", icon: BookOpen },
    { href: "/fixtures", label: "Test Fixtures", icon: Layers },
  ];

  return (
    <>
      {/* WCAG 2.4.1 Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-apple-border bg-apple-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md p-1"
              >
                <InklaraLogo size="md" />
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(link.href);
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus ${
                        isActive
                          ? "bg-apple-elevated text-white border border-apple-subtle"
                          : link.highlight
                          ? "text-blue-300 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-700/60"
                          : "text-apple-muted hover:text-white hover:bg-apple-elevated/50"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.highlight ? "text-blue-400" : ""}`} aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {onOpenAuditModal && (
                <button
                  type="button"
                  onClick={onOpenAuditModal}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus"
                >
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Execute Audit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
