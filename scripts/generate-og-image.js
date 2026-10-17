const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

async function generateOgImage() {
  const svgPath = path.resolve(__dirname, "../public/brand/inklara-social-preview.svg");
  const outPngPath1 = path.resolve(__dirname, "../public/brand/inklara-social-preview.png");
  const outPngPath2 = path.resolve(__dirname, "../public/og-image.png");

  if (!fs.existsSync(svgPath)) {
    console.error("SVG source does not exist:", svgPath);
    process.exit(1);
  }

  const svgContent = fs.readFileSync(svgPath, "utf-8");
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1200px; height: 630px; overflow: hidden; background: #05070e; }
          svg { width: 1200px; height: 630px; display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;

  console.log("Launching headless Playwright Chromium to render OG image...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  await page.setContent(htmlContent);
  await page.waitForTimeout(300);

  await page.screenshot({ path: outPngPath1, type: "png" });
  await page.screenshot({ path: outPngPath2, type: "png" });

  await browser.close();
  console.log("Successfully generated:", outPngPath1);
  console.log("Successfully generated:", outPngPath2);
}

generateOgImage().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
