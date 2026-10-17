<div align="center">

<img src="./public/brand/inklara-logo-dark.svg" alt="Inklara — Inclusive Engineering Platform" width="460" />

<p><strong>Reveals what interfaces leave behind.</strong></p>

<p>An enterprise-grade, recruiter-ready accessibility engineering platform pairing sandboxed browser automation with an interactive Screen-Reader Testing Workbench, actionable Before/After remediation diffs, continuous regression verification, and executive reporting.</p>

<p>
  <a href="https://inklara.vercel.app"><img src="https://img.shields.io/badge/Production%20Deployment-Verified%20on%20Vercel-10b981?style=for-the-badge&logo=vercel" alt="Vercel Deployment" /></a>
  <a href="https://inklara.vercel.app/showcase"><img src="https://img.shields.io/badge/Interactive%20Showcase-Explore%20Live%20Demo-6366f1?style=for-the-badge&logo=sparkles" alt="Interactive Showcase" /></a>
  <a href="https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform"><img src="https://img.shields.io/badge/GitHub-Repository-1e293b?style=for-the-badge&logo=github" alt="GitHub Repo" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-15.1.4_App_Router-black?style=flat&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=flat&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict_5.7-blue?style=flat&logo=typescript" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/Engine-axe--core_4.10.2-red?style=flat" alt="axe-core" />
  <img src="https://img.shields.io/badge/Automation-Playwright_1.49-green?style=flat&logo=playwright" alt="Playwright" />
  <img src="https://img.shields.io/badge/Target-WCAG_2.2_Level_AA-purple?style=flat" alt="WCAG 2.2" />
  <img src="https://img.shields.io/badge/Tests-35_Unit_%2B_14_E2E-10b981?style=flat" alt="Tests" />
  <img src="https://img.shields.io/badge/Security-SSRF_Fail--Closed-indigo?style=flat" alt="SSRF Security" />
</p>

</div>

---

## Animated Product Walkthrough

<div align="center">
  <img src="./public/brand/inklara-demo-preview.svg" alt="Inklara 5-Stage Verification Workflow Demonstration" width="100%" />
  <p><em>Inklara 5-Stage Continuous Verification Workflow: <strong>Discover</strong> (Sandboxed axe-core scan) &rarr; <strong>Understand</strong> (Computed contrast &amp; A11y Tree) &rarr; <strong>Remediate</strong> (Actionable Before/After code patches) &rarr; <strong>Verify</strong> (Deterministic SHA-256 regression comparison) &rarr; <strong>Report</strong> (Executive PDF &amp; machine-readable JSON export).</em></p>
</div>

---

## Key Product Capabilities

* 🌐 **Verified Production Showcase (`/showcase`):** Guided 5-stage interactive demonstration, 4 recruiter role lenses (Full-Stack, Frontend, Accessibility, SDET), live Before/After code diffs, and downloadable JSON audit reports.
* 🛡️ **Hardened Scanner Sandbox:** Sandboxed Playwright Chromium worker context executing `axe-core 4.10.2` with multi-tier SSRF protection (DNS pre-resolution, private RFC 1918 CIDR filtering, cloud metadata blocking, and obfuscated IP rejection).
* 🔊 **Screen-Reader Testing Workbench (`/screen-reader`):** Automated scenario runner testing 7 assistive interaction patterns (dialogs, form validation, ARIA live regions, tabs, switches) with computed Accessibility Tree nodes and honest speech representation.
* 📐 **Authoritative WCAG 2.2 Level AA Catalog (`/wcag`):** 50+ success criteria mapped to automated rules, official W3C Understanding documentation, and 13-point WCAG-EM human evaluation checklists.
* 🔄 **Deterministic Regression Diffing:** SHA-256 finding fingerprinting (`ruleId` + normalized CSS selector + DOM snippet) tracking newly introduced regressions (`+`), verified fixed items (`-`), and persistent issues across builds.
* 📊 **Executive & Machine-Readable Reporting:** One-click JSON audit manifests for CI/CD consumption and print-optimized (`@media print`) PDF executive reports with non-certification disclaimers.

> **Engineering Integrity Notice:** Automated linters and rules engines reliably catch approximately 30–40% of WCAG success criteria. Inklara explicitly differentiates automated findings from human manual evaluations and never asserts full WCAG conformance based solely on passing an automated scan.

---

## 1. Architectural Overview

```
Inklara — Inclusive Engineering Platform
├── Presentation & Design System (Next.js 15 App Router, React 19, Strict TypeScript)
│   ├── Dedicated Recruiter Showcase Route (/showcase) with 5-stage animated demo & workbench
│   ├── Proprietary high-contrast dark design system with tailored tokens (Inklara Ink, Lens, Verify)
│   ├── Universal WCAG 2.4.11 compliant :focus-visible outlines (2px solid #38bdf8)
│   ├── Accessible Skip Navigation link (#main-content) & semantic landmark hierarchy
│   ├── WAI-ARIA Modal Dialogs with focus trapping and Escape key restoration
│   └── Print-optimized (@media print) Executive Audit Reports & machine-readable JSON exports
│
├── Automated Scanning & SSRF Security Engine
│   ├── SSRF Protection Layer (Blocks private IPv4/IPv6, link-local, cloud metadata 169.254.169.254)
│   ├── Obfuscated IP Protection (Blocks integer dword, hex, and octal notations before resolution)
│   ├── Playwright Chromium Sandbox (Hardware acceleration disabled, restricted permissions, 30s timeout)
│   ├── axe-core Runner (Configured for WCAG 2.2 AA rules, categorizing violations/incomplete/passes)
│   └── SHA-256 Fingerprinting (Deterministic tracking of ruleId + selector + normalized DOM)
│
├── Screen-Reader Testing Workbench (/screen-reader)
│   ├── Scenario Runner (Modal dialogs, form validation, ARIA live regions, tabs, switches)
│   ├── Announcement Timeline (User action, expected speech, computed A11y tree node, status)
│   └── Assistive Tech Protocol (Platform detection, macOS AppleScript bridge, and honest Windows/Linux fallback)
│
├── Evaluation & Methodology Reference Layer
│   ├── WCAG 2.2 Level AA Criterion Catalog (Mapped to W3C Understanding documentation)
│   ├── W3C WCAG-EM Methodology Workflow (Scope, representative pages, sample sets)
│   └── 13 Guided Human Evaluation Protocols (Keyboard traps, reflow at 400%, live regions)
│
├── Remediation & Regression Verification
│   ├── Root cause technical explanations and actionable code recommendations
│   ├── Side-by-side Before/After code snippets with design & engineering trade-offs
│   ├── Interactive Fix Verification Engine (Re-scans live targets and verifies resolution)
│   └── Baseline Regression Comparator (Tracks new regressions, fixed issues, net changes)
│
└── Relational Database (Prisma ORM)
    ├── Zero-configuration local SQLite (prisma/dev.db) for immediate development and CI
    └── Production-grade PostgreSQL schema (prisma/schema.postgresql.prisma) & Docker Compose
```

---

## 2. Core Modules Implemented

| Module | Route / File | Implementation Details |
| :--- | :--- | :--- |
| **Recruiter Showcase** | `/showcase` | Guided 5-stage animated demonstration, 4 recruiter role lenses, Before/After diffs, live fix verification simulation, and printable reports. |
| **Dashboard & Estate** | `/` | Application overview, active projects, recent audit runs, target distribution, and quick audit launcher. |
| **Project Management** | `/projects` | CRUD operations for projects and target environments (Dev, Staging, Prod), URL management, and run history. |
| **Audit Runner & Engine** | `/api/audits` | Playwright Chromium executing axe-core 4.10.2; SSRF DNS pre-resolution & IP filtering; redirect interception. |
| **Findings & Evidence** | `/findings/[id]` | Detailed technical inspection: rule IDs, impact badges, WCAG criteria, sanitized DOM snippets, and status management. |
| **Screen-Reader Workbench**| `/screen-reader` | 7 interactive scenarios with expected VoiceOver announcements, computed A11y tree nodes, and assistive timeline. |
| **WCAG 2.2 Catalog** | `/wcag` | Authoritative search and multi-filter workbench mapping 50+ WCAG 2.2 criteria across principles and levels (A, AA, AAA). |
| **Manual Checklist** | `/api/manual` | 13 WCAG-EM human evaluation criteria (keyboard traps, modal focus trapping, 400% zoom reflow). |
| **Regression Comparator**| `/api/regression/compare` | Deterministic SHA-256 finding fingerprinting detecting regressions (`+`), fixes (`-`), and persistent issues. |
| **Report Generator** | `/audits/[id]/report` | Print-ready PDF report, machine-readable JSON manifest download (`inklara-audit-<id>.json`), and non-certification disclaimer. |

---

## 3. Threat Model & SSRF Security Architecture

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

## 4. Quality Gates & Verified Test Commands

| Quality Gate | Command | Scope & Coverage | Verified Status |
| :--- | :--- | :--- | :--- |
| **Strict TypeScript** | `npx tsc --noEmit` | Strict type checking across App Router, components, APIs, and libraries. | **PASS (0 errors)** |
| **Unit & Integration** | `npm test` | 35 Vitest tests (Brand assets, SSRF, finding normalizer, WCAG mapping, regression diffing, screen-reader). | **PASS (7/7 suites, 35/35 tests)** |
| **ESLint Quality** | `npm run lint` | ESLint 9 checks with Next.js core web vitals and React rules. | **PASS (0 errors, 0 warnings)** |
| **Accessibility E2E** | `npx playwright test e2e/accessibility.spec.ts` | Automated axe-core audits (showcase, landmarks, dialogs, reflow 320px, reduced motion, focus rings). | **PASS (0 critical/serious violations)** |
| **Full Playwright Suite** | `npm run test:e2e` | End-to-end integration tests covering audit lifecycle, showcase stepper, and screen-reader scenarios. | **PASS (14/14 tests)** |
| **Production Build** | `npm run build` | Compiles optimized Next.js 15 production bundle across all 15 static and dynamic routes. | **PASS (Exit Code 0)** |

---

## 5. Local Installation & Setup

### Prerequisites
* **Node.js:** v20.x or v22.x LTS
* **npm:** v10.x+
* **Git**

### Quick Start (Zero-Configuration Local Mode)
```bash
# 1. Clone repository
git clone https://github.com/AnkitaPriyadarshini-repos/Inklara-Inclusive-Engineering-Platform.git
cd Inklara-Inclusive-Engineering-Platform

# 2. Install dependencies (runs prisma generation hook automatically)
npm install

# 3. Initialize local SQLite database
npx prisma db push

# 4. Install Playwright Chromium browser
npx playwright install chromium

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application or [http://localhost:3000/showcase](http://localhost:3000/showcase) to test the Recruiter Showcase.

### Dual-Database Configuration (SQLite / PostgreSQL)
`scripts/prisma-generate.js` automatically inspects `DATABASE_URL` at install and build time:
* If `DATABASE_URL` starts with `postgresql://` or `postgres://`, it automatically selects `prisma/schema.postgresql.prisma`.
* Otherwise, it defaults safely to local SQLite (`prisma/schema.prisma` -> `prisma/dev.db`).

```bash
# Push schema to hosted PostgreSQL instance (Supabase, Neon, AWS RDS, Docker):
npm run prisma:push:pg

# Explicitly generate PostgreSQL Prisma Client:
npm run prisma:generate:pg

# Run local PostgreSQL container via Docker Compose:
docker compose up -d
```

---

## 6. Project Structure

```
c:/Users/ankit/resume/INKLARA
├── public/
│   ├── favicon.svg                           # Compact 32x32 SVG brand mark
│   ├── og-image.png                          # 1200x630 OpenGraph social preview card
│   └── brand/
│       ├── inklara-symbol.svg                # Standalone geometric brand mark
│       ├── inklara-logo-dark.svg             # Horizontal brand lockup on dark ink
│       ├── inklara-logo-light.svg            # Horizontal brand lockup on light background
│       ├── inklara-demo-preview.svg          # Animated vector product demonstration
│       └── inklara-social-preview.png        # High-res social preview image
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # Root layout with OpenGraph & Twitter metadata
│   │   ├── page.tsx                          # Live Dashboard (Projects, targets, quick audit)
│   │   ├── showcase/                         # Recruiter-facing interactive showcase (/showcase)
│   │   │   ├── page.tsx
│   │   │   └── ShowcaseClient.tsx
│   │   ├── audits/                           # Audit run history & executive reports
│   │   ├── projects/                         # Project & target environment management
│   │   ├── screen-reader/                    # Assistive tech scenario workbench
│   │   ├── wcag/                             # WCAG 2.2 Level AA reference catalog
│   │   ├── fixtures/                         # Test fixtures index
│   │   ├── demo/                             # Live test fixtures (accessible, inaccessible, SR)
│   │   └── api/                              # REST API routes (audits, targets, findings, verify, etc.)
│   ├── components/
│   │   ├── brand/
│   │   │   ├── InklaraSymbol.tsx             # Vector mark React component
│   │   │   └── InklaraLogo.tsx               # Brand lockup React component
│   │   ├── showcase/
│   │   │   └── AnimatedProductDemo.tsx       # 5-stage animated product walkthrough
│   │   ├── Navbar.tsx                        # Responsive navigation with InklaraLogo
│   │   └── RunAuditModal.tsx                 # Sandboxed audit execution modal
│   └── lib/
│       ├── db.ts                             # Prisma database client
│       ├── scanner/                          # Headless Playwright / axe-core scanner & SSRF guardrails
│       ├── wcag/                             # WCAG 2.2 criterion catalog & mapping
│       └── remediation/                      # Actionable remediation Before/After patches
├── prisma/
│   ├── schema.prisma                         # SQLite development schema
│   └── schema.postgresql.prisma              # PostgreSQL production schema
└── docs/
    └── brand-specification.md                # Inklara design tokens & brand specification
```

---

## 7. Open-Source Attribution & Design References

* **Next.js & React:** Frontend framework & App Router architecture.
* **axe-core (Deque Systems):** Rule engine for automated DOM accessibility checks.
* **Playwright (Microsoft):** Managed browser automation and sandboxed rendering.
* **Prisma:** Type-safe database ORM.
* **Zod:** Runtime schema validation.
* **Tailwind CSS:** Design tokens and utility styling.
* **Lucide Icons:** Accessible UI icon vectors.
* **Design Inspiration — Snowdog Accessibility Audit Tool ([SnowdogApps/a11y-audit-tool](https://github.com/SnowdogApps/a11y-audit-tool) & [Service Overview](https://www.snow.dog/services/accessibility/a11y-audit-tool)):** Inklara studies and draws architectural inspiration from Snowdog's combined automated/manual workflow model, audit estate hierarchy, and findings presentation. Inklara implements its own original Next.js 15 App Router architecture, proprietary dark design system, Screen-Reader Announcement Workbench, regression diffing engine, and strict multi-tier SSRF security sandbox.

---

<div align="center">
  <p><strong>Inklara — Inclusive Engineering Platform</strong></p>
  <p>Designed and built as a flagship open-source engineering portfolio project.</p>
</div>
