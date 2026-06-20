import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
page.on('console', msg => console.log('BROWSER:', msg.text()));
page.on('pageerror', err => console.log('ERROR:', err.message));
await page.goto('http://localhost:5173');
await page.waitForTimeout(3000);
await browser.close();
