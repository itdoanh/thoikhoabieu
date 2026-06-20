import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

page.on('console', msg => console.log('CONSOLE:', msg.text()));
page.on('pageerror', err => console.log('ERROR:', err.message));

await page.goto('http://localhost:5173');
await page.waitForTimeout(5000);

const html = await page.content();
console.log('\nHTML length:', html.length);
console.log('Has root div:', html.includes('id="root"') ? 'YES' : 'NO');

await browser.close();
