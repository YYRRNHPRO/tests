import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage';

test.describe('Authorization suite', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto('https://www.saucedemo.com');
    });

    test('Success login', async () => {
        await loginPage.authorize('standard_user', 'secret_sauce');
        await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('Unhappy path: unsuccessful authorization', async () => {
        await loginPage.authorize('test', 'test');
        expect(await loginPage.getErrorMessage()).toContain('Epic sadface: Username and password do not match any user in this service');
        expect(await loginPage.isErrorDisplayed()).toBeTruthy();
        expect(await loginPage.isOnLoginPage()).toBeTruthy();
    });

test('Login with wrong username', async () => {
        await loginPage.authorize('wrong_user', 'secret_sauce');
        expect(await loginPage.getErrorMessage()).toContain('Epic sadface: Username and password do not match any user in this service');
    });

    test('Login with wrong password', async () => {
        await loginPage.authorize('standard_user', 'wrong_password');
        expect(await loginPage.getErrorMessage()).toContain('Epic sadface: Username and password do not match any user in this service');
    });

    test('Login with empty fields', async () => {
        await loginPage.authorize('', '');
        expect(await loginPage.getErrorMessage()).toContain('Epic sadface: Username is required');
    });

    test('Close error message test', async () => {
        await loginPage.authorize('test', 'test');
        await loginPage.clickErrorButton();
        expect(await loginPage.isErrorDisplayed()).toBeFalsy();
    });
});