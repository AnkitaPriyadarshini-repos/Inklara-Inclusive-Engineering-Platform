export interface ManualChecklistTemplateItem {
  category: string;
  criterion: string;
  title: string;
  description: string;
  methodologyInstructions: string;
}

export const MANUAL_CHECKLIST_TEMPLATE: ManualChecklistTemplateItem[] = [
  {
    category: "Keyboard Navigation",
    criterion: "2.1.1 Keyboard (Level A)",
    title: "All Interactive Controls Operable by Keyboard",
    description:
      "All functionality of the page can be triggered using standard keyboard shortcuts (Tab, Shift+Tab, Enter, Space, Arrow keys) without requiring a mouse.",
    methodologyInstructions:
      "Disconnect or refrain from using the mouse. Press Tab repeatedly from top to bottom. Activate all links (Enter), buttons (Enter or Space), checkboxes (Space), menus, and sliders. Confirm no interactions require mouse-only gestures or hover states.",
  },
  {
    category: "Keyboard Navigation",
    criterion: "2.1.2 No Keyboard Trap (Level A)",
    title: "Free of Keyboard Traps",
    description:
      "Keyboard focus is never trapped inside any widget, editor, video player, or embedded component.",
    methodologyInstructions:
      "Navigate through all widgets, code blocks, complex components, and media players. Verify that pressing Tab, Shift+Tab, or Escape allows the keyboard user to leave the component without page refresh.",
  },
  {
    category: "Focus & Flow",
    criterion: "2.4.3 Focus Order (Level A)",
    title: "Logical and Meaningful Focus Order",
    description:
      "Sequential navigation order preserves meaning and operates predictably alongside the visual layout.",
    methodologyInstructions:
      "Tab sequentially through the page. Confirm focus travels in expected logical reading order (top-to-bottom, left-to-right for LTR languages) and does not jump erratically across unrelated columns or hidden DOM layers.",
  },
  {
    category: "Focus & Flow",
    criterion: "2.4.7 Focus Visible & 2.4.11 Not Obscured (Level AA)",
    title: "Clear, High-Contrast Visible Focus Indicators",
    description:
      "Every focused element displays a prominent, unmistakable focus ring that is not obscured by sticky headers, banners, or floating footers.",
    methodologyInstructions:
      "Observe the active element outline during keyboard navigation. Confirm the focus outline is distinctly visible (minimum 2px solid with 3:1 contrast against adjacent background). Ensure sticky headers or cookie banners do not conceal focused controls.",
  },
  {
    category: "Dialogs & Modals",
    criterion: "WAI-ARIA Dialog Modal Pattern",
    title: "Modal Focus Trapping and Restoration",
    description:
      "When a modal opens, focus moves directly into the dialog, is constrained within it, and returns cleanly to the triggering element upon closing with Escape or Close button.",
    methodologyInstructions:
      "Open each modal or drawer dialog using keyboard. Verify initial focus lands on the first interactive element or dialog title. Tab through all controls to verify focus wraps within the modal. Press Escape to close and verify focus returns directly to the opening trigger.",
  },
  {
    category: "Names, Roles & States",
    criterion: "4.1.2 Name, Role, Value (Level A)",
    title: "Accessible Names, Roles, and Interactive States",
    description:
      "Custom components (accordions, tabs, disclosures, comboboxes) expose appropriate ARIA roles and accurate dynamic states (aria-expanded, aria-selected, aria-checked).",
    methodologyInstructions:
      "Inspect custom UI elements with browser Accessibility Inspector. Toggle items and confirm that aria-expanded or aria-selected values update synchronously in the Accessibility Tree.",
  },
  {
    category: "Forms & Errors",
    criterion: "3.3.1 Error Identification & 3.3.2 Labels (Level A)",
    title: "Clear Form Labels and Programmatic Error Announcements",
    description:
      "All fields have descriptive labels and validation errors are identified in text with aria-describedby or aria-invalid.",
    methodologyInstructions:
      "Submit an incomplete or invalid form. Check that invalid fields are visually highlighted AND programmatically linked to the error message (e.g. via aria-describedby or role=\"alert\"). Confirm error guidance clearly states what is needed.",
  },
  {
    category: "Structure & Semantics",
    criterion: "1.3.1 Info and Relationships (Level A)",
    title: "Semantic Headings and Landmark Regions",
    description:
      "The page uses one <h1> and an uninterrupted sequential heading hierarchy (h1 -> h2 -> h3) with standard landmark elements (<header>, <nav>, <main>, <footer>).",
    methodologyInstructions:
      "Use VoiceOver rotor (VO+U) or NVDA Elements List (NVDA+F7) to inspect headings and landmarks. Ensure landmarks encompass all major sections and heading hierarchy corresponds to logical structure.",
  },
  {
    category: "Visual Presentation",
    criterion: "1.4.4 Resize Text (AA) & 1.4.10 Reflow (Level AA)",
    title: "Zoom to 200% and Reflow at 400% (1280px / 320px viewport)",
    description:
      "Content scales gracefully up to 200% text zoom and reflows into a single column at 400% zoom without horizontal scrolling or overlapping text.",
    methodologyInstructions:
      "In browser, zoom to 200% and inspect for truncated text or broken layouts. Set browser width to 1280px and zoom to 400% (equivalent to 320px CSS width). Verify no two-dimensional scrolling is required.",
  },
  {
    category: "Color & Contrast",
    criterion: "1.4.1 Use of Color & 1.4.11 Non-text Contrast (Level AA)",
    title: "Color Contrast for UI Components and Informational Cues",
    description:
      "Status indicators, icons, and interactive borders maintain at least 3:1 contrast against adjacent background colors, and color is never the only visual indicator of state.",
    methodologyInstructions:
      "Check error states, badges, and toggle switches. Confirm that an icon, text label, or underline accompanies any color change. Test borders of inputs with CCA to confirm >= 3:1 contrast.",
  },
  {
    category: "Assistive Technology",
    criterion: "4.1.3 Status Messages (Level AA)",
    title: "Screen Reader Announcements for Dynamic Content",
    description:
      "Asynchronous content updates (toast notifications, search results count, shopping cart updates) are announced politely to screen reader users using aria-live.",
    methodologyInstructions:
      "Enable Apple VoiceOver (Cmd+F5) or NVDA (Ctrl+Alt+N). Trigger a dynamic update (such as filter change or submit). Confirm the screen reader announces the status change without stealing user focus.",
  },
  {
    category: "Motion & Animation",
    criterion: "2.3.3 Animation from Interactions (Level AAA / Best Practice)",
    title: "Respect for Reduced-Motion Preferences",
    description:
      "Non-essential animations and parallax effects are disabled or minimized when the user has enabled prefers-reduced-motion in system settings.",
    methodologyInstructions:
      "Toggle 'prefers-reduced-motion: reduce' in browser rendering emulation tab. Interact with carousels, transitions, and loading states. Confirm animations are reduced to instant fades or static representations.",
  },
  {
    category: "Pointer & Touch",
    criterion: "2.5.8 Target Size (Minimum) (Level AA / WCAG 2.2)",
    title: "Minimum Pointer Target Size (24x24 CSS pixels)",
    description:
      "All interactive touch and click targets have an area of at least 24 by 24 CSS pixels, or sufficient spacing from neighboring targets.",
    methodologyInstructions:
      "Inspect icon buttons, pagination links, and checkboxes in DevTools Computed styles. Verify bounding rect is at least 24x24px or has sufficient margin from adjacent interactive controls.",
  },
];
