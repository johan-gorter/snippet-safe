import { test, expect, Page } from '@playwright/test';

test.describe('Snippet Safe', () => {
  test('should show safe ID input on load', async ({ page }: { page: Page }) => {
    await page.goto('/');
    await expect(page.getByPlaceholder('Enter your Safe ID')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load Safe' })).toBeVisible();
  });

  test('should show error when loading non-existent safe', async ({ page }: { page: Page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Enter your Safe ID').fill('non-existent-id');
    await page.getByRole('button', { name: 'Load Safe' }).click();

    // Check for error alert
    await expect(page.getByText('Error loading safe')).toBeVisible();
  });

  test('should handle clipboard operations', async ({ page }: { page: Page }) => {
    // Mock clipboard API
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          readText: () => Promise.resolve('Test snippet content'),
          writeText: () => Promise.resolve(),
        },
      });
    });

    await page.goto('/');

    // Load a safe
    await page.getByPlaceholder('Enter your Safe ID').fill('test-safe');
    await page.getByRole('button', { name: 'Load Safe' }).click();

    // Paste snippet
    await page.getByRole('button', { name: 'Paste Snippet from Clipboard' }).click();

    // Verify snippet was added
    await expect(page.getByText('Test snippet content')).toBeVisible();

    // Copy snippet
    await page.getByRole('button', { name: 'Copy' }).first().click();

    // Delete snippet
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await expect(page.getByText('Test snippet content')).not.toBeVisible();
  });
}); 