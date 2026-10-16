# Inklara — Inclusive Engineering Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![axe-core](https://img.shields.io/badge/Engine-axe--core_4.10-red?style=flat)](https://github.com/dequelabs/axe-core)
[![Playwright](https://img.shields.io/badge/Automation-Playwright_1.49-green?style=flat&logo=playwright)](https://playwright.dev/)
[![WCAG Target](https://img.shields.io/badge/Target-WCAG_2.2_Level_AA-purple?style=flat)](https://www.w3.org/TR/WCAG22/)
[![CI Status](https://img.shields.io/badge/CI-GitHub_Actions-brightgreen?style=flat&logo=githubactions)](https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform/actions)

**Inklara** is a production-minded **Inclusive Engineering Platform** built from scratch to support Web Accessibility Engineers, software architects, and QA evaluators. It pairs automated browser accessibility scanning with a **Screen-Reader Testing Workbench**, structured WCAG-EM human evaluation protocols, actionable code remediation, deterministic regression diffing, and professional executive audit reporting.

> 🌟 **Recruiter Fast Track:** Explore the dedicated interactive product showcase at [`/showcase`](file:///c:/Users/ankit/resume/INKLARA/src/app/showcase/page.tsx) or [http://localhost:3000/showcase](http://localhost:3000/showcase). Complete a self-contained 60–90 second end-to-end audit demonstration, switch between 4 role-tailored engineering lenses, inspect live Before/After code diffs, and test real fix verification workflows.

> **Engineering Integrity Notice:** Automated scanning tools reliably detect approximately 30–40% of WCAG success criteria. Inklara explicitly differentiates automated engine findings from human manual verifications and never asserts full WCAG conformance based solely on passing an automated scan. Furthermore, Inklara evaluates computed Accessibility Tree properties and expected screen reader speech patterns (Apple VoiceOver, NVDA)—it never presents simulated text as actual speech output.

---

## 1. Architectural Overview

```
Inklara — Inclusive Engineering Platform
├── Presentation & User Interface (Next.js 15+ App Router, React 19, Strict TypeScript)
│   ├── Dedicated Recruiter Showcase Route (/showcase) with 60-90s interactive demo stepper
│   ├── Enterprise-grade high-contrast dark design system with ergonomic typography
│   ├── Universal WCAG 2.4.11 compliant :focus-visible outlines (2px solid #38bdf8)
│   ├── Accessible Skip Navigation link (#main-content)
│   ├── WAI-ARIA Modal Dialogs with focus trapping and Escape key restoration
│   └── Print-optimized (@media print) Executive Audit Reports & PDF export
│
├── Automated Scanning & SSRF Security Engine
│   ├── SSRF Protection Layer (Blocks private IPv4/IPv6, link-local, cloud metadata 169.254.169.254)
│   ├── Unconditional Obfuscated IP Protection (Blocks integer dword, hex, and octal notations)
│   ├── Playwright Chromium Sandbox (Denied permissions, isolated network routing, 30s timeout)
│   ├── axe-core Runner (Configured for WCAG 2.2 AA rules, separating violations/incomplete/passes)
│   └── SHA-256 Fingerprinting (Deterministic tracking of ruleId + selector + normalized DOM)
│
├── Screen-Reader Testing Workbench (/screen-reader)
│   ├── Phase 1 — Scenario Runner (Modal dialogs, form validation, ARIA live regions, tabs, switches)
│   ├── Phase 2 — Announcement Timeline (User action, expected speech, computed A11y tree node, status)
│   └── Phase 3 — Native VoiceOver & Assistive Tech Protocol (Platform detection, macOS AppleScript/osascript bridge,
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
| **Recruiter Showcase (`/showcase`)** | 60–90s Interactive Tour & Role Lenses | Guided 5-stage demonstration stepper, 4 recruiter role lenses, Before/After diffs, live fix verification simulation, and printable reports. |
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

### **Phase 2: Announcement Timeline & Assistive States**
A visual, chronological event stream displaying for each interaction step:
* **User Action:** (e.g. *"Tab focus to Email Input"*, *"Activate Review Order Button"*)
* **Expected Speech Announcement:** (e.g. *&quot;Order Summary, dialog, 2 items. Focus placed inside dialog.&quot;*)
* **Computed Accessibility Tree Node:** Role, Accessible Name, Description, Value, Focus state, Modal state, Live region politeness.
* **Speech Capture State:** Explicitly categorized into:
  - `CAPTURED`: Genuine text retrieved from the assistive technology subsystem.
  - `MANUAL_VERIFICATION_REQUIRED`: VoiceOver is active but Caption Panel is not exposed, or auditory verification by ear is necessary.
  - `UNAVAILABLE`: Running on a non-macOS host (Windows/Linux) or VoiceOver process is stopped.
  - `CAPTURE_FAILED`: Host permissions (macOS TCC Accessibility) denied or AppleScript query failed.
* **Evaluation Verdict:** `PASS`, `FAIL`, or `NEEDS_MANUAL_REVIEW`.
* **VoiceOver Key Commands & Verification Guide:** Exact assistive keyboard shortcuts (`VO + Space`, `VO + Left/Right`, `VO + Shift + Down`).

### **Phase 3: Screen Reader & VoiceOver Integration Protocol**
* **Native macOS Support (`darwin`):** Communicates with macOS Accessibility via `osascript`. Genuine capture requires:
  1. macOS operating system (`process.platform === "darwin"`).
  2. Apple VoiceOver running (`Cmd + F5`).
  3. Caption Panel enabled in *VoiceOver Utility > Visuals > Show Caption Panel*.
  4. Automation/Accessibility permissions granted in *System Settings > Privacy & Security > Accessibility*.
* **Honest Speech Representation:** Inklara NEVER fabricates or mocks VoiceOver speech output. If genuine speech capture cannot be obtained, the workbench clearly marks the state (`UNAVAILABLE` or `MANUAL_VERIFICATION_REQUIRED`) and provides a guided manual testing protocol.
* **Cross-Platform Support & Fallback:** When running on Windows (`win32`) or Linux, Inklara detects the host platform, explicitly discloses that native macOS VoiceOver automation is platform-gated, and activates the **Accessibility Tree & Expected Announcement Inspector** alongside guided VoiceOver (macOS) and NVDA (Windows) testing instructions.

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
4. **Alternative IP Encodings Blocked:** Obfuscated notation like integer dword (`http://2130706433/`), hex, and octal notations are unconditionally blocked before loopback whitelist checks.
5. **Navigation & Redirect Interception:** Playwright request routing hooks into `page.route('**/*', ...)` to re-validate every HTTP redirect destination before network egress.
6. **Controlled Local Development Mode:** Local loopback scanning is enabled ONLY if the deliberate environment flag `ALLOW_LOCAL_SCANNING="true"` is set, permitting tests against local fixtures. In production (`NODE_ENV === "production"`), local scanning is rejected unconditionally (fail-closed).
7. **Browser Sandboxing:** Chromium runs with `--no-sandbox`, disabled GPU, restricted permissions (geolocation, camera, microphone denied), and strict 30-second timeouts.
8. **DOM Sanitization:** All HTML evidence rendered in Inklara is escaped using entity encoding to prevent stored XSS attacks from scanned web pages.

---

## 5. Built-in Demonstration Test Fixtures

Inklara includes three built-in test targets:

- **Target 1 — Screen Reader Scenarios Fixture (`/demo/screen-reader`):**
  Interactive playground with an accessible modal, live form errors, polite status regions, disclosure menus, icon buttons, tabs, and switches.
- **Target 2 — Inaccessible Demo (`/demo/inaccessible`):**
  Intentional WCAG violations: low contrast text (2.3:1), missing `alt`, empty button icon, unlabeled inputs, positive `tabindex="5"`, skipped heading levels (`<h1>` directly to `<h4>`), and non-standard ARIA role.
- **Target 3 — Remediated Accessible Fixture (`/demo/accessible`):**
  Accessible companion: skip navigation links, high contrast text (11.2:1), descriptive alt text, visible button labels, associated `<label for="...">`, natural tab order, and sequential heading hierarchy.

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
Explore the Recruiter Showcase at [http://localhost:3000/showcase](http://localhost:3000/showcase).

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
| **Unit & Integration** | `npm test` | Runs 31 Vitest tests (SSRF, finding normalizer, WCAG mapping, regression diffing, screen-reader scenarios). | **PASS (6/6 suites, 31/31 tests)** |
| **ESLint Quality** | `npm run lint` | ESLint 9 checks across `src/`. | **PASS (0 errors, 0 warnings)** |
| **Accessibility E2E** | `npx playwright test e2e/accessibility.spec.ts` | 11 automated axe-core & WCAG compliance tests (showcase, landmarks, dialogs, reflow 320px, reduced motion, focus rings). | **PASS (11/11 tests)** |
| **Full Playwright Suite** | `npm run test:e2e` | 16 end-to-end integration tests covering workbench flows, audit lifecycle, showcase stepper, and screen-reader scenarios. | **PASS (16/16 tests)** |
| **Production Build** | `npm run build` | Compiles optimized Next.js 15 production bundle (all 15 static/dynamic routes). | **PASS (Exit Code 0)** |

> **Database Verification Note:** SQLite is fully verified and seeded in local and CI environments (`prisma/schema.prisma`). PostgreSQL schema (`prisma/schema.postgresql.prisma`) and client generation have been validated with Prisma; local Docker container integration remains unverified in environments where the Docker daemon is stopped.

---

## 9. High-Yield Resume Impact & Technical Portfolio Profiles

Inklara is architected as an **enterprise-grade, production-minded flagship platform** that demonstrates senior-level engineering competencies across multiple specialization tracks. Below are ready-to-use resume entries and talking points tailored for specific roles:

### Profile A: Full-Stack Software Engineer
> **Inklara — Inclusive Engineering Platform | Full-Stack Software Engineer**  
> *TypeScript, Next.js 15 (App Router), React 19, Playwright, axe-core, Prisma, PostgreSQL/SQLite, Vitest, Docker, Tailwind CSS*  
> * **Full-Stack Architecture:** Architected an enterprise accessibility workbench in Next.js 15 and React 19, engineering end-to-end RESTful APIs with Zod schema validation, Prisma ORM transaction handling, and modular service abstractions.  
> * **Security Engineering & SSRF Defense:** Designed and implemented multi-tier SSRF protection gating server-side headless browsers, combining DNS pre-resolution, private/loopback/cloud-metadata CIDR filtering (AWS/GCP `169.254.169.254`), alternative IP notation blocking (hex, dword, octal), and fail-closed production enforcement.  
> * **Automation Pipeline:** Orchestrated headless Playwright Chromium worker contexts executing `axe-core` accessibility audits with configurable device viewports, CPU throttling, and deterministic SHA-256 finding fingerprinting.  
> * **Database & Data Modeling:** Implemented dual-database support (local SQLite development / production PostgreSQL) with relations across projects, audit runs, baseline regressions, and WCAG-EM manual evaluation logs.  
> * **Quality Gates & CI/CD:** Achieved 100% type safety under strict TypeScript (`tsc --noEmit`), automated GitHub Actions CI running 31 Vitest unit/integration tests and 16 Playwright E2E browser tests on every commit.

### Profile B: Senior Frontend / UI Systems Engineer
> **Inklara — Inclusive Engineering Platform | Senior Frontend & UI Systems Engineer**  
> *React 19, Next.js 15, TypeScript, Tailwind CSS, WAI-ARIA 1.2, Playwright, Component Architecture*  
> * **Design System & Accessible Component Engineering:** Built a responsive, high-contrast dark design system with ergonomic typography, fluid layouts, accessible focus rings (WCAG 2.4.11), and skip navigation mechanisms.  
> * **Complex Interaction Patterns:** Engineered accessible interactive components including WAI-ARIA modal dialogs with focus trapping, tablists with roving tabIndex, disclosures, and accessible live alert banners.  
> * **Assistive Tech Simulation:** Developed an interactive Screen-Reader Announcement Timeline UI mapping sequential DOM events, ARIA live region politeness (`assertive`/`polite`), and computed Accessibility Tree nodes with honest platform capability boundaries.  
> * **Performance & Print Optimization:** Optimized rendering using Next.js App Router server/client components and implemented print-specific CSS media queries (`@media print`) generating pixel-perfect executive audit reports and PDF exports.

### Profile C: Web Accessibility Specialist / Inclusive Design Lead
> **Inklara — Inclusive Engineering Platform | Web Accessibility Engineer**  
> *WCAG 2.2 (Level A/AA/AAA), W3C WCAG-EM, axe-core, VoiceOver, NVDA, WAI-ARIA, Assistive Technology Testing*  
> * **WCAG 2.2 AA Conformance Engine:** Mapped 50+ WCAG 2.2 success criteria to automated axe-core rules, categorizing findings into actionable violations, incomplete checks, and passes with precise W3C Understanding citations.  
> * **Screen-Reader Testing Workbench:** Engineered automated scenario testing across 7 core UI interaction patterns (dialogs, form validation, tablists, toggles, icon-only buttons), comparing computed accessibility tree attributes with expected speech announcements.  
> * **Structured Manual Audit Protocol:** Built a 13-point human evaluation workflow implementing the W3C WCAG-EM methodology, capturing manual test results for keyboard traps, reflow (400%), and contrast edge cases.  
> * **Remediation & Regression Analysis:** Created an automated remediation catalog offering side-by-side Before/After code solutions with engineering trade-offs, coupled with a baseline regression engine tracking net issue deltas.

### Profile D: Software Engineer in Test (SDET) / Platform Automation Engineer
> **Inklara — Inclusive Engineering Platform | Platform & Automation Engineer**  
> *Playwright, Vitest, TypeScript, axe-core, GitHub Actions, Docker, Headless Chromium, CI/CD*  
> * **Automated Test Orchestration:** Designed an automated testing pipeline using Playwright to launch sandboxed Chromium instances, navigate complex SPAs, inject axe-core, and capture DOM snapshots in under 5 seconds per audit.  
> * **Deterministic Fingerprinting & Regression Diffing:** Devised a SHA-256 fingerprinting algorithm hashing rule IDs, CSS selectors, and normalized DOM snippets to reliably track regressions and resolved issues across multiple build iterations.  
> * **E2E & Unit Test Coverage:** Built a test suite spanning 31 Vitest unit/integration tests and 16 Playwright end-to-end integration tests, integrated with GitHub Actions CI for automated pull request quality gating.

---

## 10. Open-Source Attribution & Design References

- **Next.js & React:** Frontend framework & App Router architecture.
- **axe-core (Deque Systems):** Rule engine for automated DOM accessibility checks.
- **Playwright (Microsoft):** Managed browser automation and sandboxed rendering.
- **Prisma:** Type-safe database ORM.
- **Zod:** Runtime schema validation.
- **Tailwind CSS:** Design tokens and utility styling.
- **Lucide Icons:** Accessible UI icon vectors.
- **Design Inspiration — Snowdog Accessibility Audit Tool ([SnowdogApps/a11y-audit-tool](https://github.com/SnowdogApps/a11y-audit-tool) & [Service Overview](https://www.snow.dog/services/accessibility/a11y-audit-tool)):** Inklara studies and draws architectural inspiration from Snowdog's combined automated/manual workflow model, audit estate hierarchy, and findings presentation. Inklara implements its own original Next.js 15 App Router architecture, proprietary dark design system, Screen-Reader Announcement Workbench, regression diffing engine, and strict multi-tier SSRF security sandbox.

---

**Inklara — Inclusive Engineering Platform** | High-Yield Technical Portfolio Showcase

