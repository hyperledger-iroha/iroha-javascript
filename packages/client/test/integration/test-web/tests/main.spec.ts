import { expect, test } from '@playwright/test'
// import { startPeer } from '@iroha2/test-peer'//
import { $ } from 'zx'
import { PORT_PEER_API } from '../etc/meta'

test('Register new domain and wait until commitment', async ({ page }) => {
  // await startPeer({ port: PORT_PEER_API })
  $`DEBUG=* pnpm --filter test-peer run cli start`

  await page.goto('/')

  await page.waitForSelector('h3:has-text("Status")')
  const statusDiv = page.locator('h3:has-text("Status")').locator('..')
  await expect(statusDiv).toContainText('Blocks: 1')

  await page.click('button:has-text("Listen")')
  await expect(page.locator('button:has-text("Stop")')).toBeVisible()

  await page.fill('input', 'bob')
  await page.click('button:has-text("Register domain")')

  // Ensure that blocks count is incremented
  await expect(page.locator('text=Blocks: 2')).toBeVisible()
})
