import { test, expect } from '@playwright/test';

test('homepage has expected title', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await expect(page).toHaveTitle(/Glow Beauty Emporium/);
  await page.screenshot({ path: 'screenshot.png' });
});
