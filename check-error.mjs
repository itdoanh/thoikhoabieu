import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

const errors = [];
page.on('console', msg => {
  const text = msg.text();
  errors.push(text);
  console.log('LOG:', text);
});

await page.goto('http://localhost:5173');
await page.waitForTimeout(3000);

console.log('\nTotal logs:', errors.length);

await browser.close();
