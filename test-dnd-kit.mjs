import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.waitForTimeout(4000);

// Check UI
const dayColumns = await page.locator('[data-day]').count();
const events = await page.locator('button[title*="Kéo"]').count();
const headers = await page.locator('.rounded-2xl.bg-gradient-to-br.from-white\\/15').count();

console.log('? Day columns:', dayColumns);
console.log('? Events found:', events);
console.log('? Day headers:', headers);

if (events > 0) {
  const firstEvent = page.locator('button[title*="Kéo"]').first();
  const box = await firstEvent.boundingBox();
  console.log('? First event position:', { x: Math.round(box.x), y: Math.round(box.y) });
  console.log('? Event visible:', box.y > 0 && box.y < 1000 ? 'YES ?' : 'NO ?');
}

await page.screenshot({ path: 'test-results/dnd-kit-final.png', fullPage: true });
console.log('\n? Screenshot saved: test-results/dnd-kit-final.png\n');

await browser.close();
