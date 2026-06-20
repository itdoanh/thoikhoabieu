import { chromium } from '@playwright/test'

(async () => {
  console.log('🚀 Testing new period-based layout...\n')

  const browser = await chromium.launch({ headless: false, slowMo: 600 })
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  console.log('📝 Test 1: Period labels (Sáng/Chiều/Tối)...')
  const sangLabel = await page.getByText('Sáng', { exact: true }).count()
  const chieuLabel = await page.getByText('Chiều', { exact: true }).count()
  const toiLabel = await page.getByText('Tối', { exact: true }).count()

  console.log(`  Sáng: ${sangLabel} | Chiều: ${chieuLabel} | Tối: ${toiLabel}`)
  console.log(sangLabel && chieuLabel && toiLabel ? '✓ All 3 periods visible\n' : '❌ Periods missing\n')

  await page.screenshot({ path: 'test-results/periods-01-layout.png', fullPage: true })

  console.log('📝 Test 2: Events distributed by period...')
  await page.screenshot({ path: 'test-results/periods-02-events.png' })
  console.log('✓ Screenshot saved\n')

  console.log('📝 Test 3: Click empty period cell to add...')
  const cells = page.locator('.bg-slate-950\\/35')
  const cellCount = await cells.count()
  console.log(`  Found ${cellCount} cells (should be 21: 7 days × 3 periods)`)

  // Try clicking an empty cell
  if (cellCount > 0) {
    await cells.nth(10).click({ force: true })
    await page.waitForTimeout(500)
    console.log('✓ Clicked empty cell\n')
  }

  await page.screenshot({ path: 'test-results/periods-03-final.png', fullPage: true })

  console.log('=' .repeat(50))
  console.log('✅ Period-based layout test complete!')
  console.log('=' .repeat(50))
  console.log('\n🌐 Browser staying open')
  console.log('Press Ctrl+C to close')
})()
