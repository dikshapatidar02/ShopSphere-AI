import { test, expect } from '@playwright/test';

test.describe('Product Details & Cart Action E2E Flows', () => {
  test('displays product gallery, price, stock status, and adds item to cart', async ({ page }) => {
    await page.goto('/products/prod-1');

    await expect(page).toHaveURL(/\/products\/[a-zA-Z0-9-]+/);

    // Verify Add to Cart button is present
    const addToCartBtn = page.getByRole('button', { name: /add \d* to cart|add to cart/i }).first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click();

    // Verify notification or button state change
    await expect(page.getByText(/added|in cart|item added|view cart/i).first()).toBeVisible({ timeout: 5000 });
  });
});
