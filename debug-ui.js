import { chromium } from '@playwright/test'
import { writeFileSync } from 'fs'

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 })
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
  const page = await context.newPage()

  const errors = []
  const consoleMessages = []

  page.on('console', (msg) => consoleMessages.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', (error) => errors.push(`ERROR: ${error.message}`))

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  // Take full page screenshot
  await page.screenshot({ path: 'test-results/debug-full-page.png', fullPage: true })
  console.log('✓ Full page screenshot saved')

  // Test add button specifically
  console.log('\n=== Testing Add Button ===')
  const addButton = page.getByRole('button', { name: /Thêm lịch mới/i })
  const addButtonExists = await addButton.count()
  console.log(`Add button found: ${addButtonExists}`)

  if (addButtonExists > 0) {
    const addButtonVisible = await addButton.isVisible()
    console.log(`Add button visible: ${addButtonVisible}`)

    if (addButtonVisible) {
      await addButton.click()
      await page.waitForTimeout(500)
      console.log('✓ Add button clicked')

      const scheduleCards = page.locator('button[class*="rounded-2xl"]')
      const cardCount = await scheduleCards.count()
      console.log(`Schedule cards after click: ${cardCount}`)

      await page.screenshot({ path: 'test-results/debug-after-add.png', fullPage: true })
    }
  }

  // Check if drag-drop library loaded
  const hasDndKit = await page.evaluate(() => typeof window !== 'undefined')
  console.log(`\nDnD Kit context: ${hasDndKit}`)

  // Save logs
  const report = [
    '=== CONSOLE MESSAGES ===',
    ...consoleMessages,
    '\n=== ERRORS ===',
    ...(errors.length ? errors : ['No errors']),
  ].join('\n')

  writeFileSync('test-results/debug-report.txt', report)
  console.log('\n✓ Debug report saved')
  console.log('\nBrowser will stay open - press Ctrl+C to close')
})()
