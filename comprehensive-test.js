import { chromium } from '@playwright/test'
import { writeFileSync } from 'fs'

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 })
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  const page = await context.newPage()

  const log = []
  const screenshot = async (name) => {
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: false })
    log.push(`✓ Screenshot: ${name}`)
  }

  try {
    log.push('=== STARTING COMPREHENSIVE UI TEST ===')

    await page.goto('http://127.0.0.1:5173/')
    await page.waitForLoadState('networkidle')
    await screenshot('01-initial-load')
    log.push('✓ Page loaded')

    // Test responsive: check viewport fit
    const bodyBox = await page.locator('body').boundingBox()
    log.push(`Body dimensions: ${bodyBox.width}×${bodyBox.height}`)

    // Test search
    log.push('\n=== Testing Search ===')
    const searchInput = page.locator('input[placeholder*="Môn học"]')
    await searchInput.fill('Toán')
    await screenshot('02-search-filled')
    log.push('✓ Search input filled')
    await searchInput.clear()

    // Test filter dropdown
    log.push('\n=== Testing Category Filter ===')
    const filterSelect = page.locator('select').first()
    await filterSelect.selectOption('Học')
    await screenshot('03-filter-hoc')
    log.push('✓ Filter changed to Học')
    await filterSelect.selectOption('Tất cả')

    // Test add new schedule
    log.push('\n=== Testing Add Schedule ===')
    await page.getByRole('button', { name: /Thêm lịch mới/i }).click()
    await page.waitForTimeout(500)
    await screenshot('04-new-schedule-added')
    log.push('✓ New schedule added')

    // Test editing schedule details
    log.push('\n=== Testing Edit Schedule ===')
    const titleInput = page.getByLabel('Tiêu đề')
    await titleInput.fill('Test Playwright Control')
    await screenshot('05-title-edited')
    log.push('✓ Title edited')

    const roomInput = page.getByLabel('Phòng/link')
    await roomInput.fill('Lab AI')
    log.push('✓ Room edited')

    const notesTextarea = page.getByLabel('Ghi chú')
    await notesTextarea.fill('Kiểm tra tự động bằng Playwright.')
    await screenshot('06-notes-edited')
    log.push('✓ Notes edited')

    // Test priority select
    const prioritySelect = page.getByLabel('Ưu tiên')
    await prioritySelect.selectOption('Cao')
    log.push('✓ Priority changed to Cao')

    // Test progress slider
    const progressSlider = page.locator('input[type="range"]')
    await progressSlider.fill('75')
    await screenshot('07-progress-slider')
    log.push('✓ Progress slider set to 75%')

    // Test view mode switches
    log.push('\n=== Testing View Modes ===')
    await page.getByRole('button', { name: 'Tháng' }).click()
    await page.waitForTimeout(300)
    await screenshot('08-view-thang')
    log.push('✓ Switched to Tháng view')

    await page.getByRole('button', { name: 'Kanban' }).click()
    await page.waitForTimeout(300)
    await screenshot('09-view-kanban')
    log.push('✓ Switched to Kanban view')

    await page.getByRole('button', { name: 'Timeline' }).click()
    await page.waitForTimeout(300)
    await screenshot('10-view-timeline')
    log.push('✓ Switched to Timeline view')

    await page.getByRole('button', { name: 'Tuần' }).click()
    await page.waitForTimeout(300)
    await screenshot('11-view-tuan')
    log.push('✓ Switched back to Tuần view')

    // Test schedule card interaction
    log.push('\n=== Testing Schedule Card Click ===')
    const scheduleCards = page.locator('button[class*="rounded-2xl"][class*="gradient"]')
    const cardCount = await scheduleCards.count()
    log.push(`Found ${cardCount} schedule cards`)

    if (cardCount > 1) {
      await scheduleCards.nth(1).click()
      await page.waitForTimeout(300)
      await screenshot('12-card-clicked')
      log.push('✓ Clicked second schedule card')
    }

    // Test theme buttons
    log.push('\n=== Testing Theme Switching ===')
    await page.getByRole('button', { name: 'Minimal' }).click()
    await page.waitForTimeout(300)
    await screenshot('13-theme-minimal')
    log.push('✓ Theme switched to Minimal')

    await page.getByRole('button', { name: 'Aurora' }).click()
    await page.waitForTimeout(300)
    log.push('✓ Theme switched back to Aurora')

    // Test template buttons
    log.push('\n=== Testing Template Buttons ===')
    await page.getByRole('button', { name: 'Sinh viên đại học' }).click()
    await page.waitForTimeout(300)
    await screenshot('14-template-clicked')
    log.push('✓ Template button clicked')

    // Check charts rendered
    log.push('\n=== Checking Charts ===')
    const charts = page.locator('[class*="recharts"]')
    const chartCount = await charts.count()
    log.push(`Found ${chartCount} chart elements`)
    await screenshot('15-charts-visible')

    // Test delete button
    log.push('\n=== Testing Delete ===')
    const deleteButton = page.getByRole('button', { name: /Xóa/i })
    await deleteButton.click()
    await page.waitForTimeout(500)
    await screenshot('16-after-delete')
    log.push('✓ Delete button clicked')

    // Final full-page screenshot
    await screenshot('17-final-state')

    // Check for layout overflow issues
    log.push('\n=== Layout Analysis ===')
    const mainElement = page.locator('main').first()
    const mainBox = await mainElement.boundingBox()
    if (mainBox) {
      log.push(`Main container: ${mainBox.width}×${mainBox.height}`)
      if (mainBox.width > 1920) {
        log.push('⚠ WARNING: Layout exceeds viewport width!')
      }
    }

    const asides = page.locator('aside')
    const asideCount = await asides.count()
    log.push(`Found ${asideCount} aside panels`)

    for (let i = 0; i < asideCount; i++) {
      const box = await asides.nth(i).boundingBox()
      if (box) {
        log.push(`  Aside ${i + 1}: ${box.width}×${box.height}`)
      }
    }

    log.push('\n=== TEST COMPLETED SUCCESSFULLY ===')

  } catch (error) {
    log.push(`\n❌ ERROR: ${error.message}`)
    await screenshot('error-state')
  } finally {
    writeFileSync('test-results/comprehensive-test-log.txt', log.join('\n'))
    console.log(log.join('\n'))
    console.log('\n✓ Log saved to test-results/comprehensive-test-log.txt')
    console.log('Browser will close in 5 seconds...')
    await page.waitForTimeout(5000)
    await browser.close()
  }
})()
