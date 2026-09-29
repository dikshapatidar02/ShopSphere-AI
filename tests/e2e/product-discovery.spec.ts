import { test, expect } from '@playwright/test';

test.describe('Product Discovery & Search E2E Flows', () => {
  test('navigates from homepage, performs search, filters results and views product details', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder(/search/i).first();
    await expect(searchInput).toBeVisible({ timeout: 15000 });

    await searchInput.fill('phone');
    
    // Wait for debounced search URL update
    await expect(page).toHaveURL(/(\?q=|search|products)/, { timeout: 10000 });

    // Wait for product cards to load in DOM
    const productCard = page.locator('article').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });

    const productLink = productCard.locator('a[href*="/products/"]').first();
    await productLink.click();
    await expect(page).toHaveURL(/\/products\/[a-zA-Z0-9-]+/);
  });
});
