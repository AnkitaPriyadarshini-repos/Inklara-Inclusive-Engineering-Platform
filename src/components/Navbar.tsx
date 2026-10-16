"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Play, FolderKanban, BookOpen, Layers, History, Volume2 } from "lucide-react";

interface NavbarProps {
  onOpenAuditModal?: () => void;
}

export function Navbar({ onOpenAuditModal }: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
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
                className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-apple-focus rounded-md p-1"
                aria-label="Inklara Home — Inclusive Engineering Platform"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                    Inklara
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                      Platform
                    </span>
                  </span>
                  <span className="text-[11px] text-apple-muted block -mt-0.5">
                    Inclusive Engineering &amp; Verification
                  </span>
                </div>
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
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-apple-focus ${
                        isActive
                          ? "bg-apple-elevated text-white border border-apple-subtle"
                          : "text-apple-muted hover:text-white hover:bg-apple-elevated/50"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
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
