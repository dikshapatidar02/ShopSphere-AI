import { test, expect } from '@playwright/test';

test.describe('Accessibility & Keyboard Navigation E2E Checks', () => {
  test('verifies skip link, landmark headings, and keyboard focusable elements', async ({ page }) => {
    await page.goto('/');

    // Verify skip to main content link
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Verify main landmark
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();

    // Verify search input is focusable and receives focus
    const searchInput = page.getByPlaceholder(/search/i).first();
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
  });

  test('verifies dialog accessibility and keyboard escape behavior', async ({ page }) => {
    await page.goto('/');

    // Open AI assistant dialog
    const assistantBtn = page.getByRole('button', { name: /assistant|ai shopping|ask ai/i }).first();
    await assistantBtn.click();

    const dialog = page.getByRole('dialog', { name: /ai shopping assistant/i });
    await expect(dialog).toBeVisible();

    // Press Escape to close dialog
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
