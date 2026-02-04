import { Locator, Page } from '@playwright/test';

export class CartPage {
    private readonly page: Page;
    private readonly cartItems: Locator;
    private readonly checkoutButton: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly removeButtons: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.removeButtons = page.locator('button:has-text("Remove")');
    }

    async getCartItemsCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async removeItemByName(productName: string): Promise<void> {
        const item = this.cartItems.filter({ hasText: productName });
        await item.locator('button:has-text("Remove")').click();
    }

    async clickCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    async clickContinueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }
}
