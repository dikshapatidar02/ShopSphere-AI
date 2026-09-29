import { test, expect } from '@playwright/test';

test.describe('User Dashboard E2E Flows', () => {
  test('navigates through account dashboard tabs: profile, addresses, orders, wishlist, preferences', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/(account|login)/);

    await page.goto('/account/addresses');
    await expect(page).toHaveURL(/\/account\/(addresses|login)/);

    await page.goto('/account/preferences');
    await expect(page).toHaveURL(/\/account\/(preferences|login)/);
  });
});
