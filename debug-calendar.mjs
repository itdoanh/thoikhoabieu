import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

page.on('console', msg => {
  const text = msg.text();
  if (text.includes('DayColumn') || text.includes('events') || text.includes('arranged')) {
    console.log('??', text);
  }
});

await page.goto('http://localhost:5173');
await page.waitForTimeout(4000);

// Count events in calendar
const calendarEvents = await page.locator('[data-day]').first().locator('.pointer-events-auto').count();
console.log('\n? Events in first day column:', calendarEvents);

await browser.close();
