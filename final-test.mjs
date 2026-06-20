import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.waitForTimeout(4000);

// Check DayPilot rendering
const calendar = await page.locator('.daypilot_calendar_main').count();
const events = await page.locator('.daypilot_calendar_event').count();
const cells = await page.locator('.daypilot_calendar_cell').count();

console.log('? DayPilot calendar:', calendar);
console.log('? Events rendered:', events);
console.log('? Calendar cells:', cells);

// Check if events are visible
if (events > 0) {
  const firstEvent = page.locator('.daypilot_calendar_event').first();
  const box = await firstEvent.boundingBox();
  console.log('? First event position:', { x: Math.round(box.x), y: Math.round(box.y) });
  console.log('? Event visible:', box.y > 0 && box.y < 1000 ? 'YES' : 'NO');
}

await page.screenshot({ path: 'test-results/daypilot-final.png', fullPage: true });
console.log('? Screenshot saved\n');

await browser.close();
