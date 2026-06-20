import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

const logs = [];
page.on('console', msg => {
  const text = msg.text();
  if (text.includes('Converted') || text.includes('start') || text.includes('Monday')) {
    logs.push(text);
    console.log('LOG:', text);
  }
});

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

console.log('\n=== All conversion logs ===');
logs.forEach(log => console.log(log));

await browser.close();
