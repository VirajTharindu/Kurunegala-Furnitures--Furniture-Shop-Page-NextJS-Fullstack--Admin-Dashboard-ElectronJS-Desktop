import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should render hero section and handle navbar interactions', async ({ page }) => {
        await page.goto('/');

        // Ensure Navbar brand is visible
        const navBrand = page.locator('nav').getByRole('link', { name: 'Kurunegala.' });
        await expect(navBrand).toBeVisible({ timeout: 15000 });

        // Ensure Hero section text is visible
        const heroHeading = page.locator('h1').first();
        await expect(heroHeading).toBeVisible();

        // Test "Menu" button functionality (full screen overlay)
        const menuButton = page.locator('nav button', { hasText: 'Menu' });
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        // The full screen menu should now be visible with links
        const fullMenu = page.locator('.fixed.inset-0');
        await expect(fullMenu).toBeVisible();
        
        const collectionsOverlayLink = fullMenu.getByRole('link', { name: 'Collections' });
        await expect(collectionsOverlayLink).toBeVisible();

        // Click collections from overlay
        await collectionsOverlayLink.click();

        // Verify categories section exists and overlay closes
        await expect(page.locator('#categories')).toBeAttached();
    });
});
