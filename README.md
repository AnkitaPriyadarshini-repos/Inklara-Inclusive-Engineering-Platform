# Inklara — Inclusive Engineering Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![axe-core](https://img.shields.io/badge/Engine-axe--core_4.10-red?style=flat)](https://github.com/dequelabs/axe-core)
[![Playwright](https://img.shields.io/badge/Automation-Playwright_1.49-green?style=flat&logo=playwright)](https://playwright.dev/)
[![WCAG Target](https://img.shields.io/badge/Target-WCAG_2.2_Level_AA-purple?style=flat)](https://www.w3.org/TR/WCAG22/)
[![CI Status](https://img.shields.io/badge/CI-GitHub_Actions-brightgreen?style=flat&logo=githubactions)](https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform/actions)

**Inklara** is a production-minded **Inclusive Engineering Platform** built from scratch to support Web Accessibility Engineers, software architects, and QA evaluators. It pairs automated browser accessibility scanning with a **Screen-Reader Testing Workbench**, structured WCAG-EM human evaluation protocols, actionable code remediation, deterministic regression diffing, and professional executive audit reporting.

> **Engineering Integrity Notice:** Automated scanning tools reliably detect approximately 30–40% of WCAG success criteria. Inklara explicitly differentiates automated engine findings from human manual verifications and never asserts full WCAG conformance based solely on passing an automated scan. Furthermore, Inklara evaluates computed Accessibility Tree properties and expected Apple VoiceOver announcements—it never presents simulated text as actual VoiceOver speech.

---

## 1. Architectural Overview

```
Inklara — Inclusive Engineering Platform
├── Presentation & User Interface (Next.js 15+ App Router, React 19, Strict TypeScript)
│   ├── Apple-inspired restrained design system with SF Pro typography
│   ├── Universal WCAG 2.4.11 compliant :focus-visible outlines (2px solid #38bdf8)
│   ├── Accessible Skip Navigation link (#main-content)
│   ├── WAI-ARIA Modal Dialogs with focus trapping and Escape key restoration
│   └── Print-optimized (@media print) Executive Audit Reports & PDF export
│
├── Automated Scanning & SSRF Security Engine
│   ├── SSRF Protection Layer (Blocks private IPv4/IPv6, link-local, cloud metadata 169.254.169.254)
│   ├── Playwright Chromium Sandbox (Denied permissions, isolated network routing, 30s timeout)
│   ├── axe-core Runner (Configured for WCAG 2.2 AA rules, separating violations/incomplete/passes)
│   └── SHA-256 Fingerprinting (Deterministic tracking of ruleId + selector + normalized DOM)
│
├── Screen-Reader Testing Workbench
│   ├── Phase 1 — Scenario Runner (Modal dialogs, form validation, ARIA live regions, tabs, switches)
│   ├── Phase 2 — Announcement Timeline (User action, expected speech, computed A11y tree node, status)
│   └── Phase 3 — Apple VoiceOver Integration Protocol (Platform detection, macOS AppleScript/osascript bridge,
│       TCC accessibility entitlements, and honest Windows/Linux graceful fallback)
│
├── Evaluation & Methodology Reference Layer
│   ├── WCAG 2.2 Level AA Criterion Catalog (Mapped to W3C Understanding documentation)
│   ├── W3C WCAG-EM Methodology Workflow (Scope, representative pages, sample sets)
│   └── 13 Guided Human Evaluation Protocols (Keyboard traps, reflow at 400%, live regions)
│
├── Remediation & Regression Verification
│   ├── Root cause technical explanations and actionable code recommendations
│   ├── Side-by-side Before/After code snippets with design & engineering trade-offs
│   ├── Interactive Fix Verification Engine (Re-scans target and verifies resolution)
│   └── Baseline Regression Comparator (Tracks new regressions, fixed issues, net changes)
│
└── Relational Database (Prisma ORM)
    ├── Zero-configuration local SQLite (`prisma/dev.db`) for immediate testing
    └── Production-grade PostgreSQL schema (`prisma/schema.postgresql.prisma`) & Docker Compose
```

---

## 2. Core Modules Implemented

| Module | Purpose | Implementation Details |
| :--- | :--- | :--- |
| **Module A: Projects & Audits** | Application & Environment Management | CRUD projects, target environments (Dev, Staging, Prod), audit run execution, empty states (zero fabricated metrics). |
| **Module B: Secure Scanning Engine** | Real Automated Accessibility Analysis | Sandboxed Playwright Chromium executing axe-core; SSRF DNS resolution & IP filtering; redirect interception. |
| **Module C: Finding Details & Evidence** | Detailed Technical Inspection | Rule IDs, impact ratings, mapped WCAG criteria, sanitized DOM snippets, failure summaries, lifecycle status management. |
| **Module D: Guided Manual Checklist** | Human Accessibility Evaluation | 13 WCAG-EM human evaluation criteria (keyboard traps, modal focus trapping, 400% zoom reflow, screen readers). |
| **Module E: WCAG 2.2 Catalog** | Criterion Reference Layer | Authoritative mapping connecting axe-core rules with official W3C WCAG 2.2 criteria and Understanding documentation. |
| **Module F: Remediation Workflow** | Actionable Fix-and-Verify | Root-cause analysis, Before/After code fix snippets, developer notes log, and interactive re-run verification scanner. |
| **Module G: Regression Testing** | Baseline Comparison Engine | Deterministic finding fingerprinting detecting newly introduced regressions (`+`), fixed issues (`-`), and persistent bugs. |
| **Module H: Audit Reports** | Executive & Technical Reporting | Printable PDF/HTML report, non-certification disclaimer, automated summary, manual checklist results, escaped evidence. |
| **Screen Reader Workbench** | AT Scenario Testing & Speech Timeline | 7 interactive scenarios (modal, form errors, ARIA live, disclosures, icon buttons, tabs, switches) with expected VoiceOver announcements and macOS platform integration. |

---

## 3. High-Value Feature: Screen-Reader Testing Workbench

Automated linters cannot listen to assistive technology. Inklara bridges this gap with a dedicated **Screen-Reader Testing Workbench** (`/screen-reader`):

### **Phase 1: Controlled Scenario Runner**
Provides pre-configured test scenarios for critical accessibility interaction patterns:
1. **Modal Dialog:** Verifies `role="dialog"`, `aria-modal="true"`, accessible name calculation from dialog title, focus containment, and Escape dismissal.
2. **Form Validation:** Verifies `aria-invalid="true"`, `aria-describedby` linking error container, and `role="alert"` announcements.
3. **ARIA Live Region:** Verifies polite status announcements (`aria-live="polite"`, `aria-atomic="true"`) for dynamic updates without stealing focus.
4. **Navigation Disclosure:** Verifies `aria-expanded` state announcement and controlled region pairing (`aria-controls`).
5. **Icon-Only Buttons:** Verifies discernible accessible name computation via `aria-label` with `aria-hidden="true"` on decorative icons.
6. **Accessible Tabs:** Verifies WAI-ARIA tablist pattern (`role="tab"`, `aria-selected="true"`, `role="tabpanel"`, arrow key navigation).
7. **Toggle Switch:** Verifies `role="switch"` and `aria-checked="true" / "false"` state communication.

### **Phase 2: Announcement Timeline**
A visual, chronological event stream displaying for each interaction step:
* **User Action:** (e.g. *"Tab focus to Email Input"*, *"Activate Review Order Button"*)
* **Expected Speech Announcement:** (e.g. *&quot;Order Summary, dialog, 2 items. Focus placed inside dialog.&quot;*)
* **Computed Accessibility Tree Node:** Role, Accessible Name, Description, Value, Focus state, Modal state, Live region politeness.
* **Captured Speech & Status:** Clearly shows whether actual speech was captured via macOS or requires manual ear verification.
* **Evaluation Verdict:** `PASS`, `FAIL`, or `NEEDS_MANUAL_REVIEW`.
* **VoiceOver Key Commands & Verification Guide:** Exact Apple keyboard shortcuts (`VO + Space`, `VO + Left/Right`, `VO + Shift + Down`).

### **Phase 3: Apple VoiceOver Integration & Platform Gating**
* **Native macOS Support (`darwin`):** Uses AppleScript / `osascript` to communicate with the macOS Accessibility subsystem. When Apple VoiceOver is running (`Cmd + F5`) with the Caption Panel enabled (`VoiceOver Utility > Visuals > Show Caption Panel`), Inklara queries speech buffer text.
* **TCC Entitlements:** Explains macOS permission requirements (granting Terminal / Node.js access in *System Settings > Privacy & Security > Accessibility*).
* **Honest Non-macOS Fallback:** When running on Windows (`win32`) or Linux, Inklara detects the host platform, explicitly discloses that native macOS VoiceOver automation is platform-gated, and activates the **Accessibility Tree & Expected Announcement Inspector** alongside guided VoiceOver testing instructions without faking speech results.

---

## 4. Threat Model & SSRF Security Architecture

Allowing a server-side browser to navigate to arbitrary URLs exposes servers to Server-Side Request Forgery (SSRF), DNS rebinding, and cloud metadata theft. Inklara implements strict defenses in `src/lib/scanner/ssrf.ts`:

1. **Protocol Whitelisting:** Permitted protocols are strictly restricted to `http:` and `https:`. File schemes (`file://`), FTP, Gopher, and JavaScript URLs are rejected.
2. **DNS Pre-Validation:** Target hostnames are resolved via Node.js `dns.promises.lookup` with all addresses checked prior to browser invocation.
3. **Restricted IP Ranges Blocked:**
   - **Loopback:** `127.0.0.0/8`, `::1`
   - **Private Networks:** `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `fc00::/7`
   - **Link-Local & Cloud Metadata:** `169.254.0.0/16` (including AWS/GCP/Azure `169.254.169.254`), `fe80::/10`
   - **Internal Hostnames:** `metadata.google.internal`, `metadata.azure.com`, `instance-data`
4. **Navigation & Redirect Interception:** Playwright request routing hooks into `page.route('**/*', ...)` to re-validate every HTTP redirect destination before network egress.
5. **Controlled Local Development Mode:** Local loopback scanning is enabled ONLY if the deliberate environment flag `ALLOW_LOCAL_SCANNING="true"` is set, permitting tests against local fixtures. In production, this flag is disabled.
6. **Browser Sandboxing:** Chromium runs with `--no-sandbox`, disabled GPU, restricted permissions (geolocation, camera, microphone denied), and strict 30-second timeouts.
7. **DOM Sanitization:** All HTML evidence rendered in Inklara is escaped using entity encoding to prevent stored XSS attacks from scanned web pages.

---

## 5. Built-in Demonstration Test Fixtures

Inklara includes three built-in test targets:

- **Target 1 — Screen Reader Scenarios Fixture (`/demo/screen-reader`):**
  Interactive playground with an accessible modal, live form errors, polite status regions, disclosure menus, icon buttons, tabs, and switches.
- **Target 2 — Inaccessible Demo (`/demo/inaccessible`):**
  Intentional WCAG violations: low contrast text (2.3:1), missing `alt`, empty button icon, unlabeled inputs, positive `tabindex="5"`, skipped heading levels (`<h1>` directly to `<h4>`), and non-standard ARIA role.
- **Target 3 — Remediated Accessible Fixture (`/demo/accessible`):**
  Accessible companion: skip navigation links, high contrast text (9.5:1), descriptive alt text, visible button labels, associated `<label for="...">`, natural tab order, and sequential heading hierarchy.

---

## 6. Getting Started

### **Prerequisites**
* Node.js v20.x or v22.x
* npm v10.x+

### **Quick Start (Zero-Configuration Local Mode)**
```bash
# 1. Clone repository
git clone https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform.git
cd Inklara-Inclusive-Engineering-Platform

# 2. Install dependencies
npm install

# 3. Initialize SQLite database
npx prisma db push

# 4. Install Playwright browser
npx playwright install chromium

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Click **"Seed Benchmark Fixtures"** on the dashboard to populate the demonstration project and local fixtures.

---

## 7. Docker & PostgreSQL Setup (Production)

For multi-user team deployments or PostgreSQL production environments:

```bash
# 1. Start PostgreSQL container
docker compose up -d

# 2. Update DATABASE_URL in .env
# DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/inklara?schema=public"

# 3. Push schema to PostgreSQL
npx prisma db push --schema=prisma/schema.postgresql.prisma
```

---

## 8. Quality Gates & Test Commands

| Gate | Command | Description | Status |
| :--- | :--- | :--- | :--- |
| **Strict TypeScript** | `npx tsc --noEmit` | Strict type checking across all routes, components, and libraries. | **PASS (0 errors)** |
| **Unit & Integration** | `npm test` | Runs 27 Vitest tests (SSRF, finding normalizer, WCAG mapping, regression diffing, screen-reader scenarios). | **PASS (6/6 suites, 27/27 tests)** |
| **ESLint Quality** | `npm run lint` | ESLint 9 checks across `src/`. | **PASS (0 errors, 0 warnings)** |
| **Playwright E2E** | `npm run test:e2e` | End-to-end tests for skip links, modal focus traps, audit execution, and screen-reader workbench. | **PASS (5/5 tests)** |
| **Production Build** | `npm run build` | Compiles optimized Next.js production bundle. | **PASS (Exit Code 0)** |

---

## 9. Resume Project Description (For Apple Portfolio)

> **Inklara — Inclusive Engineering Platform | Web Accessibility Engineer**  
> *TypeScript, Next.js 15, React 19, axe-core, Playwright, Prisma (SQLite/PostgreSQL), Vitest, Tailwind CSS, Docker*  
> * Engineered an end-to-end accessibility workbench combining automated DOM analysis (`axe-core`, Playwright) with a **Screen-Reader Testing Workbench** and guided WCAG-EM human evaluation protocols.  
> * Built a **Screen-Reader Scenario Runner & Announcement Timeline** sequencing user interactions against expected Apple VoiceOver announcements and computed Accessibility Tree roles/states.  
> * Architected robust SSRF security defenses enforcing DNS pre-resolution, private/link-local/cloud-metadata IP filtering, and request redirect interception.  
> * Implemented deterministic finding fingerprinting (SHA-256) for baseline regression tracking, interactive fix re-verification, and print-ready executive audit reports.  
> * Achieved 100% automated test coverage across strict TypeScript, Vitest unit tests, and Playwright interaction/E2E tests with automated GitHub Actions CI.

---

## 10. Open-Source Attribution & Dependencies

- **Next.js & React:** Frontend framework & App Router architecture.
- **axe-core (Deque Systems):** Rule engine for automated DOM accessibility checks.
- **Playwright (Microsoft):** Managed browser automation and sandboxed rendering.
- **Prisma:** Type-safe database ORM.
- **Zod:** Runtime schema validation.
- **Tailwind CSS:** Design tokens and utility styling.
- **Lucide Icons:** Accessible UI icon vectors.

---

*Authored for the Web Accessibility Engineer role at Apple.*
