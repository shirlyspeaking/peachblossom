import { expect, test } from '@playwright/test'

test('renders the refactored monopoly home screen', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '桃源萬象大富翁' })).toBeVisible()
  await expect(page.getByRole('button', { name: '擲骰' })).toBeVisible()
  await expect(page.getByRole('button', { name: '編輯棋盤' })).toBeVisible()
  await expect(page.getByRole('button', { name: '卡片設置' })).toHaveCount(0)

  await page.getByRole('button', { name: '編輯棋盤' }).click()
  await expect(page.getByRole('button', { name: '卡片設置' })).toBeVisible()
  await expect(page.getByRole('button', { name: '返回遊戲' })).toBeVisible()
})
