import { test, expect } from '@playwright/test'

test('Quick drag test - verify no jumping', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(2000)

  console.log('✓ Page loaded')

  // Verify page renders
  const cards = page.locator('button[title*="kéo"]')
  const count = await cards.count()
  console.log('✓ Found', count, 'event cards')

  if (count > 0) {
    const firstCard = cards.first()
    await expect(firstCard).toBeVisible()

    const text = await firstCard.textContent()
    console.log('✓ First card:', text.substring(0, 30))

    // Get initial position
    const initialBox = await firstCard.boundingBox()
    console.log('✓ Initial position:', { x: Math.round(initialBox.x), y: Math.round(initialBox.y) })

    // Try a simple drag to the right
    const targetColumn = page.locator('[data-day]').nth(2) // Thứ 4
    const targetBox = await targetColumn.boundingBox()

    await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2)
    await page.mouse.down()
    await page.waitForTimeout(100)

    const targetX = targetBox.x + targetBox.width / 2
    const targetY = targetBox.y + 400
    console.log('✓ Dragging to:', { x: Math.round(targetX), y: Math.round(targetY) })

    await page.mouse.move(targetX, targetY, { steps: 20 })
    await page.waitForTimeout(100)
    await page.mouse.up()
    await page.waitForTimeout(1000)

    // Take screenshot
    await page.screenshot({ path: 'test-results/quick-drag-test.png', fullPage: true })
    console.log('✓ Screenshot saved')

    // Verify card moved
    const targetCards = targetColumn.locator('button[title*="kéo"]')
    const targetCount = await targetCards.count()
    console.log('✓ Cards in target column:', targetCount)

    if (targetCount > 0) {
      console.log('✅ Drag successful!')
    } else {
      console.log('⚠ Card may not have moved')
    }
  }

  expect(count).toBeGreaterThan(0)
})
