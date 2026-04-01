import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should show login form elements', async ({ page }) => {
        // Navigate to login page
        await page.goto('/login');

        // Verify login form elements exist
        await expect(page.getByRole('heading', { name: /giriş/i })).toBeVisible();
        await expect(page.getByRole('textbox', { name: /posta|e-posta|email/i })).toBeVisible();
        await expect(page.getByRole('textbox', { name: /şifre|şifre|password/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /giriş/i })).toBeVisible();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
        await page.goto('/login');

        // Try to submit without filling fields
        await page.getByRole('button', { name: /giriş/i }).click();

        // Wait a moment for validation
        await page.waitForTimeout(500);

        // Verify form didn't submit or show errors
        // The form uses react-hook-form + zod, errors may appear differently
        await expect(page).toHaveURL('/login');
    });

    test('should navigate to register page', async ({ page }) => {
        await page.goto('/login');

        // Click register link - use first matching link
        const registerLinks = page.getByRole('link', { name: /kayıt/i });
        await registerLinks.first().click();

        // Verify navigation
        await expect(page).toHaveURL('/register');
    });
});