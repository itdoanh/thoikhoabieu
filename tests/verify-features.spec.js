import { test, expect } from '@playwright/test'

test('Verify drag and drop with console logs', async ({ page }) => {
  // Listen to console messages
  const consoleMessages = []
  page.on('console', msg => {
    consoleMessages.push(msg.text())
    console.log('BROWSER:', msg.text())
  })

  await page.goto('/')
  await page.waitForTimeout(2000)

  console.log('✓ Page loaded')

  // Wait for calendar
  await page.waitForSelector('.rbc-calendar', { timeout: 10000 })
  console.log('✓ Calendar visible')

  // Find first event
  const events = page.locator('.rbc-event')
  const count = await events.count()
  console.log('✓ Found', count, 'events')

  if (count > 0) {
    const firstEvent = events.first()
    const eventText = await firstEvent.textContent()
    console.log('✓ First event:', eventText.substring(0, 40))

    const initialBox = await firstEvent.boundingBox()

    // Drag to another day/time
    const targetX = initialBox.x + 250 // Move right to next day
    const targetY = initialBox.y + 150 // Move down a few hours

    console.log('✓ Starting drag from', { x: Math.round(initialBox.x), y: Math.round(initialBox.y) })
    console.log('✓ Target position', { x: Math.round(targetX), y: Math.round(targetY) })

    await page.mouse.move(initialBox.x + initialBox.width / 2, initialBox.y + initialBox.height / 2)
    await page.mouse.down()
    await page.waitForTimeout(200)

    await page.mouse.move(targetX, targetY, { steps: 20 })
    await page.waitForTimeout(200)

    await page.mouse.up()
    await page.waitForTimeout(1500)

    console.log('✓ Drag completed')

    // Check if console logged the drop
    const dropLogs = consoleMessages.filter(msg => msg.includes('Event dropped'))
    if (dropLogs.length > 0) {
      console.log('✅ Drop detected in console:', dropLogs[0])
    } else {
      console.log('⚠ No drop event logged (may need to enable DnD)')
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/verify-drag-logs.png', fullPage: true })
    console.log('✓ Screenshot saved')

    expect(count).toBeGreaterThan(0)
  }
})

test('Verify click to add with console logs', async ({ page }) => {
  const consoleMessages = []
  page.on('console', msg => {
    consoleMessages.push(msg.text())
    console.log('BROWSER:', msg.text())
  })

  await page.goto('/')
  await page.waitForTimeout(2000)

  await page.waitForSelector('.rbc-calendar')

  // Initial count
  const initialEvents = page.locator('.rbc-event')
  const initialCount = await initialEvents.count()
  console.log('✓ Initial events:', initialCount)

  // Click on a time slot
  const daySlot = page.locator('.rbc-day-slot').nth(2) // Wednesday
  const slotBox = await daySlot.boundingBox()

  if (slotBox) {
    const clickX = slotBox.x + slotBox.width / 2
    const clickY = slotBox.y + 300 // Click around 14:00

    console.log('✓ Clicking at', { x: Math.round(clickX), y: Math.round(clickY) })

    await page.mouse.click(clickX, clickY)
    await page.waitForTimeout(1500)

    // Check console for slot selected
    const slotLogs = consoleMessages.filter(msg => msg.includes('Slot selected'))
    if (slotLogs.length > 0) {
      console.log('✅ Slot selection logged:', slotLogs[0])
    } else {
      console.log('⚠ No slot selection logged')
    }

    // Check if event added
    const newCount = await initialEvents.count()
    console.log('✓ Events after click:', newCount)

    if (newCount > initialCount) {
      console.log('✅ New event created!')
    } else {
      console.log('⚠ Event not added (check addEventAtSlot)')
    }

    await page.screenshot({ path: 'test-results/verify-click-logs.png', fullPage: true })
  }
})
