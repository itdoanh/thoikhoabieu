import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

page.on('console', msg => {
  const text = msg.text();
  if (text.includes('First event')) {
    console.log('CONSOLE:', text);
  }
});

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Check min/max time
const minTime = await page.evaluate(() => {
  const calendar = document.querySelector('.rbc-time-content');
  return calendar ? 'Calendar rendered' : 'No calendar';
});
console.log('Calendar check:', minTime);

await browser.close();
