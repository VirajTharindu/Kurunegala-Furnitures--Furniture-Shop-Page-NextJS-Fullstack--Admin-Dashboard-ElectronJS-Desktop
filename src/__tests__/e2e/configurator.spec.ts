import { test, expect } from '@playwright/test';

test.describe('Configurator Section', () => {
    test('should allow interacting with configurator options and add to cart', async ({ page }) => {
        await page.goto('/');

        // Scroll to configurator section to ensure it loads
        const addToCartBtn = page.locator('button', { hasText: /Add to Cart/i });
        
        await addToCartBtn.scrollIntoViewIfNeeded();
        await expect(addToCartBtn).toBeVisible({ timeout: 10000 });

        // Handle the alert dialog (demo feature or login prompt)
        let dialogTriggered = false;
        page.on('dialog', async dialog => {
            dialogTriggered = true;
            expect(dialog.message()).toMatch(/Please log in|Added to cart/i);
            await dialog.accept();
        });

        // Click Add to Cart
        await addToCartBtn.click();
        
        // Ensure dialog was handled
        expect(dialogTriggered).toBe(true);
    });
});
