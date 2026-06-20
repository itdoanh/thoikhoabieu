import { chromium } from '@playwright/test'

(async () => {
  console.log('🚀 Testing continuous timeline layout...\n')

  const browser = await chromium.launch({ headless: false, slowMo: 600 })
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  console.log('📝 Test 1: Timeline layout (continuous columns)...')
  await page.screenshot({ path: 'test-results/timeline-01-full.png', fullPage: true })
  console.log('✓ Screenshot saved\n')

  console.log('📝 Test 2: Events positioned by time...')
  const dayColumns = page.locator('.min-h-\\[600px\\]')
  const columnCount = await dayColumns.count()
  console.log(`  Found ${columnCount} day columns (should be 7)`)
  console.log(columnCount === 7 ? '✓ All 7 days visible\n' : '❌ Columns missing\n')

  console.log('📝 Test 3: Click timeline to add event...')
  if (columnCount > 0) {
    const firstCol = dayColumns.first()
    const box = await firstCol.boundingBox()

    // Click at 30% down (around 11:00)
    await page.mouse.click(box.x + box.width/2, box.y + box.height * 0.3)
    await page.waitForTimeout(500)
    console.log('✓ Clicked timeline at ~11:00\n')

    await page.screenshot({ path: 'test-results/timeline-02-added.png', fullPage: true })
  }

  console.log('📝 Test 4: Events don\'t overlap (side-by-side)...')
  await page.screenshot({ path: 'test-results/timeline-03-overlap-test.png' })
  console.log('✓ Screenshot saved for manual inspection\n')

  console.log('=' .repeat(50))
  console.log('✅ Timeline layout test complete!')
  console.log('=' .repeat(50))
  console.log('\n📋 Check screenshots:')
  console.log('  - timeline-01-full.png: Full week view')
  console.log('  - timeline-02-added.png: After click-to-add')
  console.log('  - timeline-03-overlap-test.png: Overlap handling')
  console.log('\n🌐 Browser staying open for manual testing')
  console.log('Press Ctrl+C to close')
})()
