import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const events = await page.locator('.rbc-event').count();
console.log('Events found:', events);

if (events > 0) {
  const firstEvent = page.locator('.rbc-event').first();
  const box = await firstEvent.boundingBox();
  console.log('First event position:', {
    x: Math.round(box.x),
    y: Math.round(box.y),
    height: Math.round(box.height)
  });
  
  const isVisible = box.y > 0 && box.y < 1000;
  console.log('Is visible?', isVisible ? 'YES ?' : 'NO ?');
}

await page.screenshot({ path: 'test-results/after-fix.png', fullPage: true });
console.log('Screenshot saved');

await browser.close();
