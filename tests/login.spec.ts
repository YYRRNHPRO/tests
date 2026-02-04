import {test, expect} from '@playwright/test';
import { error } from 'console';

test.describe("Authorization on saucedemo.com without POM", () => {

    test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com/');
    });

    test('Happy path: success authorization', async ({page}) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();

        //assertions
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        //regExp
        await expect(page).toHaveURL(/.*inventory.html/);

        await expect(page.locator('.title')).toHaveText('Products');

        await expect(page.locator('.inventory_container')).toBeVisible();
    });

    test('Close error message and verify it is dissappeared', async ({ page }) => {
        await page.locator('[data-test="login-button"]').click();

        await expect(page.locator('[data-test="error"]')).toBeVisible();

        const errorButton = page.locator('[data-test="error-button"]');
        await expect(errorButton).toBeVisible();

        await errorButton.click();

        await expect(page.locator('[data-test="error"]')).not.toBeVisible();
    });

    test('Verify password field has type = password and placeholder', async ({ page }) => {
        const passwordInput = page.locator('[data-test="password"]');
        await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });
    test('verfy that login button is enabled', async ({ page }) => {
        await expect(page.locator('[data-test="login-button"]')).toBeEnabled();
    })
})