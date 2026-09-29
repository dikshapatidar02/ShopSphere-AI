import { test, expect } from '@playwright/test';

test.describe('Recommendation Engine E2E Flows', () => {
  test('renders recommendation rails on homepage and product details', async ({ page }) => {
    await page.goto('/');

    // Check homepage main container or headings
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });

    // Navigate to product page and verify product details page recommendation rails
    await page.goto('/products');
    const productCard = page.locator('article').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });

    const productLink = productCard.locator('a[href*="/products/"]').first();
    await productLink.click();

    await expect(page.getByText(/similar products|you may also like|recommended|related/i).first()).toBeVisible({ timeout: 15000 });
  });
});
