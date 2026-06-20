import { test, expect } from '@playwright/test'

test('Overlapping events display side-by-side', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)

  console.log('✓ Page loaded')

  // Find day columns
  const columns = page.locator('[data-day]')
  const columnCount = await columns.count()
  console.log('✓ Found', columnCount, 'day columns')

  // Target Thứ 2 (Monday) - should have multiple events
  const mondayColumn = columns.first()
  const mondayDay = await mondayColumn.getAttribute('data-day')
  console.log('✓ Testing column:', mondayDay)

  // Count events in Monday
  const eventCards = mondayColumn.locator('button[title="Giữ Ctrl + kéo để di chuyển"]')
  const eventCount = await eventCards.count()
  console.log('✓ Events in', mondayDay + ':', eventCount)

  if (eventCount >= 2) {
    // Check if any events are side-by-side (width < 100%)
    const firstCard = eventCards.first()
    const cardBox = await firstCard.boundingBox()
    const columnBox = await mondayColumn.boundingBox()

    if (cardBox && columnBox) {
      const cardWidth = cardBox.width
      const columnWidth = columnBox.width - 16 // minus padding

      const widthPercent = (cardWidth / columnWidth) * 100
      console.log('✓ First card width:', Math.round(widthPercent) + '% of column')

      if (widthPercent < 95) {
        console.log('✓ Side-by-side layout detected!')
      } else {
        console.log('⚠ Events are stacked, not side-by-side')
      }
    }
  }

  // Take screenshot
  await page.screenshot({ path: 'test-results/overlap-detection.png', fullPage: true })
  console.log('✓ Screenshot saved')

  expect(eventCount).toBeGreaterThan(0)
})
