import { test, expect } from "@playwright/test";

test.describe("Inklara — Inclusive Engineering Platform Workbench Flow", () => {
  test("accessibility foundations: skip-link and keyboard focus", async ({ page }) => {
    await page.goto("/");

    // Skip link must exist in DOM and be accessible
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute("href", "#main-content");

    // Main landmark must have id="main-content"
    const mainLandmark = page.locator("main#main-content");
    await expect(mainLandmark).toBeAttached();
  });

  test("modal dialog accessibility: focus trap and Escape key dismissal", async ({ page }) => {
    await page.goto("/");

    // Trigger New Project Modal
    const newProjectBtn = page.getByRole("button", { name: "New Project" });
    await newProjectBtn.click();

    // Dialog must have role="dialog" and aria-modal="true"
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute("aria-modal", "true");

    // Focus must land inside the modal
    const projectNameInput = page.locator("#modal-project-name");
    await expect(projectNameInput).toBeFocused();

    // Press Escape to dismiss
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();

    // Focus must be restored to the opening trigger button
    await expect(newProjectBtn).toBeFocused();
  });

  test("test fixtures render properly with intentional defects and remedies", async ({ page }) => {
    // 1. Inaccessible fixture
    await page.goto("/demo/inaccessible");
    await expect(page.locator("h1")).toHaveText("Checkout Portal");
    // Verify missing alt
    const unaccessibleImg = page.locator("img");
    await expect(unaccessibleImg).not.toHaveAttribute("alt");

    // 2. Remediated accessible fixture
    await page.goto("/demo/accessible");
    const accessibleImg = page.locator("img");
    await expect(accessibleImg).toHaveAttribute("alt", /256-bit SSL encrypted/);
    await expect(page.locator("a.skip-link")).toBeAttached();
  });

  test("end-to-end scan, manual evaluation, and report export", async ({ page }) => {
    // 1. Visit dashboard and seed benchmark fixtures
    await page.goto("/");
    const seedBtn = page.getByRole("button", { name: /Seed Benchmark Fixtures/i });
    if (await seedBtn.isVisible()) {
      await seedBtn.click();
      await page.waitForTimeout(1000);
    }

    // 2. Open Execute Audit Modal
    const executeBtn = page.getByRole("button", { name: "Execute Audit" });
    await executeBtn.click();

    // 3. Select Inaccessible Demo preset
    const inaccessiblePreset = page.getByRole("button", { name: /Inaccessible Demo/i });
    await inaccessiblePreset.click();

    // 4. Submit audit
    const startBtn = page.getByRole("button", { name: "Start Evaluation" });
    await startBtn.click();

    // 5. Expect navigation to audit results page
    await expect(page).toHaveURL(/\/audits\/[a-zA-Z0-9]+/, { timeout: 35000 });

    // 6. Verify automated findings detected
    const findingsTab = page.getByRole("button", { name: /Automated Findings/i });
    await expect(findingsTab).toBeVisible();

    // 7. Verify Guided Manual Checklist Tab
    const manualTab = page.getByRole("button", { name: /Guided Manual Checklist/i });
    await manualTab.click();
    await expect(page.getByText("WCAG-EM Human Evaluation Required")).toBeVisible();

    // 8. View Audit Report
    const reportLink = page.getByRole("link", { name: /Audit Report & PDF/i });
    await reportLink.click();
    await expect(page).toHaveURL(/\/report$/);
    await expect(
      page.getByText("Evaluation Scope & Non-Certification Notice")
    ).toBeVisible();
  });

  test("screen-reader testing workbench: scenario evaluation and announcement timeline", async ({
    page,
  }) => {
    // 1. Visit Screen Reader Testing Workbench
    await page.goto("/screen-reader");
    await expect(page.locator("h1")).toHaveText(
      "Screen Reader Scenario Runner & Announcement Timeline"
    );

    // 2. Verify platform status card renders
    await expect(page.getByText("Assistive Technology Environment")).toBeVisible();

    // 3. Select Controlled Screen Reader Fixture preset
    const presetBtn = page.getByRole("button", {
      name: /Controlled Screen Reader Fixture/i,
    });
    await presetBtn.click();

    // 4. Click Run Scenario Evaluation
    const runBtn = page.getByRole("button", {
      name: /Run Scenario Evaluation/i,
    });
    await runBtn.click();

    // 5. Verify Announcement Timeline output appears
    const timelineHeading = page.locator("#timeline-heading");
    await expect(timelineHeading).toBeVisible({ timeout: 35000 });
    await expect(timelineHeading).toContainText("Announcement Timeline");

    // 6. Verify Expected Screen Reader Speech cards render
    await expect(
      page.getByText("Expected Screen Reader Speech").first()
    ).toBeVisible();
    await expect(
      page.getByText("Observed Accessibility Tree Node").first()
    ).toBeVisible();
    await expect(
      page.getByText("VoiceOver Test Commands:").first()
    ).toBeVisible();
  });
});
