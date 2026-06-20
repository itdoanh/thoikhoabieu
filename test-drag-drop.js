import { chromium } from '@playwright/test'

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 800 })
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  console.log('=== Testing Drag & Drop ===\n')

  // Find draggable schedule cards
  const cards = page.locator('button').filter({ hasText: 'Toán cao cấp' }).first()
  const cardExists = await cards.count()

  if (cardExists > 0) {
    const box = await cards.boundingBox()
    console.log(`Found card at: ${box.x}, ${box.y}`)

    // Try to drag it
    await page.mouse.move(box.x + box.width/2, box.y + box.height/2)
    await page.mouse.down()
    await page.waitForTimeout(500)

    console.log('✓ Mouse down on card')
    await page.screenshot({ path: 'test-results/drag-start.png' })

    // Move to different position
    await page.mouse.move(box.x + 200, box.y + 100, { steps: 10 })
    await page.waitForTimeout(500)

    console.log('✓ Dragging...')
    await page.screenshot({ path: 'test-results/drag-moving.png' })

    await page.mouse.up()
    await page.waitForTimeout(500)

    console.log('✓ Mouse up')
    await page.screenshot({ path: 'test-results/drag-end.png' })
  } else {
    console.log('❌ No draggable cards found')
  }

  console.log('\nBrowser open - test drag manually')
  console.log('Press Ctrl+C to close')
})()
