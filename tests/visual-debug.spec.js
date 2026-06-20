import { test } from '@playwright/test'

test('capture current dashboard visual state', async ({ page }) => {
  const messages = []
  page.on('console', (message) => messages.push(`${message.type()}: ${message.text()}`))
  page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`))

  await page.goto('/')
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: 'test-results/current-dashboard.png', fullPage: true })

  await test.info().attach('console', {
    body: messages.join('\n') || 'No console messages',
    contentType: 'text/plain',
  })
})
