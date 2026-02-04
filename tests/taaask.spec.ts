import {test, expect} from '@playwright/test';

test.describe("Authorization on saucedemo.com without POM", () => {

    test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com/');
    });
        //EX1
    test('Unhappy path: unsuccessful authorization', async ({ page }) => {
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce1');
        await page.locator('[data-test="login-button"]').click();

        // Assertions
        await expect(page.locator('.error-message-container')).toBeVisible();
        await expect(page.locator('.error-message-container')).toHaveText('Epic sadface: Username and password do not match any user in this service');
        await expect(page).toHaveURL('https://www.saucedemo.com');
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
    })