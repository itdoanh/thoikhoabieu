import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.waitForTimeout(3000);

// Check filter state
const filterState = await page.evaluate(() => {
  return {
    searchValue: document.querySelector('input[placeholder*="Tìm"]')?.value || '',
    buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()).slice(0, 15),
  };
});

console.log('Search input:', filterState.searchValue);
console.log('First 15 buttons:', filterState.buttons);

await browser.close();
