import type { ScreenReaderScenario } from "./types";

export const SCREEN_READER_SCENARIOS: Record<string, ScreenReaderScenario> = {
  "modal-dialog": {
    id: "modal-dialog",
    title: "Modal Dialog: Role, Name & Focus Trapping",
    category: "Dialogs & Modals",
    description:
      "Validates that a modal dialog exposes role='dialog', computes an accessible name from its title, constrains keyboard focus, and dismisses on Escape while restoring focus.",
    wcagCriterion: "4.1.2 Name, Role, Value & 2.1.2 No Keyboard Trap",
    targetSelector: "#sr-open-modal-btn",
    testSteps: [
      {
        action: "Focus and activate the dialog trigger button",
        targetSelector: "#sr-open-modal-btn",
        expectedAnnouncement: "Review Order, button. Press Return to open dialog.",
        expectedProps: {
          role: "button",
          name: "Review Order",
          focused: true,
        },
        voiceOverKeys: ["VO + Space to activate button", "Tab to move focus"],
        reproductionNote: "Ensure the button has a discernible text label and indicates it opens a popup.",
      },
      {
        action: "Observe initial modal state upon opening",
        targetSelector: "#sr-demo-modal",
        expectedAnnouncement: "Order Summary, dialog, 2 items. Focus placed inside dialog.",
        expectedProps: {
          role: "dialog",
          name: "Order Summary",
          modal: true,
        },
        voiceOverKeys: ["VO + Shift + Down to interact with dialog content"],
        reproductionNote: "The container must have role='dialog', aria-modal='true', and aria-labelledby pointing to the modal title.",
      },
      {
        action: "Inspect primary dismiss control inside modal",
        targetSelector: "#sr-close-modal-btn",
        expectedAnnouncement: "Close dialog, button",
        expectedProps: {
          role: "button",
          name: "Close dialog",
          focused: true,
        },
        voiceOverKeys: ["Escape to dismiss dialog", "VO + Space on Close button"],
        reproductionNote: "Focus must be trapped inside the dialog and return cleanly to #sr-open-modal-btn upon dismissal.",
      },
    ],
  },

  "form-validation": {
    id: "form-validation",
    title: "Form Validation: Error Announcement & aria-invalid",
    category: "Forms & Errors",
    description:
      "Validates that an invalid input exposes aria-invalid='true', links to the error description via aria-describedby, and announces the error politely or via an alert.",
    wcagCriterion: "3.3.1 Error Identification & 3.3.2 Labels or Instructions",
    targetSelector: "#sr-email-input",
    testSteps: [
      {
        action: "Inspect invalid form input control",
        targetSelector: "#sr-email-input",
        expectedAnnouncement: "Email Address, edit text, required, invalid data, Please enter a valid email address with @.",
        expectedProps: {
          role: "textbox",
          name: "Email Address",
          invalid: true,
          description: "Please enter a valid email address with @.",
          focused: true,
        },
        voiceOverKeys: ["Tab to focus input", "VO + Shift + Down to inspect error description"],
        reproductionNote: "The <input> must have an explicit <label>, aria-invalid='true', and aria-describedby matching the error container's id.",
      },
      {
        action: "Inspect live validation error banner",
        targetSelector: "#sr-email-error-msg",
        expectedAnnouncement: "Error: Please enter a valid email address with @.",
        expectedProps: {
          role: "alert",
          liveAssertive: true,
        },
        voiceOverKeys: ["Control key to pause speech if urgent"],
        reproductionNote: "The error message should have role='alert' or aria-live='assertive' so screen readers announce it immediately when triggered.",
      },
    ],
  },

  "aria-live-status": {
    id: "aria-live-status",
    title: "ARIA Live Region: Politeness & Dynamic Status Updates",
    category: "Dynamic Content",
    description:
      "Validates that asynchronous updates (e.g. cart quantity, toast notifications) are spoken politely without stealing keyboard focus.",
    wcagCriterion: "4.1.3 Status Messages (Level AA)",
    targetSelector: "#sr-live-counter-status",
    testSteps: [
      {
        action: "Inspect dynamic status container",
        targetSelector: "#sr-live-counter-status",
        expectedAnnouncement: "3 items in order, total $89.00.",
        expectedProps: {
          role: "status",
          livePolite: true,
        },
        voiceOverKeys: ["VO + Left/Right to explore document while live updates speak in background"],
        reproductionNote: "The status region must have role='status' or aria-live='polite' and aria-atomic='true'.",
      },
    ],
  },

  "disclosure-menu": {
    id: "disclosure-menu",
    title: "Navigation Disclosure: aria-expanded State",
    category: "Navigation & Menus",
    description:
      "Validates that expandable disclosure triggers declare aria-expanded state and associate with controlled panels via aria-controls.",
    wcagCriterion: "4.1.2 Name, Role, Value",
    targetSelector: "#sr-disclosure-btn",
    testSteps: [
      {
        action: "Inspect collapsed disclosure trigger",
        targetSelector: "#sr-disclosure-btn",
        expectedAnnouncement: "Payment Methods, collapsed, button",
        expectedProps: {
          role: "button",
          name: "Payment Methods",
          expanded: false,
        },
        voiceOverKeys: ["VO + Space or Enter to toggle expanded state"],
        reproductionNote: "The trigger must declare aria-expanded='false' when collapsed and update dynamically to 'true' upon activation.",
      },
      {
        action: "Inspect expanded disclosure panel",
        targetSelector: "#sr-disclosure-panel",
        expectedAnnouncement: "Payment Methods options, region",
        expectedProps: {
          role: "region",
          name: "Payment Methods Details",
        },
        voiceOverKeys: ["Tab to step directly into expanded panel"],
        reproductionNote: "The panel must be hidden (display: none or hidden attribute) when collapsed so screen readers do not read dead content.",
      },
    ],
  },

  "icon-button": {
    id: "icon-button",
    title: "Icon-Only Button: Discernible Name & Semantic Role",
    category: "Controls & Buttons",
    description:
      "Validates that graphical buttons without visible text provide a discernible accessible name via aria-label or accessible text alternative.",
    wcagCriterion: "4.1.2 Name, Role, Value & 1.1.1 Non-text Content",
    targetSelector: "#sr-icon-remove-btn",
    testSteps: [
      {
        action: "Inspect icon-only button",
        targetSelector: "#sr-icon-remove-btn",
        expectedAnnouncement: "Remove item from cart, button",
        expectedProps: {
          role: "button",
          name: "Remove item from cart",
        },
        voiceOverKeys: ["VO + Space to activate", "VO + Shift + H to read Help text if available"],
        reproductionNote: "The button must have aria-label='Remove item from cart' and the SVG icon must have aria-hidden='true' to prevent garbage character speech.",
      },
    ],
  },

  "tabs-widget": {
    id: "tabs-widget",
    title: "Accessible Tabs Widget: WAI-ARIA Tabs Pattern",
    category: "Widgets",
    description:
      "Validates role='tablist', role='tab', aria-selected state, and association with role='tabpanel' via aria-controls.",
    wcagCriterion: "4.1.2 Name, Role, Value & 2.1.1 Keyboard",
    targetSelector: "#sr-tab-shipping",
    testSteps: [
      {
        action: "Inspect selected tab in tablist",
        targetSelector: "#sr-tab-shipping",
        expectedAnnouncement: "Shipping, selected, tab, 1 of 3",
        expectedProps: {
          role: "tab",
          name: "Shipping",
        },
        voiceOverKeys: ["Left/Right Arrow keys to switch between tabs", "Tab to move into selected tabpanel"],
        reproductionNote: "The parent must have role='tablist', each tab role='tab', and aria-selected='true' on the active tab.",
      },
      {
        action: "Inspect active tab panel",
        targetSelector: "#sr-tabpanel-shipping",
        expectedAnnouncement: "Shipping Options, tab panel",
        expectedProps: {
          role: "tabpanel",
          name: "Shipping Options",
        },
        voiceOverKeys: ["VO + A to read tabpanel contents"],
        reproductionNote: "The panel must have role='tabpanel', tabindex='0' for keyboard focus, and aria-labelledby pointing to the tab id.",
      },
    ],
  },

  "toggle-switch": {
    id: "toggle-switch",
    title: "Toggle Switch: role='switch' & aria-checked",
    category: "Controls & Buttons",
    description:
      "Validates that custom toggles expose role='switch' and accurately announce checked/unchecked state.",
    wcagCriterion: "4.1.2 Name, Role, Value",
    targetSelector: "#sr-toggle-switch",
    testSteps: [
      {
        action: "Inspect switch control",
        targetSelector: "#sr-toggle-switch",
        expectedAnnouncement: "Enable Express Checkout, switch, on",
        expectedProps: {
          role: "switch",
          name: "Enable Express Checkout",
        },
        voiceOverKeys: ["Space to toggle switch on/off", "VO + Space to trigger"],
        reproductionNote: "Must have role='switch' and aria-checked='true' or 'false' (do not use generic checkbox unless designed as such).",
      },
    ],
  },
};

export function getAllScenarios(): ScreenReaderScenario[] {
  return Object.values(SCREEN_READER_SCENARIOS);
}

export function getScenarioById(id: string): ScreenReaderScenario | undefined {
  return SCREEN_READER_SCENARIOS[id];
}
