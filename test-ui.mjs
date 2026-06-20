import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.waitForTimeout(4000);

// Check structure
const dayColumns = await page.locator('[data-day]').count();
console.log('? Day columns:', dayColumns);

// Check if events array is populated
const eventsData = await page.evaluate(() => {
  return window.localStorage.getItem('timecraft_schedule');
});
console.log('? LocalStorage events:', eventsData ? 'YES' : 'NO');

// Check DOM for event cards
const eventCards = await page.locator('button').count();
console.log('? Total buttons:', eventCards);

// Take screenshot
await page.screenshot({ path: 'test-results/debug-ui.png', fullPage: true });
console.log('? Screenshot saved\n');

await browser.close();
