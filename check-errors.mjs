import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') {
    errors.push(msg.text());
    console.log('ERROR:', msg.text());
  }
});

page.on('pageerror', err => {
  console.log('PAGE ERROR:', err.message);
});

await page.goto('http://localhost:5173');
await page.waitForTimeout(3000);

if (errors.length === 0) {
  console.log('\n? No errors detected');
} else {
  console.log(`\n? Total errors: ${errors.length}`);
}

await browser.close();
