import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto('http://localhost:5173');
await page.waitForTimeout(3000);
await page.screenshot({ path: 'test-results/improved-ui.png', fullPage: true });
console.log('Screenshot saved: test-results/improved-ui.png');
await page.waitForTimeout(2000);
await browser.close();
