import { test, expect } from '@playwright/test'

test('Edit event times to create overlap and verify side-by-side', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)

  console.log('✓ Page loaded')

  // Click on the first event to select it
  const firstEvent = page.locator('button[title="Giữ Ctrl + kéo để di chuyển"]').first()
  await firstEvent.click()
  await page.waitForTimeout(500)

  console.log('✓ First event selected')

  // Find the "Bắt đầu" (start time) input in edit panel
  const startInput = page.locator('input').filter({ hasText: '' }).nth(2) // Third input field
  const endInput = page.locator('input').filter({ hasText: '' }).nth(3) // Fourth input field

  // Change first event to 08:00-10:00
  await startInput.click({ clickCount: 3 }) // Select all
  await startInput.fill('08:00')
  await endInput.click({ clickCount: 3 })
  await endInput.fill('10:00')
  await page.waitForTimeout(500)

  console.log('✓ Changed first event to 08:00-10:00')

  // Click on second event
  const secondEvent = page.locator('button[title="Giữ Ctrl + kéo để di chuyển"]').nth(1)
  await secondEvent.click()
  await page.waitForTimeout(500)

  console.log('✓ Second event selected')

  // Change second event to 09:00-11:00 (overlaps with first)
  await startInput.click({ clickCount: 3 })
  await startInput.fill('09:00')
  await endInput.click({ clickCount: 3 })
  await endInput.fill('11:00')
  await page.waitForTimeout(800)

  console.log('✓ Changed second event to 09:00-11:00 (should overlap)')

  // Check Monday column for side-by-side layout
  const mondayColumn = page.locator('[data-day="Thứ 2"]')
  const mondayEvents = mondayColumn.locator('button[title="Giữ Ctrl + kéo để di chuyển"]')
  const count = await mondayEvents.count()
  console.log('✓ Events in Monday:', count)

  if (count >= 2) {
    const firstCard = mondayEvents.first()
    const firstBox = await firstCard.boundingBox()
    const columnBox = await mondayColumn.boundingBox()

    if (firstBox && columnBox) {
      const cardWidth = firstBox.width
      const columnWidth = columnBox.width - 16
      const widthPercent = (cardWidth / columnWidth) * 100

      console.log('✓ Card width:', Math.round(cardWidth) + 'px')
      console.log('✓ Column width:', Math.round(columnWidth) + 'px')
      console.log('✓ Card width percentage:', Math.round(widthPercent) + '%')

      if (widthPercent < 60) {
        console.log('✅ OVERLAP DETECTION WORKING! Side-by-side layout confirmed!')
      } else {
        console.log('❌ Overlap detection not working - cards still full width')
      }

      await page.screenshot({ path: 'test-results/overlap-edit-test.png', fullPage: true })
      console.log('✓ Screenshot saved')

      expect(widthPercent).toBeLessThan(60)
    }
  }
})
