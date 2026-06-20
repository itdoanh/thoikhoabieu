import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});

await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 10000 });
await page.waitForTimeout(4000);

// Check DayPilot
const daypilot = await page.locator('.daypilot_calendar_main, [class*="daypilot"]').count();
console.log('DayPilot elements:', daypilot);

// Check general calendar
const anyCalendar = await page.locator('[class*="calendar"], [class*="schedule"]').count();
console.log('Any calendar elements:', anyCalendar);

await page.screenshot({ path: 'test-results/daypilot-test.png', fullPage: true });
console.log('Screenshot saved');

if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(e => console.log('  -', e.substring(0, 100)));
}

await page.waitForTimeout(1000);
await browser.close();
