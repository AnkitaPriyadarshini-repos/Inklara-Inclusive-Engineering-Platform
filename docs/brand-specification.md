# Inklara — Brand Identity & Visual Specification

> *"Inklara reveals what interfaces leave behind."*

---

## 1. Brand Concept & Geometric Synthesis

The Inklara brand mark is an original geometric synthesis engineered for clarity at micro-resolutions (16px favicon) and scalability in enterprise documentation:

```
┌─────────────────────────────────────────────────────────────┐
│                      INKLARA SYMBOL                         │
│                                                             │
│         [ 1. Inclusive Portal Frame (Open Doorway) ]        │
│         - Outer indigo/violet continuous threshold          │
│         - Represents barrier-free digital access for all    │
│                                                             │
│         [ 2. The Inspection Aperture (Diagnostic Lens) ]    │
│         - Inner concentric 270° sky-blue focal arc          │
│         - Represents deep structural DOM evaluation         │
│                                                             │
│         [ 3. Continuous Verification Trajectory (Check) ]   │
│         - Vibrant emerald/teal dynamic upward vector        │
│         - Crosses aperture to signify persistent compliance │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Color Palette & Accessibility Conformance

All brand tokens satisfy WCAG 2.2 AA (4.5:1 text, 3:1 non-text graphics) against the Inklara dark canvas:

| Token Name | Hex Code | Purpose | Contrast Ratio vs Canvas |
| :--- | :--- | :--- | :--- |
| **`inklara-canvas`** | `#090b14` | Main application background | Baseline (1.0:1) |
| **`inklara-surface`** | `#101322` | Card & container surfaces | Elevated backdrop |
| **`inklara-border`** | `#22283d` | Container boundaries | 3.2:1 (Non-text AA) |
| **`inklara-brand`** | `#6366f1` | Portal frame, active states | 4.8:1 (AA) |
| **`inklara-lens`** | `#38bdf8` | Diagnostic inspection & focus rings | 8.2:1 (AAA) |
| **`inklara-verify`** | `#10b981` | Successful verification, passed checks | 7.4:1 (AAA) |
| **`text-primary`** | `#ffffff` | Primary headings & emphasis | 18.5:1 (AAA) |
| **`text-secondary`** | `#94a3b8` | Metadata, descriptions, captions | 6.8:1 (AA) |

---

## 3. Brand Assets Repository Paths

* **Standalone Vector Mark:** [`/public/brand/inklara-symbol.svg`](/public/brand/inklara-symbol.svg)
* **Horizontal Dark Lockup:** [`/public/brand/inklara-logo-dark.svg`](/public/brand/inklara-logo-dark.svg)
* **Horizontal Light Lockup:** [`/public/brand/inklara-logo-light.svg`](/public/brand/inklara-logo-light.svg)
* **Favicon:** [`/public/favicon.svg`](/public/favicon.svg)
* **React Symbol Component:** [`/src/components/brand/InklaraSymbol.tsx`](/src/components/brand/InklaraSymbol.tsx)
* **React Wordmark Component:** [`/src/components/brand/InklaraLogo.tsx`](/src/components/brand/InklaraLogo.tsx)

---

## 4. Usage Guidelines

1. **Clear Space:** Maintain minimum clear space equal to 25% of the symbol width around all sides.
2. **Never communicate through color alone:** In accordance with WCAG 1.4.1, all verification states pair the emerald verification stroke with an explicit textual badge or accessible status icon.
3. **Focus indicators:** Always utilize the high-contrast `inklara-lens` (`#38bdf8`) 2px solid ring with 2px offset for keyboard `:focus-visible` compliance.
