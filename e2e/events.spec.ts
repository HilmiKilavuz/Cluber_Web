import { test, expect } from '@playwright/test';

test.describe('Events', () => {
    test('should navigate to events page', async ({ page }) => {
        // Navigate to events page
        await page.goto('/events/create');

        // Verify page loaded
        await expect(page).toHaveURL(/\/events/);
    });
});
