import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

page.on('console', msg => {
  const text = msg.text();
  if (!text.includes('Download the React DevTools')) {
    console.log('BROWSER:', text);
  }
});

page.on('pageerror', err => console.log('ERROR:', err.message));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Check if Schedule-X rendered
const calendar = await page.locator('.sx__calendar-wrapper, .sx__week-grid, [class*="schedule-x"]').count();
console.log('\n? Schedule-X elements found:', calendar);

// Check events
const events = await page.locator('[class*="sx__event"], [class*="calendar-event"]').count();
console.log('? Events found:', events);

await page.screenshot({ path: 'test-results/schedule-x-initial.png', fullPage: true });
console.log('? Screenshot saved\n');

await page.waitForTimeout(2000);
await browser.close();
