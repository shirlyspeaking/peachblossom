import { expect, test } from '@playwright/test'

test('renders the refactored monopoly home screen', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '桃源萬象大富翁' })).toBeVisible()
  await expect(page.getByRole('button', { name: '擲骰' })).toBeVisible()
  await expect(page.getByText('劇本導覽')).toBeVisible()
  await expect(page.getByRole('link', { name: '查看舊版' })).toBeVisible()
})
