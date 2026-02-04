import { Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
    private readonly page: Page;
    private readonly title: Locator;
    private readonly description: Locator;
    private readonly price: Locator;
    private readonly addToCartButton: Locator;
    private readonly removeButton: Locator;
    private readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('.inventory_details_name');
        this.description = page.locator('.inventory_details_desc');
        this.price = page.locator('.inventory_details_price');
        this.addToCartButton = page.locator('button:has-text("Add to cart")');
        this.removeButton = page.locator('button:has-text("Remove")');
        this.backButton = page.locator('[data-test="back-to-products"]');
    }

    async getTitle(): Promise<string> {
        return await this.title.innerText();
    }

    async getDescription(): Promise<string> {
        return await this.description.innerText();
    }

    async getPrice(): Promise<string> {
        return await this.price.innerText();
    }

    async addToCart() {
        await this.addToCartButton.click();
    }

    async removeFromCart() {
        if (await this.removeButton.isVisible()) {
            await this.removeButton.click();
        }
    }

    async goBackToProducts() {
        await this.backButton.click();
    }
}
