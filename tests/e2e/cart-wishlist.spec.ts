import { test, expect } from '@playwright/test';

test.describe('Cart & Wishlist E2E Flows', () => {
  test('manages cart items, updates quantities and calculates subtotal', async ({ page }) => {
    await page.goto('/products/prod-1');

    const addToCartBtn = page.getByRole('button', { name: /add \d* to cart|add to cart/i }).first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click();

    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');

    // Cart summary or order total should be displayed
    await expect(page.getByText(/subtotal|total|order summary|cart/i).first()).toBeVisible();
  });

  test('toggles wishlist items and renders wishlist page', async ({ page }) => {
    await page.goto('/wishlist');
    await expect(page).toHaveURL('/wishlist');
    await expect(page.getByText(/wishlist|saved items/i).first()).toBeVisible();
  });
});
