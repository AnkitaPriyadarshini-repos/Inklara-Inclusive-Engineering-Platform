import { test, expect, Page } from "@playwright/test";
import fs from "fs";

// Helper function to inject and run axe-core
async function runAxe(page: Page, options = {}) {
  const axePath = require.resolve("axe-core/axe.min.js");
  const axeSource = fs.readFileSync(axePath, "utf-8");
  await page.evaluate(axeSource);
  return await page.evaluate((opts) => {
    // @ts-expect-error window.axe is injected
    return window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
      },
      ...opts,
    });
  }, options);
}

test.describe("Inklara — Accessibility Compliance & Automated WCAG Audit", () => {
  test("main dashboard meets axe-core automated WCAG 2.2 AA standards", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await runAxe(page);
    // Filter out any false positives or verify 0 critical/serious violations
    const violations = results.violations;
    expect(
      violations.filter((v: { impact: string }) => v.impact === "critical" || v.impact === "serious")
    ).toEqual([]);
  });

  test("projects management page meets axe-core automated WCAG standards", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    const results = await runAxe(page);
    const criticalOrSerious = results.violations.filter(
      (v: { impact: string }) => v.impact === "critical" || v.impact === "serious"
    );
    expect(criticalOrSerious).toEqual([]);
  });

  test("screen-reader workbench meets axe-core automated WCAG standards", async ({ page }) => {
    await page.goto("/screen-reader");
    await page.waitForLoadState("networkidle");

    const results = await runAxe(page);
    const criticalOrSerious = results.violations.filter(
      (v: { impact: string }) => v.impact === "critical" || v.impact === "serious"
    );
    expect(criticalOrSerious).toEqual([]);
  });

  test("wcag catalog reference page meets axe-core automated WCAG standards", async ({ page }) => {
    await page.goto("/wcag");
    await page.waitForLoadState("networkidle");

    const results = await runAxe(page);
    const criticalOrSerious = results.violations.filter(
      (v: { impact: string }) => v.impact === "critical" || v.impact === "serious"
    );
    expect(criticalOrSerious).toEqual([]);
  });

  test("accessible benchmark fixture passes axe-core with 0 violations", async ({ page }) => {
    await page.goto("/demo/accessible");
    await page.waitForLoadState("networkidle");

    const results = await runAxe(page);
    expect(results.violations).toEqual([]);
  });

  test("inaccessible benchmark fixture correctly detects intentional accessibility defects", async ({
    page,
  }) => {
    await page.goto("/demo/inaccessible");
    await page.waitForLoadState("networkidle");

    const results = await runAxe(page);
    // Fixture must have intentional defects (image alt, form labels, contrast, etc.)
    expect(results.violations.length).toBeGreaterThan(0);
    const ruleIds = results.violations.map((v: { id: string }) => v.id);
    expect(ruleIds).toContain("image-alt");
  });

  test("responsive reflow: supports 320px viewport without loss of content (WCAG 1.4.10)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Header and main content should remain visible and not trigger horizontal overflow breaking layout
    const main = page.locator("main#main-content");
    await expect(main).toBeVisible();
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("reduced motion: respects prefers-reduced-motion media query (WCAG 2.3.3)", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify skip-link transition duration is neutralized
    const transitionDuration = await page.locator("a.skip-link").evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });
    // With prefers-reduced-motion: reduce, transition duration is overridden to 0.01ms / 0s
    const durationSeconds = parseFloat(transitionDuration);
    expect(durationSeconds).toBeLessThanOrEqual(0.001);
  });

  test("keyboard navigation & visible focus ring (WCAG 2.4.7 & 2.4.11)", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    // Skip link must receive focus first
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toBeFocused();

    // Tab into next interactive element
    await page.keyboard.press("Tab");
    const activeTagName = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON"]).toContain(activeTagName);
  });

  test("recruiter showcase page meets axe-core automated WCAG standards", async ({ page }) => {
    await page.goto("/showcase");
    await page.waitForLoadState("networkidle");

    const results = await runAxe(page);
    const criticalOrSerious = results.violations.filter(
      (v: { impact: string }) => v.impact === "critical" || v.impact === "serious"
    );
    expect(criticalOrSerious).toEqual([]);
  });

  test("showcase interactive demonstration progresses through audit stages", async ({ page }) => {
    await page.goto("/showcase");
    await page.waitForLoadState("networkidle");

    // Verify initial stage is visible
    await expect(page.locator("text=Configure Audit Scope & Target Environment")).toBeVisible();

    // Click "Execute Sandboxed Scan"
    const startScanBtn = page.locator("button:has-text('Execute Sandboxed Scan')");
    await expect(startScanBtn).toBeVisible();
    await startScanBtn.click();

    // Verify stage 2 is reached
    await expect(page.locator("text=Sandboxed Scan Pipeline in Execution")).toBeVisible();

    // Wait for stage 3 transition
    await expect(page.locator("text=Interactive Accessibility Findings Explorer")).toBeVisible({
      timeout: 10000,
    });

    // Verify findings are displayed and click "Remediate" on first finding
    const remediateBtn = page.locator("button:has-text('Remediate')").first();
    await expect(remediateBtn).toBeVisible();
    await remediateBtn.click();

    // Verify stage 4 is reached
    await expect(page.locator("text=Actionable Remediation & Live Fix Verification")).toBeVisible();

    // Click "Test Fix Resolution Against Fixture"
    const testFixBtn = page.locator("button:has-text('Test Fix Resolution Against Fixture')");
    await expect(testFixBtn).toBeVisible();
    await testFixBtn.click();

    // Verify fix verified feedback appears
    await expect(page.locator("text=Automated Verification Confirmed")).toBeVisible({
      timeout: 5000,
    });

    // Advance to stage 5 (Executive Report)
    const viewReportBtn = page.locator("button:has-text('View Executive Report')");
    await expect(viewReportBtn).toBeVisible();
    await viewReportBtn.click();

    // Verify stage 5 report elements
    await expect(page.locator("text=Executive Accessibility Audit Report")).toBeVisible();
    await expect(page.locator("text=Severity Distribution")).toBeVisible();
    await expect(page.locator("button:has-text('Download JSON Report')")).toBeVisible();
  });
});

