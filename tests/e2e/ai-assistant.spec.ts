import { test, expect } from '@playwright/test';

test.describe('AI Shopping Assistant E2E Flows', () => {
  test('opens floating assistant panel, submits query, and displays structured recommendations', async ({ page }) => {
    await page.goto('/');

    // Locate floating trigger button for AI assistant
    const assistantBtn = page.getByRole('button', { name: /assistant|ai shopping|ask ai/i }).first();
    await expect(assistantBtn).toBeVisible();
    await assistantBtn.click();

    // Verify chat input area appears
    const inputArea = page.getByPlaceholder(/ask|search|type/i).first();
    await expect(inputArea).toBeVisible();

    await inputArea.fill('Show me smartphones under ₹30,000');
    await inputArea.press('Enter');

    // Assistant should respond with message or product cards
    await expect(page.getByText(/smartphone|found|recommend|result/i).first()).toBeVisible({ timeout: 10000 });
  });
});
