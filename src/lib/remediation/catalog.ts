export interface RemediationGuidance {
  ruleId: string;
  technicalCause: string;
  actionableFix: string;
  codeExample: {
    problematic: string;
    remediated: string;
  };
  tradeoffs: string;
  verificationInstructions: string;
}

export const REMEDIATION_CATALOG: Record<string, RemediationGuidance> = {
  "color-contrast": {
    ruleId: "color-contrast",
    technicalCause:
      "The calculated luminance ratio between the foreground text and the background falls below the WCAG 1.4.3 minimum threshold of 4.5:1 (or 3:1 for large text at 18pt or 14pt bold).",
    actionableFix:
      "Adjust either the text color to a darker shade (on light backgrounds) or a lighter shade (on dark backgrounds) until the contrast ratio meets or exceeds 4.5:1. Alternatively, adjust the container background color or remove semi-transparent overlays.",
    codeExample: {
      problematic: `<p style="color: #94a3b8; background-color: #ffffff;">Subtle text with only 2.6:1 contrast</p>`,
      remediated: `<p style="color: #475569; background-color: #ffffff;">Accessible text with 5.9:1 contrast</p>`,
    },
    tradeoffs:
      "Balancing brand color palettes and subtle visual hierarchies with accessibility requirements. Never sacrifice legibility for decorative minimalism.",
    verificationInstructions:
      "Use browser DevTools color picker or Colour Contrast Analyser (CCA) to measure the rendered pixels. Re-run axe-core to ensure no child elements inherited low contrast.",
  },
  "image-alt": {
    ruleId: "image-alt",
    technicalCause:
      "An <img> element does not possess an 'alt' attribute, leaving screen reader users without any contextual information about the image.",
    actionableFix:
      "Add a descriptive 'alt' attribute that conveys the image's function or information. If the image is purely decorative, provide an empty 'alt=\"\"' attribute to allow assistive tech to ignore it.",
    codeExample: {
      problematic: `<img src="/icons/cart.png">`,
      remediated: `<img src="/icons/cart.png" alt="Shopping cart with 3 items">
<!-- If purely decorative: -->
<img src="/background-swirl.png" alt="" role="presentation">`,
    },
    tradeoffs:
      "Avoid redundant alt text such as 'image of...' or repeating adjacent caption text.",
    verificationInstructions:
      "Inspect the DOM for 'alt' presence. Test with VoiceOver or NVDA to verify natural auditory presentation.",
  },
  "button-name": {
    ruleId: "button-name",
    technicalCause:
      "A <button> element contains neither visible text, an 'aria-label', nor an 'aria-labelledby' reference, resulting in an empty accessible name in the accessibility tree.",
    actionableFix:
      "Supply text within the button element or provide an explicit 'aria-label' describing the action.",
    codeExample: {
      problematic: `<button class="p-2"><svg class="icon-close"></svg></button>`,
      remediated: `<button class="p-2" aria-label="Close dialog">
  <svg class="icon-close" aria-hidden="true"></svg>
</button>`,
    },
    tradeoffs:
      "Whenever possible, prefer visible text labels over aria-label alone so voice control users (e.g. Dragon NaturallySpeaking or Apple Voice Control) can speak the button's visible label.",
    verificationInstructions:
      "Check the Accessibility Tree in Chrome/Safari DevTools to confirm the 'Name' property is populated with the intended action.",
  },
  "link-name": {
    ruleId: "link-name",
    technicalCause:
      "An anchor (<a>) element contains no text or discernible accessible name, preventing screen reader users from understanding the link's destination.",
    actionableFix:
      "Include descriptive link text or an 'aria-label'. Avoid generic phrases like 'Click here' or 'Read more'.",
    codeExample: {
      problematic: `<a href="/profile"><span class="icon-user"></span></a>`,
      remediated: `<a href="/profile" aria-label="User Profile Settings">
  <span class="icon-user" aria-hidden="true"></span>
</a>`,
    },
    tradeoffs:
      "Links with icons often look minimalist, but clear names are required for both cognitive accessibility and screen readers.",
    verificationInstructions:
      "Navigate to the link via Tab key and verify screen reader announces destination and purpose.",
  },
  label: {
    ruleId: "label",
    technicalCause:
      "A form control (<input>, <select>, or <textarea>) does not have a properly associated <label> element with matching 'for'/'id' attributes or an 'aria-label'.",
    actionableFix:
      "Wrap or associate an explicit <label for=\"inputId\"> with the control.",
    codeExample: {
      problematic: `<input type="email" placeholder="Enter your email">`,
      remediated: `<label for="email-field" class="block font-medium">Email address</label>
<input id="email-field" type="email" autocomplete="email" placeholder="you@domain.com">`,
    },
    tradeoffs:
      "Placeholders disappear when typing and must never replace permanent accessible form labels.",
    verificationInstructions:
      "Clicking the label should focus the input control. VoiceOver should speak the label on focus.",
  },
  "heading-order": {
    ruleId: "heading-order",
    technicalCause:
      "Heading levels skip one or more levels (e.g., jumping from <h1> directly to <h3>), disrupting the logical document hierarchy for screen reader navigation.",
    actionableFix:
      "Ensure heading levels increment sequentially (<h1> -> <h2> -> <h3>) according to content structure, using CSS classes rather than heading tags to control visual font size.",
    codeExample: {
      problematic: `<h1>Dashboard</h1>\n<h3>Section Details</h3>`,
      remediated: `<h1>Dashboard</h1>\n<h2 class="text-base font-semibold">Section Details</h2>`,
    },
    tradeoffs:
      "Do not choose heading tags based on default browser font size. Style semantic headings with CSS.",
    verificationInstructions:
      "Use browser extension or VoiceOver rotor (VO + U -> Headings) to inspect sequential order.",
  },
  "landmark-one-main": {
    ruleId: "landmark-one-main",
    technicalCause:
      "The document does not have a single <main> element, preventing assistive technologies from quickly jumping past repeating headers directly to core page content.",
    actionableFix:
      "Wrap the primary page content in a semantic `<main id=\"main-content\">` element.",
    codeExample: {
      problematic: `<header>...</header>\n<div class="content">...</div>`,
      remediated: `<header>...</header>\n<main id="main-content" tabIndex="-1">...</main>`,
    },
    tradeoffs:
      "Ensure there is only one visible <main> landmark per document.",
    verificationInstructions:
      "Use VoiceOver rotor (Landmarks) to confirm 'main' landmark is present and navigable.",
  },
  "aria-roles": {
    ruleId: "aria-roles",
    technicalCause:
      "An element has an invalid or unrecognized ARIA 'role' attribute value that is not defined in the W3C WAI-ARIA specification.",
    actionableFix:
      "Replace the invalid role with a valid W3C ARIA role, or prefer native semantic HTML elements.",
    codeExample: {
      problematic: `<div role="btn">Submit</div>`,
      remediated: `<button type="submit">Submit</button>`,
    },
    tradeoffs:
      "First rule of ARIA: If you can use a native HTML element or attribute with the semantics and behavior already built in, then do so.",
    verificationInstructions:
      "Inspect DevTools ARIA attributes and re-run axe-core.",
  },
  tabindex: {
    ruleId: "tabindex",
    technicalCause:
      "An element has a positive 'tabindex' attribute (e.g., tabindex=\"1\"), which disrupts natural document tab order and creates confusing keyboard navigation sequences.",
    actionableFix:
      "Remove positive tabindex values. Use 'tabindex=\"0\"' to insert an element into natural tab order, or 'tabindex=\"-1\"' for programmatic focus only.",
    codeExample: {
      problematic: `<button tabindex="3">Submit</button>`,
      remediated: `<button>Submit</button>`,
    },
    tradeoffs:
      "Positive tabindexes are an anti-pattern that break DOM reading order.",
    verificationInstructions:
      "Press Tab sequentially from top to bottom of the page and confirm focus flows naturally.",
  },
};

/**
 * Returns comprehensive remediation guidance for a given rule ID with generic fallback.
 */
export function getRemediationGuidance(
  ruleId: string,
  ruleTitle?: string
): RemediationGuidance {
  if (REMEDIATION_CATALOG[ruleId]) {
    return REMEDIATION_CATALOG[ruleId];
  }

  return {
    ruleId,
    technicalCause: `The element violates the automated accessibility rule '${ruleId}' (${
      ruleTitle || "accessibility check"
    }).`,
    actionableFix: `Review the DOM node and ensure it complies with WAI-ARIA and HTML specifications for '${ruleId}'. Consult official Deque and W3C guidance.`,
    codeExample: {
      problematic: `<!-- Non-conformant pattern for ${ruleId} -->`,
      remediated: `<!-- Remediated accessible semantic structure -->`,
    },
    tradeoffs:
      "Test all changes with keyboard and assistive technology before marking verified.",
    verificationInstructions:
      "Re-run the automated audit and manually verify with keyboard navigation and screen reader.",
  };
}
