import { Locator, Page } from "@playwright/test";

export class LoginPage {
    public readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly errorButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]'); 
        this.errorButton = page.locator('[data-test="error-button"]');
    }

    async enterUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async clickErrorButton(): Promise<void> {
        await this.errorButton.click();
    }

    async authorize(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    async getErrorMessage(): Promise<string> {
        const errorText = await this.errorMessage.textContent();
        return errorText || '';
    }

    async isErrorDisplayed(): Promise<boolean> {
        return await this.errorMessage.isVisible();
    }

    async isOnLoginPage(): Promise<boolean> {
        const currentUrl = this.page.url();
        return currentUrl === "https://www.saucedemo.com/";
    }
}