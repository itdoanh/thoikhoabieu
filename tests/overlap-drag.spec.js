import { test, expect } from '@playwright/test'

test('Drag event to create overlap and verify side-by-side layout', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)

  console.log('✓ Page loaded')

  // Find first two event cards
  const eventCards = page.locator('button[title="Giữ Ctrl + kéo để di chuyển"]')
  const count = await eventCards.count()
  console.log('✓ Total events:', count)

  if (count >= 2) {
    // Get the second event (Sprint planning at 13:00 on Monday)
    const secondEvent = eventCards.nth(1)
    const secondText = await secondEvent.textContent()
    console.log('✓ Second event:', secondText.substring(0, 40))

    // Get Monday column
    const mondayColumn = page.locator('[data-day="Thứ 2"]')
    const columnBox = await mondayColumn.boundingBox()
    const secondBox = await secondEvent.boundingBox()

    if (columnBox && secondBox) {
      // Drag second event UP to overlap with first event (08:00)
      const targetY = columnBox.y + columnBox.height * 0.12 // Around 08:30
      const targetX = columnBox.x + columnBox.width / 2

      console.log('✓ Dragging second event up to create overlap...')

      await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2)
      await page.mouse.down()
      await page.waitForTimeout(100)
      await page.mouse.move(targetX, targetY, { steps: 20 })
      await page.waitForTimeout(100)
      await page.mouse.up()
      await page.waitForTimeout(800)

      console.log('✓ Drag complete')

      // Check Monday column for side-by-side layout
      const mondayEvents = mondayColumn.locator('button[title="Giữ Ctrl + kéo để di chuyển"]')
      const mondayCount = await mondayEvents.count()
      console.log('✓ Events in Monday:', mondayCount)

      if (mondayCount >= 2) {
        // Check width of first card
        const firstCard = mondayEvents.first()
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
            console.log('⚠ Cards may not be overlapping in time')
          }

          // Take screenshot
          await page.screenshot({ path: 'test-results/overlap-drag-test.png', fullPage: true })
          console.log('✓ Screenshot saved')

          // Should have narrower cards when overlapping
          expect(widthPercent).toBeLessThan(70)
        }
      }
    }
  }
})
