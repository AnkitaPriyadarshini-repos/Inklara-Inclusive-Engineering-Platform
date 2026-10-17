import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function capture() {
  const outputDir = path.resolve(process.cwd(), "screenshots");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1280x800
  console.log("Capturing Desktop 1280x800 screenshots...");
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await desktopContext.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  const walkthrough = page.locator("#walkthrough");
  await walkthrough.scrollIntoViewIfNeeded();

  // Pause playback so tabs don't change while capturing
  const pauseBtn = page.getByRole("button", { name: /Pause demonstration/i });
  if (await pauseBtn.isVisible()) {
    await pauseBtn.click();
  }

  // Capture each of the 5 stages
  const stages = [
    { num: 1, name: "stage-01-discover" },
    { num: 2, name: "stage-02-inspect" },
    { num: 3, name: "stage-03-remediate" },
    { num: 4, name: "stage-04-verify" },
    { num: 5, name: "stage-05-report" },
  ];

  for (const s of stages) {
    const stageBtn = page.getByRole("button", { name: new RegExp(`0${s.num}`) });
    await stageBtn.click();
    await page.waitForTimeout(300);
    const screenshotPath = path.join(outputDir, `desktop-${s.name}.png`);
    await walkthrough.screenshot({ path: screenshotPath });
    console.log(`Saved: ${screenshotPath}`);
  }

  // 2. Tablet 768x1024 (Stage 3 Remediate)
  console.log("Capturing Tablet 768x1024 screenshot...");
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 2,
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const tabletWalkthrough = tabletPage.locator("#walkthrough");
  await tabletWalkthrough.scrollIntoViewIfNeeded();
  const tabletPause = tabletPage.getByRole("button", { name: /Pause demonstration/i });
  if (await tabletPause.isVisible()) await tabletPause.click();
  await tabletPage.getByRole("button", { name: /03/ }).click();
  await tabletPage.waitForTimeout(300);
  const tabletPath = path.join(outputDir, "tablet-stage-03-remediate.png");
  await tabletWalkthrough.screenshot({ path: tabletPath });
  console.log(`Saved: ${tabletPath}`);

  // 3. Mobile 375x667 (Stage 3 Remediate)
  console.log("Capturing Mobile 375x667 screenshot...");
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const mobileWalkthrough = mobilePage.locator("#walkthrough");
  await mobileWalkthrough.scrollIntoViewIfNeeded();
  const mobilePause = mobilePage.getByRole("button", { name: /Pause demonstration/i });
  if (await mobilePause.isVisible()) await mobilePause.click();
  await mobilePage.getByRole("button", { name: /03/ }).click();
  await mobilePage.waitForTimeout(300);
  const mobilePath = path.join(outputDir, "mobile-375-stage-03-remediate.png");
  await mobileWalkthrough.screenshot({ path: mobilePath });
  console.log(`Saved: ${mobilePath}`);

  // 4. Mobile 320x640 (Stage 3 Remediate)
  console.log("Capturing Mobile 320x640 screenshot...");
  const mobile320Context = await browser.newContext({
    viewport: { width: 320, height: 640 },
    deviceScaleFactor: 2,
  });
  const mobile320Page = await mobile320Context.newPage();
  await mobile320Page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const mobile320Walkthrough = mobile320Page.locator("#walkthrough");
  await mobile320Walkthrough.scrollIntoViewIfNeeded();
  const mobile320Pause = mobile320Page.getByRole("button", { name: /Pause demonstration/i });
  if (await mobile320Pause.isVisible()) await mobile320Pause.click();
  await mobile320Page.getByRole("button", { name: /03/ }).click();
  await mobile320Page.waitForTimeout(300);
  const mobile320Path = path.join(outputDir, "mobile-320-stage-03-remediate.png");
  await mobile320Walkthrough.screenshot({ path: mobile320Path });
  console.log(`Saved: ${mobile320Path}`);

  await browser.close();
  console.log("All screenshots captured successfully.");
}

capture().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
