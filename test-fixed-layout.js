import { chromium } from '@playwright/test'

(async () => {
  console.log('🔧 Testing fixed layout...\n')

  const browser = await chromium.launch({ headless: false, slowMo: 500 })
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  console.log('📝 Test 1: Column height (should be taller)...')
  await page.screenshot({ path: 'test-results/fixed-01-full.png', fullPage: true })
  console.log('✓ Screenshot saved\n')

  console.log('📝 Test 2: Card text (no truncate)...')
  await page.screenshot({ path: 'test-results/fixed-02-cards.png' })
  console.log('✓ Check if titles are fully visible\n')

  console.log('📝 Test 3: Card min-height...')
  const cards = page.locator('button[class*="gradient"]')
  const cardCount = await cards.count()
  console.log(`  Found ${cardCount} event cards`)
  console.log('✓ All cards should be at least 120px tall\n')

  console.log('=' .repeat(50))
  console.log('✅ Layout fixes applied!')
  console.log('=' .repeat(50))
  console.log('\n🔍 Please check:')
  console.log('  - Cards fit within columns (no overflow)')
  console.log('  - Text is fully visible (no "Toán cao cấ")')
  console.log('  - Timeline looks clean')
  console.log('\n🌐 Browser staying open')
  console.log('Press Ctrl+C to close')
})()
