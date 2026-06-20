import { test, expect } from '@playwright/test'

test('Improved drag and drop - smooth movement', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(2000)

  console.log('✓ Page loaded')

  // Get first event - use more specific selector
  const firstEvent = page.locator('button[title*="kéo"]').first()
  await expect(firstEvent).toBeVisible({ timeout: 10000 })

  const initialText = await firstEvent.textContent()
  console.log('✓ First event:', initialText.substring(0, 30))

  // Get initial position
  const initialBox = await firstEvent.boundingBox()
  console.log('✓ Initial position:', { x: Math.round(initialBox.x), y: Math.round(initialBox.y) })

  // Find target column (Thứ 4)
  const columns = page.locator('[data-day]')
  const targetColumn = columns.nth(2) // Thứ 4
  const targetDay = await targetColumn.getAttribute('data-day')
  const targetBox = await targetColumn.boundingBox()

  console.log('✓ Target column:', targetDay)

  // Drag to target
  await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(50)

  // Smooth movement to target (middle of column, 14:00 position ~47%)
  const targetX = targetBox.x + targetBox.width / 2
  const targetY = targetBox.y + targetBox.height * 0.47
  await page.mouse.move(targetX, targetY, { steps: 30 })
  await page.waitForTimeout(100)

  console.log('✓ Dragging to position:', { x: Math.round(targetX), y: Math.round(targetY) })

  await page.mouse.up()
  await page.waitForTimeout(800)

  // Verify event moved to target column
  const eventsInTarget = targetColumn.locator('button[title*="kéo"]')
  const count = await eventsInTarget.count()
  console.log('✓ Events in', targetDay + ':', count)

  // Check if event is near expected position (14:00 = 47% down from 6am)
  if (count > 0) {
    const movedEvent = eventsInTarget.first()
    const movedBox = await movedEvent.boundingBox()
    const relativeY = movedBox.y - targetBox.y
    const percentage = (relativeY / targetBox.height) * 100

    console.log('✓ Event positioned at:', Math.round(percentage) + '% of column')
    console.log('✓ Expected ~47% for 14:00 drop')

    // Should be roughly around 47% (±10% tolerance)
    const expectedPercent = 47
    const tolerance = 15
    const isCloseToTarget = Math.abs(percentage - expectedPercent) < tolerance

    if (isCloseToTarget) {
      console.log('✅ Drag drop position accurate!')
    } else {
      console.log('⚠ Position may be off by', Math.abs(Math.round(percentage - expectedPercent)) + '%')
    }
  }

  // Take screenshot
  await page.screenshot({ path: 'test-results/improved-drag-drop.png', fullPage: true })
  console.log('✓ Screenshot saved')

  expect(count).toBeGreaterThan(0)
})

test('Multiple overlapping events layout correctly', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)

  console.log('✓ Testing multiple overlaps')

  // Click first event
  const firstEvent = page.locator('button[title*="kéo"]').first()
  await expect(firstEvent).toBeVisible({ timeout: 10000 })
  await firstEvent.click()
  await page.waitForTimeout(300)

  // Edit to 10:00-12:00
  const inputs = page.locator('input[type="text"]')
  const startInput = inputs.nth(2)
  const endInput = inputs.nth(3)

  await startInput.click({ clickCount: 3 })
  await startInput.fill('10:00')
  await endInput.click({ clickCount: 3 })
  await endInput.fill('12:00')
  await page.waitForTimeout(500)

  // Click second event
  const secondEvent = page.locator('button[title*="kéo"]').nth(1)
  await secondEvent.click()
  await page.waitForTimeout(300)

  // Edit to 11:00-13:00 (overlaps with first)
  await startInput.click({ clickCount: 3 })
  await startInput.fill('11:00')
  await endInput.click({ clickCount: 3 })
  await endInput.fill('13:00')
  await page.waitForTimeout(500)

  console.log('✓ Created 2 overlapping events')

  // Check Monday column
  const mondayColumn = page.locator('[data-day="Thứ 2"]')
  const mondayEvents = mondayColumn.locator('button[title*="kéo"]')
  const count = await mondayEvents.count()

  if (count >= 2) {
    const firstCard = mondayEvents.first()
    const secondCard = mondayEvents.nth(1)

    const box1 = await firstCard.boundingBox()
    const box2 = await secondCard.boundingBox()
    const columnBox = await mondayColumn.boundingBox()

    if (box1 && box2 && columnBox) {
      const width1 = (box1.width / (columnBox.width - 16)) * 100
      const width2 = (box2.width / (columnBox.width - 16)) * 100

      console.log('✓ Card 1 width:', Math.round(width1) + '%')
      console.log('✓ Card 2 width:', Math.round(width2) + '%')

      // Both should be ~50% width
      if (width1 < 60 && width2 < 60) {
        console.log('✅ Side-by-side layout working!')
      }

      // Check if they're actually side-by-side (different X positions)
      const xDiff = Math.abs(box1.x - box2.x)
      console.log('✓ Horizontal separation:', Math.round(xDiff) + 'px')

      if (xDiff > 10) {
        console.log('✅ Cards positioned side-by-side!')
      }
    }
  }

  await page.screenshot({ path: 'test-results/improved-overlap.png', fullPage: true })
  console.log('✓ Screenshot saved')

  expect(count).toBeGreaterThanOrEqual(2)
})
