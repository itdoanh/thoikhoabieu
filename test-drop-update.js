const { test, expect } = require('@playwright/test')

test('Timeline drag and drop functionality', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.waitForTimeout(1000)

  // Find a draggable event card
  const eventCard = page.locator('button[title="Giữ Ctrl + kéo để di chuyển"]').first()
  await expect(eventCard).toBeVisible()

  // Get initial position
  const initialText = await eventCard.textContent()
  console.log('Initial event:', initialText)

  // Find all day columns
  const columns = page.locator('[data-day]')
  const columnCount = await columns.count()
  console.log('Found columns:', columnCount)

  // Get the second column (Thứ 3)
  const targetColumn = columns.nth(1)
  const targetDay = await targetColumn.getAttribute('data-day')
  console.log('Target day:', targetDay)

  // Drag the event card to the target column
  const sourceBox = await eventCard.boundingBox()
  const targetBox = await targetColumn.boundingBox()

  if (sourceBox && targetBox) {
    // Drag to middle of target column
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 300, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(500)

    // Verify the event moved
    const eventsInTargetColumn = targetColumn.locator('button[title="Giữ Ctrl + kéo để di chuyển"]')
    const count = await eventsInTargetColumn.count()
    console.log(`Events in ${targetDay}:`, count)

    // Take screenshot
    await page.screenshot({ path: 'test-results/drop-update-test.png', fullPage: true })
    console.log('Screenshot saved')

    expect(count).toBeGreaterThan(0)
  }
})
