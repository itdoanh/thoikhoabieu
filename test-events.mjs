import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.waitForTimeout(4000);

// Try different selectors
const eventCards = await page.locator('[data-day] button').count();
const pointerAuto = await page.locator('.pointer-events-auto').count();
const eventButtons = await page.locator('button[title*="Kéo"]').count();

console.log('? [data-day] button:', eventCards);
console.log('? .pointer-events-auto:', pointerAuto);
console.log('? button[title*="Kéo"]:', eventButtons);

// Take screenshot
await page.screenshot({ path: 'test-results/events-visible.png', fullPage: true });
console.log('? Screenshot saved\n');

await browser.close();
