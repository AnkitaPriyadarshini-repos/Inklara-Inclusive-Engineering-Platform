"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Play,
  Sparkles,
  Globe,
  Code2,
  ExternalLink,
  Menu,
  X,
  Layers,
  History,
  FolderKanban,
  Volume2,
  BookOpen,
} from "lucide-react";
import { InklaraLogo } from "./brand/InklaraLogo";

interface NavbarProps {
  onOpenAuditModal?: () => void;
}

export function Navbar({ onOpenAuditModal }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNav = [
    { href: "/overview", label: "Product Overview", icon: Globe },
    { href: "/#features", label: "Features", icon: Layers },
    { href: "/showcase", label: "Interactive Showcase", icon: Sparkles, highlight: true },
    { href: "/#workbench", label: "Workbench", icon: FolderKanban },
  ];

  const toolsNav = [
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/audits", label: "Audits", icon: History },
    { href: "/screen-reader", label: "Screen Reader", icon: Volume2 },
    { href: "/wcag", label: "WCAG 2.2", icon: BookOpen },
    { href: "/fixtures", label: "Fixtures", icon: Layers },
  ];

  return (
    <>
      {/* WCAG 2.4.1 Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#07090e]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-md p-1"
              >
                <InklaraLogo size="md" />
              </Link>

              {/* Desktop Primary Navigation */}
              <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
                {primaryNav.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                        isActive
                          ? "bg-slate-800 text-white border border-slate-700"
                          : link.highlight
                          ? "text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-700/60"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.highlight ? "text-indigo-300" : "text-slate-400"}`} aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                <a
                  href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Code2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
                </a>
              </nav>
            </div>

            {/* Right Side: Quick Action + Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              {onOpenAuditModal ? (
                <button
                  type="button"
                  onClick={onOpenAuditModal}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Execute Audit</span>
                </button>
              ) : (
                <Link
                  href="/showcase"
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Try Showcase</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#07090e] px-4 pt-3 pb-5 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2">Navigation</span>
              {primaryNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 rounded-lg"
                >
                  <link.icon className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <a
                href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 rounded-lg"
              >
                <Code2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
              </a>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2">Workspace Tools</span>
              {toolsNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 rounded-lg"
                >
                  <link.icon className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
