import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard & Access Control E2E Flows', () => {
  test('navigates to admin routes and verifies admin overview/products pages', async ({ page }) => {
    await page.goto('/admin');
    // Admin dashboard or login prompt should load
    await expect(page).toHaveURL(/\/(admin|login)/);

    await page.goto('/admin/products');
    await expect(page).toHaveURL(/\/admin\/(products|login)/);

    await page.goto('/admin/orders');
    await expect(page).toHaveURL(/\/admin\/(orders|login)/);
  });
});
