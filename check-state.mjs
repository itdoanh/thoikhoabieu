import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.waitForTimeout(3000);

// Check React state
const reactState = await page.evaluate(() => {
  // Try to access React internals
  const root = document.getElementById('root');
  return {
    hasRoot: !!root,
    rootChildren: root?.children.length,
    dayColumns: document.querySelectorAll('[data-day]').length,
  };
});

console.log('React state:', reactState);

// Check console for errors
await page.screenshot({ path: 'test-results/final-check.png', fullPage: true });

await browser.close();
