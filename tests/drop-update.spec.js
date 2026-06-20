import { test, expect } from '@playwright/test'

test('Timeline drag and drop to update position', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)

  // Find the first event card
  const eventCard = page.locator('button[title="Giữ Ctrl + kéo để di chuyển"]').first()
  await expect(eventCard).toBeVisible()

  const initialText = await eventCard.textContent()
  console.log('✓ Initial event found:', initialText.substring(0, 50))

  // Find all day columns
  const columns = page.locator('[data-day]')
  const columnCount = await columns.count()
  console.log('✓ Found', columnCount, 'day columns')

  // Target: Thứ 3 (second column)
  const targetColumn = columns.nth(1)
  const targetDay = await targetColumn.getAttribute('data-day')
  console.log('✓ Target day:', targetDay)

  // Get bounding boxes
  const sourceBox = await eventCard.boundingBox()
  const targetBox = await targetColumn.boundingBox()

  if (sourceBox && targetBox) {
    console.log('✓ Starting drag operation...')

    // Drag from center of card to middle of target column
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2)
    await page.mouse.down()
    await page.waitForTimeout(100)

    // Move to target position (middle height of column)
    const targetX = targetBox.x + targetBox.width / 2
    const targetY = targetBox.y + targetBox.height / 2
    await page.mouse.move(targetX, targetY, { steps: 20 })
    await page.waitForTimeout(100)
    await page.mouse.up()

    await page.waitForTimeout(800)

    // Verify the event moved to target column
    const eventsInTarget = targetColumn.locator('button[title="Giữ Ctrl + kéo để di chuyển"]')
    const count = await eventsInTarget.count()
    console.log(`✓ Events now in ${targetDay}:`, count)

    // Take screenshot
    await page.screenshot({ path: 'test-results/drop-update-success.png', fullPage: true })
    console.log('✓ Screenshot saved')

    expect(count).toBeGreaterThan(0)
  } else {
    throw new Error('Could not get bounding boxes for drag operation')
  }
})
