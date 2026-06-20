import { chromium } from '@playwright/test'

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  console.log('✓ Dashboard loaded - browser window is open for manual inspection')
  console.log('Press Ctrl+C to close the browser')
})()
