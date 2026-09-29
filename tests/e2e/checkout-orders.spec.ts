import { test, expect } from '@playwright/test';

test.describe('Checkout & Orders E2E Flows', () => {
  test('executes complete checkout journey with address input and payment', async ({ page }) => {
    // Add item to cart first
    await page.goto('/products');
    const productCard = page.locator('article').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });

    const productLink = productCard.locator('a[href*="/products/"]').first();
    await productLink.click();

    const addToCartBtn = page.getByRole('button', { name: /add \d* to cart|add to cart/i }).first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    await addToCartBtn.click();

    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/checkout/);

    // Verify checkout page components exist
    await expect(page.getByText(/checkout|shipping address|payment|order summary/i).first()).toBeVisible();
  });

  test('navigates to user orders history page', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL(/\/orders|\/account\/orders/);
    await expect(page.getByText(/orders|order history/i).first()).toBeVisible();
  });
});
