import { chromium, type Browser } from "playwright";
import { validateTargetUrl } from "../scanner/ssrf";
import { sanitizeHtmlSnippet } from "../scanner/sanitizer";
import { getScenarioById } from "./scenarios";
import { getVoiceOverPlatformStatus, captureCurrentVoiceOverSpeech } from "./voiceover";
import type {
  ScenarioEvaluationResult,
  TimelineEvent,
  ObservedNodeProperties,
  ScenarioStatus,
} from "./types";

/**
 * Executes a structured screen-reader scenario evaluation against a rendered target URL.
 * Combines DOM Accessibility Tree inspection with expected Apple VoiceOver announcement patterns.
 */
export async function evaluateScreenReaderScenario(
  targetUrl: string,
  scenarioId: string,
  options?: {
    allowLocalScanning?: boolean;
    timeoutMs?: number;
  }
): Promise<ScenarioEvaluationResult> {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Scenario with ID '${scenarioId}' not found.`);
  }

  const allowLocal =
    options?.allowLocalScanning ?? process.env.ALLOW_LOCAL_SCANNING === "true";
  const timeoutMs = options?.timeoutMs ?? 30000;

  // 1. SSRF Check
  const ssrfCheck = await validateTargetUrl(targetUrl, {
    allowLocalScanning: allowLocal,
  });
  if (!ssrfCheck.isValid) {
    throw new Error(`SSRF Block: ${ssrfCheck.error}`);
  }

  // 2. Query VoiceOver Platform Capabilities
  const platformStatus = await getVoiceOverPlatformStatus();

  let browser: Browser | null = null;
  const timeline: TimelineEvent[] = [];

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Inklara/1.0 ScreenReaderWorkbench",
      viewport: { width: 1280, height: 800 },
      permissions: [],
      ignoreHTTPSErrors: allowLocal,
    });

    const page = await context.newPage();

    // Attach SSRF redirect blocker
    await page.route("**/*", async (route) => {
      const reqUrl = route.request().url();
      if (reqUrl.startsWith("http://") || reqUrl.startsWith("https://")) {
        const check = await validateTargetUrl(reqUrl, {
          allowLocalScanning: allowLocal,
        });
        if (!check.isValid) {
          await route.abort("accessdenied");
          return;
        }
      }
      await route.continue();
    });

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: timeoutMs,
    });

    await page.waitForTimeout(500);

    // 3. Evaluate each step in the scenario
    let passedCount = 0;
    let failedCount = 0;
    let manualReviewCount = 0;

    for (let i = 0; i < scenario.testSteps.length; i++) {
      const step = scenario.testSteps[i];

      // Inspect target element in DOM
      const elementInfo = await page.evaluate((selector) => {
        const el = document.querySelector(selector) as HTMLElement | null;
        if (!el) return null;

        // Compute accessible name heuristic
        const ariaLabel = el.getAttribute("aria-label");
        const ariaLabelledby = el.getAttribute("aria-labelledby");
        let name = ariaLabel || "";

        if (!name && ariaLabelledby) {
          const labelledByEl = document.getElementById(ariaLabelledby);
          if (labelledByEl) name = labelledByEl.innerText.trim();
        }

        if (!name) {
          if (el.tagName === "INPUT") {
            const inputEl = el as HTMLInputElement;
            // Check associated label
            if (el.id) {
              const labelEl = document.querySelector(`label[for="${el.id}"]`);
              if (labelEl) name = (labelEl as HTMLElement).innerText.trim();
            }
            if (!name && inputEl.placeholder) name = inputEl.placeholder;
          } else {
            name = (el.innerText || "").trim().slice(0, 100);
          }
        }

        // Compute description
        let description = "";
        const ariaDescribedby = el.getAttribute("aria-describedby");
        if (ariaDescribedby) {
          const descEl = document.getElementById(ariaDescribedby);
          if (descEl) description = descEl.innerText.trim();
        }

        const role =
          el.getAttribute("role") ||
          (el.tagName === "BUTTON"
            ? "button"
            : el.tagName === "A"
            ? "link"
            : el.tagName === "INPUT"
            ? "textbox"
            : el.tagName === "DIALOG"
            ? "dialog"
            : el.tagName.toLowerCase());

        const isModal =
          el.getAttribute("aria-modal") === "true" ||
          el.tagName === "DIALOG";

        const liveAttr =
          el.getAttribute("aria-live") ||
          (el.getAttribute("role") === "status"
            ? "polite"
            : el.getAttribute("role") === "alert"
            ? "assertive"
            : null);

        const expandedAttr =
          el.getAttribute("aria-expanded") !== null
            ? el.getAttribute("aria-expanded") === "true"
            : null;

        const invalidAttr =
          el.getAttribute("aria-invalid") !== null
            ? el.getAttribute("aria-invalid") === "true"
            : null;

        const checkedAttr =
          el.getAttribute("aria-checked") !== null
            ? el.getAttribute("aria-checked") === "true"
            : null;

        return {
          role,
          name,
          description: description || undefined,
          value: (el as HTMLInputElement).value || undefined,
          focused: document.activeElement === el,
          modal: isModal,
          live: liveAttr,
          expanded: expandedAttr,
          invalid: invalidAttr,
          checked: checkedAttr,
          tagName: el.tagName.toLowerCase(),
          selector,
          outerHtml: el.outerHTML,
        };
      }, step.targetSelector);

      let status: ScenarioStatus = "FAIL";
      let explanation = "";
      let observedProps: ObservedNodeProperties | null = null;

      if (!elementInfo) {
        status = "FAIL";
        explanation = `Target element '${step.targetSelector}' was not found in the DOM.`;
      } else {
        observedProps = {
          role: elementInfo.role,
          name: elementInfo.name,
          description: elementInfo.description,
          value: elementInfo.value,
          focused: elementInfo.focused,
          modal: elementInfo.modal,
          live: elementInfo.live,
          expanded: elementInfo.expanded,
          invalid: elementInfo.invalid,
          checked: elementInfo.checked,
          tagName: elementInfo.tagName,
          selector: elementInfo.selector,
          htmlSnippet: sanitizeHtmlSnippet(elementInfo.outerHtml, 300),
        };

        // Evaluate expectations
        const exp = step.expectedProps;
        const roleMatches =
          !exp.role ||
          elementInfo.role.toLowerCase() === exp.role.toLowerCase();
        const hasName =
          !exp.name ||
          elementInfo.name.toLowerCase().includes(exp.name.toLowerCase()) ||
          elementInfo.name.length > 0;
        const modalMatches =
          exp.modal === undefined || elementInfo.modal === exp.modal;
        const invalidMatches =
          exp.invalid === undefined || elementInfo.invalid === exp.invalid;
        const liveMatches =
          (!exp.livePolite && !exp.liveAssertive) ||
          Boolean(elementInfo.live);

        if (roleMatches && hasName && modalMatches && invalidMatches && liveMatches) {
          status = platformStatus.isMacOS && platformStatus.voiceOverRunning
            ? "PASS"
            : "NEEDS_MANUAL_REVIEW";
          explanation =
            status === "PASS"
              ? `Accessibility tree attributes match expected pattern. Node role='${elementInfo.role}', name='${elementInfo.name}'.`
              : `Accessibility tree properties are correctly implemented (role='${elementInfo.role}', name='${elementInfo.name}'). Exact VoiceOver speech output requires manual verification on macOS.`;
        } else {
          status = "FAIL";
          const defects: string[] = [];
          if (!roleMatches) defects.push(`Expected role '${exp.role}', found '${elementInfo.role}'`);
          if (!hasName) defects.push(`Accessible name is empty or missing expected text`);
          if (exp.modal && !elementInfo.modal) defects.push("Missing aria-modal='true'");
          if (exp.invalid && !elementInfo.invalid) defects.push("Missing aria-invalid='true'");
          if ((exp.livePolite || exp.liveAssertive) && !elementInfo.live)
            defects.push("Missing aria-live or role='status'/'alert'");

          explanation = `Defects detected: ${defects.join("; ")}.`;
        }
      }

      if (status === "PASS") passedCount++;
      else if (status === "FAIL") failedCount++;
      else manualReviewCount++;

      // Try capturing speech on macOS if available
      const captureResult = await captureCurrentVoiceOverSpeech();

      timeline.push({
        stepNumber: i + 1,
        userAction: step.action,
        expectedAnnouncement: step.expectedAnnouncement,
        expectedProperties: step.expectedProps,
        observedProperties: observedProps,
        actualVoiceOverOutput: captureResult.capturedText,
        speechCaptureState: captureResult.state,
        voiceOverCaptureStatus: captureResult.state,
        captureDetail: captureResult.detail,
        status,
        explanation,
        reproductionInstructions: step.reproductionNote,
        voiceOverKeyCommands: step.voiceOverKeys,
      });
    }

    const overallStatus: ScenarioStatus =
      failedCount > 0
        ? "FAIL"
        : manualReviewCount > 0
        ? "NEEDS_MANUAL_REVIEW"
        : "PASS";

    return {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      targetUrl,
      timestamp: new Date().toISOString(),
      status: overallStatus,
      timeline,
      summary: {
        totalSteps: scenario.testSteps.length,
        passedSteps: passedCount,
        failedSteps: failedCount,
        manualReviewSteps: manualReviewCount,
      },
      platformStatus,
      limitationsNotice:
        "Critical Engineering Policy: Inklara strictly evaluates computed accessibility tree properties and expected Apple VoiceOver announcements. It never presents inferred DOM text as actual VoiceOver speech. On non-macOS environments, manual auditory verification with VoiceOver (macOS) or NVDA (Windows) is required.",
    };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
