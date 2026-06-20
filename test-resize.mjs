import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.waitForTimeout(4000);

// Check resize handles
const resizeHandles = await page.locator('.cursor-ns-resize').count();
console.log('? Resize handles found:', resizeHandles);

// Check if events have group class
const eventGroups = await page.locator('.group').count();
console.log('? Event cards with hover:', eventGroups);

// Take screenshot
await page.screenshot({ path: 'test-results/resize-feature.png', fullPage: true });
console.log('? Screenshot: test-results/resize-feature.png');

// Hover over first event to see handles
const firstEvent = page.locator('[data-day] button').first();
await firstEvent.hover();
await page.waitForTimeout(1000);

await page.screenshot({ path: 'test-results/resize-hover.png', fullPage: false });
console.log('? Hover screenshot: test-results/resize-hover.png\n');

await browser.close();
