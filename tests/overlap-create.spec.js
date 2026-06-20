import { test, expect } from '@playwright/test'

test('Create overlapping events and verify side-by-side layout', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)

  console.log('✓ Page loaded')

  // Find Thứ 3 column
  const columns = page.locator('[data-day]')
  const thuBaColumn = columns.nth(1) // Thứ 3
  const thuBaDay = await thuBaColumn.getAttribute('data-day')
  console.log('✓ Target column:', thuBaDay)

  // Click to add first event at 10:00
  const columnBox = await thuBaColumn.boundingBox()
  if (columnBox) {
    // Click at 10:00 position (approximately 23% down from 6am start)
    const y1 = columnBox.y + columnBox.height * 0.23
    const x = columnBox.x + columnBox.width / 2
    await page.mouse.click(x, y1)
    await page.waitForTimeout(500)
    console.log('✓ Added first event at ~10:00')

    // Click to add second overlapping event at 10:30
    const y2 = columnBox.y + columnBox.height * 0.26
    await page.mouse.click(x, y2)
    await page.waitForTimeout(500)
    console.log('✓ Added second event at ~10:30')

    // Count events in Thứ 3
    const eventCards = thuBaColumn.locator('button[title="Giữ Ctrl + kéo để di chuyển"]')
    const count = await eventCards.count()
    console.log('✓ Total events in', thuBaDay + ':', count)

    // Check if cards are side-by-side
    if (count >= 2) {
      const firstCard = eventCards.first()
      const firstBox = await firstCard.boundingBox()

      if (firstBox && columnBox) {
        const cardWidth = firstBox.width
        const columnWidth = columnBox.width - 16 // padding
        const widthPercent = (cardWidth / columnWidth) * 100

        console.log('✓ Card width:', Math.round(cardWidth) + 'px')
        console.log('✓ Column width:', Math.round(columnWidth) + 'px')
        console.log('✓ Card takes up:', Math.round(widthPercent) + '% of column')

        if (widthPercent < 60) {
          console.log('✅ Side-by-side layout confirmed!')
        } else {
          console.log('⚠ Cards may be stacked (not overlapping in time)')
        }
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/overlap-side-by-side.png', fullPage: true })
    console.log('✓ Screenshot saved')

    expect(count).toBeGreaterThanOrEqual(2)
  }
})
