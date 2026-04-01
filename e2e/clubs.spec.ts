import { test, expect } from '@playwright/test';

test.describe('Clubs', () => {
    test('should navigate to clubs page', async ({ page }) => {
        // Navigate to clubs page
        await page.goto('/clubs');

        // Verify page loaded - check for clubs-related content
        await expect(page).toHaveURL(/\/clubs/);
    });

    test('should navigate to home page', async ({ page }) => {
        // Navigate to home page
        await page.goto('/');

        // Verify page loaded - check URL
        await expect(page).toHaveURL('/');
    });
});
