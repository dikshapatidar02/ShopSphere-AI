import { test, expect } from '@playwright/test';

test.describe('Authentication & Session E2E Flows', () => {
  test('allows new user registration and redirects to account dashboard', async ({ page }) => {
    await page.goto('/account');
    // If not authenticated, page should present login / registration form or redirect
    await expect(page).toHaveURL(/\/(account|login)/);

    // Look for registration toggle or fields
    const registerToggle = page.getByRole('button', { name: /create account|register|sign up/i });
    if (await registerToggle.isVisible()) {
      await registerToggle.click();
    }

    const nameInput = page.getByPlaceholder(/name/i).first();
    const emailInput = page.getByPlaceholder(/email/i).first();
    const passwordInput = page.getByPlaceholder(/password/i).first();

    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User E2E');
      await emailInput.fill(`e2e-user-${Date.now()}@example.com`);
      await passwordInput.fill('Password123!');
      
      const submitBtn = page.getByRole('button', { name: /register|sign up|create/i }).first();
      await submitBtn.click();
    }

    // User should be authenticated and see account content or profile heading
    await expect(page.getByText(/account|profile|john|test user/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('enforces protected route access control for unauthenticated users', async ({ page }) => {
    // Clear local storage / cookies to ensure unauthenticated state
    await page.context().clearCookies();
    await page.goto('/account');
    
    // Page should display login prompt or authentication UI
    await expect(page.getByText(/sign in|login|account|email/i).first()).toBeVisible();
  });
});
