import { expect, test } from '@playwright/test'

test('dashboard renders and edits a schedule item', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Quản lý thời khóa biểu thông minh' })).toBeVisible()
  await expect(page.getByText('Toán cao cấp')).toBeVisible()
  await expect(page.getByText('Sức khỏe lịch trình')).toBeVisible()

  await page.getByRole('button', { name: /Thêm lịch mới/i }).click()
  await expect(page.getByRole('textbox', { name: 'Tiêu đề' })).toHaveValue('Lịch mới')

  await page.getByLabel('Tiêu đề').fill('Ôn thi cuối kỳ')
  await page.getByLabel('Phòng/link').fill('Thư viện tầng 2')
  await page.getByLabel('Ghi chú').fill('Làm đề mẫu, ghi lại lỗi sai và đặt nhắc nhở.')

  await expect(page.getByText('Ôn thi cuối kỳ')).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Phòng/link' })).toHaveValue('Thư viện tầng 2')

  await page.getByRole('button', { name: 'Kanban' }).click()
  await expect(page.getByText('Kanban planner')).toBeVisible()
})
