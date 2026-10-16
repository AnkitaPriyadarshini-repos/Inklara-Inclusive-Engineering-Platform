export interface WcagCriterion {
  id: string; // e.g., "1.1.1"
  num: string; // "1.1.1"
  title: string;
  level: "A" | "AA" | "AAA";
  version: "2.0" | "2.1" | "2.2";
  principle: "Perceivable" | "Operable" | "Understandable" | "Robust";
  description: string;
  url: string;
  associatedAxeRules: string[];
}

export const WCAG_CATALOG: Record<string, WcagCriterion> = {
  "1.1.1": {
    id: "1.1.1",
    num: "1.1.1",
    title: "Non-text Content",
    level: "A",
    version: "2.0",
    principle: "Perceivable",
    description:
      "All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
    associatedAxeRules: [
      "image-alt",
      "input-image-alt",
      "area-alt",
      "object-alt",
      "svg-img-alt",
      "role-img-alt",
    ],
  },
  "1.3.1": {
    id: "1.3.1",
    num: "1.3.1",
    title: "Info and Relationships",
    level: "A",
    version: "2.0",
    principle: "Perceivable",
    description:
      "Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
    associatedAxeRules: [
      "heading-order",
      "landmark-one-main",
      "page-has-heading-one",
      "region",
      "aria-required-children",
      "aria-required-parent",
      "list",
      "listitem",
      "definition-list",
      "dlitem",
      "table-duplicate-name",
      "th-has-data-cells",
      "td-headers-attr",
    ],
  },
  "1.3.5": {
    id: "1.3.5",
    num: "1.3.5",
    title: "Identify Input Purpose",
    level: "AA",
    version: "2.1",
    principle: "Perceivable",
    description:
      "The purpose of each input field collecting information about the user can be programmatically determined.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html",
    associatedAxeRules: ["autocomplete-valid"],
  },
  "1.4.1": {
    id: "1.4.1",
    num: "1.4.1",
    title: "Use of Color",
    level: "A",
    version: "2.0",
    principle: "Perceivable",
    description:
      "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
    associatedAxeRules: ["link-in-text-block"],
  },
  "1.4.3": {
    id: "1.4.3",
    num: "1.4.3",
    title: "Contrast (Minimum)",
    level: "AA",
    version: "2.0",
    principle: "Perceivable",
    description:
      "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, with exceptions for large text (3:1).",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
    associatedAxeRules: ["color-contrast", "color-contrast-enhanced"],
  },
  "1.4.11": {
    id: "1.4.11",
    num: "1.4.11",
    title: "Non-text Contrast",
    level: "AA",
    version: "2.1",
    principle: "Perceivable",
    description:
      "The visual presentation of user interface components and graphical objects has a contrast ratio of at least 3:1 against adjacent colors.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
    associatedAxeRules: ["target-size", "focus-order-semantics"],
  },
  "2.1.1": {
    id: "2.1.1",
    num: "2.1.1",
    title: "Keyboard",
    level: "A",
    version: "2.0",
    principle: "Operable",
    description:
      "All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
    associatedAxeRules: ["accesskeys", "nested-interactive", "scrollable-region-focusable"],
  },
  "2.1.2": {
    id: "2.1.2",
    num: "2.1.2",
    title: "No Keyboard Trap",
    level: "A",
    version: "2.0",
    principle: "Operable",
    description:
      "If keyboard focus can be moved to a component using a keyboard interface, then focus can be moved away from that component using only a keyboard.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html",
    associatedAxeRules: [],
  },
  "2.4.1": {
    id: "2.4.1",
    num: "2.4.1",
    title: "Bypass Blocks",
    level: "A",
    version: "2.0",
    principle: "Operable",
    description:
      "A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
    associatedAxeRules: ["bypass", "skip-link"],
  },
  "2.4.2": {
    id: "2.4.2",
    num: "2.4.2",
    title: "Page Titled",
    level: "A",
    version: "2.0",
    principle: "Operable",
    description:
      "Web pages have titles that describe topic or purpose.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html",
    associatedAxeRules: ["document-title"],
  },
  "2.4.3": {
    id: "2.4.3",
    num: "2.4.3",
    title: "Focus Order",
    level: "A",
    version: "2.0",
    principle: "Operable",
    description:
      "If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
    associatedAxeRules: ["tabindex"],
  },
  "2.4.4": {
    id: "2.4.4",
    num: "2.4.4",
    title: "Link Purpose (In Context)",
    level: "A",
    version: "2.0",
    principle: "Operable",
    description:
      "The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined link context.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html",
    associatedAxeRules: ["link-name", "identical-links-same-purpose"],
  },
  "2.4.7": {
    id: "2.4.7",
    num: "2.4.7",
    title: "Focus Visible",
    level: "AA",
    version: "2.0",
    principle: "Operable",
    description:
      "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
    associatedAxeRules: ["focus-order-semantics"],
  },
  "2.4.11": {
    id: "2.4.11",
    num: "2.4.11",
    title: "Focus Not Obscured (Minimum)",
    level: "AA",
    version: "2.2",
    principle: "Operable",
    description:
      "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html",
    associatedAxeRules: [],
  },
  "2.5.3": {
    id: "2.5.3",
    num: "2.5.3",
    title: "Label in Name",
    level: "A",
    version: "2.1",
    principle: "Operable",
    description:
      "For user interface components with labels that include text or images of text, the name contains the text that is presented visually.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html",
    associatedAxeRules: ["label-content-name-mismatch"],
  },
  "2.5.8": {
    id: "2.5.8",
    num: "2.5.8",
    title: "Target Size (Minimum)",
    level: "AA",
    version: "2.2",
    principle: "Operable",
    description:
      "The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where an inline target, user-agent control, or spacing exemption applies.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
    associatedAxeRules: ["target-size"],
  },
  "3.1.1": {
    id: "3.1.1",
    num: "3.1.1",
    title: "Language of Page",
    level: "A",
    version: "2.0",
    principle: "Understandable",
    description:
      "The default human language of each Web page can be programmatically determined.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
    associatedAxeRules: ["html-has-lang", "html-lang-valid"],
  },
  "3.2.1": {
    id: "3.2.1",
    num: "3.2.1",
    title: "On Focus",
    level: "A",
    version: "2.0",
    principle: "Understandable",
    description:
      "When any user interface component receives focus, it does not initiate a change of context.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html",
    associatedAxeRules: [],
  },
  "3.2.2": {
    id: "3.2.2",
    num: "3.2.2",
    title: "On Input",
    level: "A",
    version: "2.0",
    principle: "Understandable",
    description:
      "Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior beforehand.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/on-input.html",
    associatedAxeRules: [],
  },
  "3.3.1": {
    id: "3.3.1",
    num: "3.3.1",
    title: "Error Identification",
    level: "A",
    version: "2.0",
    principle: "Understandable",
    description:
      "If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html",
    associatedAxeRules: [],
  },
  "3.3.2": {
    id: "3.3.2",
    num: "3.3.2",
    title: "Labels or Instructions",
    level: "A",
    version: "2.0",
    principle: "Understandable",
    description:
      "Labels or instructions are provided when content requires user input.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
    associatedAxeRules: ["label", "aria-label", "select-name"],
  },
  "3.3.7": {
    id: "3.3.7",
    num: "3.3.7",
    title: "Redundant Entry",
    level: "A",
    version: "2.2",
    principle: "Understandable",
    description:
      "Information previously entered by or provided to the user that is required to be entered again in the same process is either auto-populated or available for the user to select.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html",
    associatedAxeRules: [],
  },
  "4.1.2": {
    id: "4.1.2",
    num: "4.1.2",
    title: "Name, Role, Value",
    level: "A",
    version: "2.0",
    principle: "Robust",
    description:
      "For all user interface components, the name and role can be programmatically determined; states, properties, and values can be programmatically set; and notification of changes to these items is available to user agents.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
    associatedAxeRules: [
      "aria-allowed-attr",
      "aria-allowed-role",
      "aria-dialog-name",
      "aria-hidden-body",
      "aria-hidden-focus",
      "aria-input-field-name",
      "aria-roles",
      "aria-toggle-field-name",
      "aria-valid-attr-value",
      "aria-valid-attr",
      "button-name",
      "input-button-name",
    ],
  },
};

/**
 * Maps axe-core rule tags or rule ID to WCAG 2.2 criteria
 */
export function mapRuleToWcagCriteria(
  ruleId: string,
  tags: string[] = []
): WcagCriterion[] {
  const matchedCriteria = new Set<string>();

  // Direct rule lookup
  for (const [criterionId, criterion] of Object.entries(WCAG_CATALOG)) {
    if (criterion.associatedAxeRules.includes(ruleId)) {
      matchedCriteria.add(criterionId);
    }
  }

  // Tag-based mapping (e.g. "wcag111", "wcag143", "wcag21aa")
  for (const tag of tags) {
    const match = tag.match(/^wcag(\d)(\d)(\d+)$/);
    if (match) {
      const formatted = `${match[1]}.${match[2]}.${match[3]}`;
      if (WCAG_CATALOG[formatted]) {
        matchedCriteria.add(formatted);
      }
    }
  }

  return Array.from(matchedCriteria).map((id) => WCAG_CATALOG[id]);
}
