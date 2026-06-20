import { chromium } from '@playwright/test'

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 })
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForLoadState('networkidle')

  // Full page screenshot
  await page.screenshot({ path: 'test-results/laptop-fullpage.png', fullPage: true })
  console.log('✓ Full page screenshot saved')

  // Scroll to edit panel
  await page.evaluate(() => {
    const editPanel = document.querySelector('h2:has-text("Chỉnh sửa chi tiết")')
    if (editPanel) {
      editPanel.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
  await page.waitForTimeout(1000)

  await page.screenshot({ path: 'test-results/laptop-edit-panel-view.png', fullPage: false })
  console.log('✓ Edit panel view screenshot saved')

  // Test editing
  await page.getByLabel('Tiêu đề').fill('Test chỉnh sửa laptop 1366')
  await page.getByLabel('Phòng/link').fill('Phòng A101')
  await page.screenshot({ path: 'test-results/laptop-after-edit.png', fullPage: false })
  console.log('✓ After edit screenshot saved')

  console.log('\n✓ Browser open - you can interact now')
  console.log('Press Ctrl+C to close')
})()
