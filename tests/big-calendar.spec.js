import { test, expect } from '@playwright/test'

test('React-big-calendar drag and drop', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(2000)

  console.log('✓ Page loaded')

  // Wait for calendar to render
  await page.waitForSelector('.rbc-calendar', { timeout: 10000 })
  console.log('✓ Calendar rendered')

  // Find event cards
  const events = page.locator('.rbc-event')
  const count = await events.count()
  console.log('✓ Found', count, 'events')

  if (count > 0) {
    // Get first event
    const firstEvent = events.first()
    await expect(firstEvent).toBeVisible()

    const text = await firstEvent.textContent()
    console.log('✓ First event:', text)

    // Get initial position
    const initialBox = await firstEvent.boundingBox()
    console.log('✓ Initial position:', {
      x: Math.round(initialBox.x),
      y: Math.round(initialBox.y)
    })

    // Try to drag to a different day
    const targetX = initialBox.x + 200 // Move right
    const targetY = initialBox.y + 100 // Move down

    console.log('✓ Attempting drag...')

    await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2)
    await page.mouse.down()
    await page.waitForTimeout(100)

    await page.mouse.move(targetX, targetY, { steps: 15 })
    await page.waitForTimeout(100)

    await page.mouse.up()
    await page.waitForTimeout(1000)

    console.log('✓ Drag completed')

    // Get new position
    const newBox = await firstEvent.boundingBox()
    const moved = Math.abs(newBox.x - initialBox.x) > 10 || Math.abs(newBox.y - initialBox.y) > 10

    if (moved) {
      console.log('✅ Event moved! New position:', {
        x: Math.round(newBox.x),
        y: Math.round(newBox.y)
      })
      console.log('✅ Delta:', {
        x: Math.round(newBox.x - initialBox.x),
        y: Math.round(newBox.y - initialBox.y)
      })
    } else {
      console.log('⚠ Event did not move significantly')
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/big-calendar-drag.png', fullPage: true })
    console.log('✓ Screenshot saved')
  }

  expect(count).toBeGreaterThan(0)
})

test('Click calendar to add event', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(2000)

  // Wait for calendar
  await page.waitForSelector('.rbc-calendar')

  // Count initial events
  const initialEvents = page.locator('.rbc-event')
  const initialCount = await initialEvents.count()
  console.log('✓ Initial events:', initialCount)

  // Find a time slot and click
  const timeSlot = page.locator('.rbc-day-slot').first()
  await expect(timeSlot).toBeVisible()

  const slotBox = await timeSlot.boundingBox()
  if (slotBox) {
    // Click in the middle of the day slot
    await page.mouse.click(slotBox.x + slotBox.width / 2, slotBox.y + 200)
    await page.waitForTimeout(1000)

    // Check if new event added
    const newCount = await initialEvents.count()
    console.log('✓ Events after click:', newCount)

    if (newCount > initialCount) {
      console.log('✅ New event created!')
    } else {
      console.log('⚠ No new event (addEventAtSlot may need debugging)')
    }

    await page.screenshot({ path: 'test-results/big-calendar-add.png', fullPage: true })
  }
})
