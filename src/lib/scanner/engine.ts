import { chromium, type Browser, type Page, type Request } from "playwright";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { validateTargetUrl } from "./ssrf";
import { sanitizeHtmlSnippet, computeFindingFingerprint } from "./sanitizer";
import { mapRuleToWcagCriteria } from "../wcag/catalog";
import type {
  AuditExecutionOptions,
  FindingImpact,
  NormalizedFinding,
  PageScanResult,
} from "./types";

// Cache axe-core source bundle once loaded
let axeSourceCache: string | null = null;

async function getAxeSource(): Promise<string> {
  if (axeSourceCache) return axeSourceCache;
  try {
    const axePath = require.resolve("axe-core/axe.min.js");
    axeSourceCache = await fs.readFile(axePath, "utf-8");
    return axeSourceCache;
  } catch (err) {
    // Fallback if require.resolve is not available in bundled environment
    const directPath = path.join(
      process.cwd(),
      "node_modules",
      "axe-core",
      "axe.min.js"
    );
    axeSourceCache = await fs.readFile(directPath, "utf-8");
    return axeSourceCache;
  }
}

/**
 * Executes an automated accessibility evaluation on a target URL using Playwright and axe-core.
 * Enforces SSRF checks on initial URL and on all outgoing requests and redirects.
 */
export async function scanPage(
  targetUrl: string,
  options?: {
    timeoutMs?: number;
    allowLocalScanning?: boolean;
    wcagTags?: string[];
  }
): Promise<PageScanResult> {
  const timeoutMs = options?.timeoutMs ?? 30000;
  const allowLocal = options?.allowLocalScanning ?? process.env.ALLOW_LOCAL_SCANNING === "true";
  const wcagTags = options?.wcagTags ?? [
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
    "best-practice",
  ];

  // 1. Validate Target URL for SSRF
  const initialSsrf = await validateTargetUrl(targetUrl, {
    allowLocalScanning: allowLocal,
  });
  if (!initialSsrf.isValid) {
    throw new Error(`SSRF Block: ${initialSsrf.error}`);
  }

  const startTime = Date.now();
  let browser: Browser | null = null;

  try {
    // 2. Launch Sandboxed Chromium
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Inklara/1.0",
      viewport: { width: 1280, height: 800 },
      permissions: [], // Deny all permissions (geo, notifications, camera, mic)
      ignoreHTTPSErrors: allowLocal, // Only ignore HTTPS self-signed certificates in local dev mode
    });

    const page = await context.newPage();

    // 3. Attach Safe Request/Redirect Inspector to Block Server-Side Request Forgery
    await page.route("**/*", async (route) => {
      const request: Request = route.request();
      const reqUrl = request.url();

      // Only check HTTP/HTTPS requests
      if (reqUrl.startsWith("http://") || reqUrl.startsWith("https://")) {
        const ssrfCheck = await validateTargetUrl(reqUrl, {
          allowLocalScanning: allowLocal,
        });

        if (!ssrfCheck.isValid) {
          // Abort blocked internal or metadata destination
          await route.abort("accessdenied");
          return;
        }
      } else if (
        reqUrl.startsWith("data:") ||
        reqUrl.startsWith("about:") ||
        reqUrl.startsWith("blob:")
      ) {
        // Safe in-memory schemes allowed
      } else {
        // Abort any unsupported or dangerous protocol schemes (e.g. file://, gopher://, ftp://)
        await route.abort("accessdenied");
        return;
      }

      await route.continue();
    });

    // 4. Navigate to Page
    const response = await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: timeoutMs,
    });

    const statusCode = response?.status() ?? 200;
    const title = await page.title().catch(() => "Untitled Page");

    // Wait a brief tick for rendering or hydration if necessary
    await page.waitForTimeout(500);

    // 5. Inject axe-core
    const axeScript = await getAxeSource();
    await page.evaluate(axeScript);

    // 6. Run axe-core with WCAG 2.2 AA target rules
    const axeResults = await page.evaluate(
      (runTags) => {
        // @ts-expect-error window.axe injected above
        return window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: runTags,
          },
          resultTypes: ["violations", "incomplete", "passes", "inapplicable"],
        });
      },
      wcagTags
    );

    const loadTimeMs = Date.now() - startTime;

    // 7. Normalize Findings
    const findings: NormalizedFinding[] = [];
    let criticalCount = 0;
    let seriousCount = 0;
    let moderateCount = 0;
    let minorCount = 0;

    for (const v of axeResults.violations) {
      const impact = (v.impact || "minor") as FindingImpact;
      if (impact === "critical") criticalCount++;
      else if (impact === "serious") seriousCount++;
      else if (impact === "moderate") moderateCount++;
      else minorCount++;

      for (const node of v.nodes) {
        const selector = node.target.join(" ");
        const htmlSnippet = sanitizeHtmlSnippet(node.html || "");
        const fingerprint = computeFindingFingerprint(
          v.id,
          selector,
          node.html || ""
        );
        const mappedWcag = mapRuleToWcagCriteria(v.id, v.tags).map((c) => c.id);

        findings.push({
          ruleId: v.id,
          ruleTitle: v.help,
          ruleDescription: v.description,
          ruleHelpUrl: v.helpUrl,
          impact,
          wcagCriteria: mappedWcag,
          selector,
          htmlSnippet,
          failureSummary: node.failureSummary,
          fingerprint,
        });
      }
    }

    // 8. Normalize Incomplete Findings (require manual human inspection)
    const incompleteFindings: NormalizedFinding[] = [];
    for (const inc of axeResults.incomplete) {
      const impact = (inc.impact || "moderate") as FindingImpact;
      for (const node of inc.nodes) {
        const selector = node.target.join(" ");
        const htmlSnippet = sanitizeHtmlSnippet(node.html || "");
        const fingerprint = computeFindingFingerprint(
          inc.id,
          selector,
          node.html || ""
        );
        const mappedWcag = mapRuleToWcagCriteria(inc.id, inc.tags).map(
          (c) => c.id
        );

        incompleteFindings.push({
          ruleId: inc.id,
          ruleTitle: inc.help,
          ruleDescription: inc.description,
          ruleHelpUrl: inc.helpUrl,
          impact,
          wcagCriteria: mappedWcag,
          selector,
          htmlSnippet,
          failureSummary: node.failureSummary,
          fingerprint,
        });
      }
    }

    return {
      url: targetUrl,
      title: title || targetUrl,
      loadTimeMs,
      statusCode,
      violationsCount: findings.length,
      incompleteCount: incompleteFindings.length,
      passesCount: axeResults.passes?.length ?? 0,
      inapplicableCount: axeResults.inapplicable?.length ?? 0,
      criticalCount,
      seriousCount,
      moderateCount,
      minorCount,
      findings,
      incompleteFindings,
    };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
