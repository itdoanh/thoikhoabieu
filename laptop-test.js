import { chromium } from '@playwright/test'

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 })
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  const bodyBox = await page.locator('body').boundingBox()
  console.log(`Body: ${bodyBox.width}×${bodyBox.height}`)

  const hasHorizontalScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth)
  console.log(`Horizontal scroll: ${hasHorizontalScroll ? '❌ YES (overflow)' : '✓ NO'}`)

  await page.screenshot({ path: 'test-results/laptop-1366.png', fullPage: false })
  console.log('✓ Screenshot saved: laptop-1366.png')

  // Test editing works
  await page.getByRole('button', { name: /Thêm lịch mới/i }).click()
  await page.getByLabel('Tiêu đề').fill('Test laptop 1366px')
  await page.screenshot({ path: 'test-results/laptop-1366-edit.png' })
  console.log('✓ Edit panel accessible')

  console.log('\n✓ Laptop test complete - browser open for inspection')
  console.log('Press Ctrl+C to close')
})()
