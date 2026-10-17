const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function render() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 680, deviceScaleFactor: 2 } });
  
  const svgPath = path.resolve('public/brand/inklara-preview.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  await page.setContent(`<!DOCTYPE html><html><head><style>* { margin: 0; padding: 0; } body { background: #f8fafc; }</style></head><body>${svgContent}</body></html>`);
  
  await page.screenshot({ path: 'public/brand/inklara-preview.png', type: 'png' });
  await page.screenshot({ path: 'public/brand/inklara-social-preview.png', type: 'png' });
  console.log('Successfully generated public/brand/inklara-preview.png and inklara-social-preview.png');
  await browser.close();
}

render().catch(err => {
  console.error(err);
  process.exit(1);
});
