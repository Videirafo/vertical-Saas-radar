import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.DEMO_BASE_URL || 'http://127.0.0.1:3000';
const outDir = 'assets/demo';
const frameDir = `${outDir}/frames`;

await mkdir(frameDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForFunction(() => document.querySelector('#total')?.textContent?.trim() !== '—', null, { timeout: 30_000 });

await page.screenshot({ path: `${outDir}/vertical-saas-radar.png`, fullPage: true });

const captureFrame = async (name, selector) => {
  if (selector) {
    await page.locator(selector).first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
  } else {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);
  }
  await page.screenshot({ path: `${frameDir}/${name}.png`, fullPage: false });
};

await captureFrame('01-overview', null);
await captureFrame('02-summary', '.summary');
await captureFrame('03-signals', '#cards');
await captureFrame('04-watchlist', '#watchlist');

await browser.close();
