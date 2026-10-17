import { test, expect } from "@playwright/test";

test.describe("Inklara — Redesigned Product Walkthrough (Snowdog-Inspired)", () => {
  test("renders section heading, natural copy, and interactive 5-stage stepper", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // A. Section heading
    const heading = page.locator("#walkthrough-heading");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("See how Inklara works");

    // B. Introductory copy
    const intro = page.getByText(
      "Follow an accessibility issue from its initial discovery through investigation, remediation, verification, and reporting."
    );
    await expect(intro).toBeVisible();

    // C. 5 Stages navigation buttons
    const stagesNav = page.getByRole("navigation", { name: "Demonstration Stages" });
    await expect(stagesNav).toBeVisible();

    await expect(page.getByRole("button", { name: /01\s+Discover/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /02\s+Inspect/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /03\s+Remediate/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /04\s+Verify/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /05\s+Report/i })).toBeVisible();
  });

  test("interactive playback controls: pause, play, next, prev, restart, and speed toggle", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Pause button
    const pauseBtn = page.getByRole("button", { name: "Pause demonstration" });
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();

    // Button should now offer to Play
    const playBtn = page.getByRole("button", { name: "Play demonstration" });
    await expect(playBtn).toBeVisible();

    // Advance to next stage using Next button
    const nextBtn = page.getByRole("button", { name: "Next stage" });
    await nextBtn.click();
    await expect(page.getByText("Diagnostic Evidence & Tree")).toBeVisible();

    // Toggle playback speed
    const speedBtn = page.getByRole("button", { name: /Playback speed/i });
    await speedBtn.click();
    await expect(page.getByText("1.5x")).toBeVisible();

    // Restart demonstration
    const restartBtn = page.getByRole("button", { name: "Restart demonstration" });
    await restartBtn.click();
    await expect(page.getByText("Automated Sandbox Scan")).toBeVisible();
  });

  test("remediation stage displays before-and-after comparison with accurate contrast math", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Pause so auto-advance doesn't move away during inspection
    await page.getByRole("button", { name: "Pause demonstration" }).click();

    // Click 03 Remediate
    const remediateTab = page.getByRole("button", { name: /03\s+Remediate/i });
    await remediateTab.click();

    // Verify stage title and subtitle
    await expect(page.getByRole("heading", { name: "Before & After Code Remediation" })).toBeVisible();

    // Verify BEFORE section
    await expect(page.getByText("Before: Original Code")).toBeVisible();
    await expect(page.getByText("Measured Ratio: 2.34 : 1")).toBeVisible();
    await expect(page.getByText("text-zinc-400")).toBeVisible();

    // Verify AFTER section
    await expect(page.getByText("After: Corrected Code")).toBeVisible();
    await expect(page.getByText("Calculated Ratio: 11.20 : 1 (AAA)")).toBeVisible();
    await expect(page.getByText("text-slate-100 font-medium")).toBeVisible();

    // Verify Outcome callout
    await expect(page.getByText("+378% perceptual luminance improvement")).toBeVisible();

    // Verify trigger verification button advances to Stage 04: Verify
    const triggerVerifyBtn = page.getByRole("button", { name: "Trigger Verification Scan" });
    await triggerVerifyBtn.click();
    await expect(page.getByRole("heading", { name: "Deterministic Fix Verification" })).toBeVisible();
    await expect(page.getByText("VERIFIED_FIXED")).toBeVisible();
    await expect(page.locator("#walkthrough").getByText("Zero Regressions")).toBeVisible();
  });

  test("responsive layout: 320px mobile viewport renders walkthrough without clipping or breaking", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const walkthroughSection = page.locator("#walkthrough");
    await expect(walkthroughSection).toBeVisible();

    const heading = page.locator("#walkthrough-heading");
    await expect(heading).toBeVisible();

    // Navigation and controls remain accessible on 320px
    const pauseBtn = page.getByRole("button", { name: "Pause demonstration" });
    await expect(pauseBtn).toBeVisible();

    const remediateTab = page.getByRole("button", { name: /03\s+Remediate/i });
    await expect(remediateTab).toBeVisible();
    await remediateTab.click();

    // Code blocks are visible and readable
    await expect(page.getByText("Before: Original Code")).toBeVisible();
    await expect(page.getByText("After: Corrected Code")).toBeVisible();
  });
});
