import { Locator, Page } from '@playwright/test';

export class InventoryPage {
    public readonly page: Page;
    private readonly cartBadge: Locator;
    private readonly cartLink: Locator;
    private readonly inventoryItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartLink = page.locator('.shopping_cart_link');
        this.inventoryItems = page.locator('.inventory_item');
    }

    async addProductToCart(productName: string): Promise<void> {
        const dataTestId = this.getDataTestId(productName);
        await this.page.locator(`[data-test="add-to-cart-${dataTestId}"]`).click();
    }

    private getDataTestId(productName: string): string {
        return productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    }

    async clickCart(): Promise<void> {
        await this.cartLink.click();
    }

    private getProductContainer(productName: string): Locator {
        return this.inventoryItems.filter({ hasText: productName });
    }

    async addProductToCartSimple(productName: string): Promise<void> {
        const product = this.getProductContainer(productName);
        await product.locator('button:has-text("Add to cart")').click();
    }

    async getCartItemCount(): Promise<string> {
        if (await this.cartBadge.isHidden()) return '';
        return (await this.cartBadge.innerText()).trim();
    }

    async getCartItemNumber(): Promise<number> {
        const countText = await this.getCartItemCount();
        return countText === '' ? 0 : parseInt(countText, 10);
    }

    getInventoryItemObjects = async (): Promise<InventoryItemObject[]> => {
        const count = await this.inventoryItems.count();
        const items: InventoryItemObject[] = [];
        for (let i = 0; i < count; i++) {
            const itemLocator = this.inventoryItems.nth(i);
            const name = await itemLocator.locator('.inventory_item_name').innerText();
            const description = await itemLocator.locator('.inventory_item_desc').innerText();
            const price = await itemLocator.locator('.inventory_item_price').innerText();
            const addToCartButton = itemLocator.locator('button:has-text("Add to cart")');
            const removeButton = itemLocator.locator('button:has-text("Remove")');
            
            items.push(new InventoryItemObject(
                name,
                description,
                price,
                addToCartButton,
                removeButton,
                itemLocator
            ));
        }
        return items;
    };

    findItemByName = async (name: string): Promise<InventoryItemObject | undefined> => {
        const items = await this.getInventoryItemObjects();
        return items.find(item => item.name.toLowerCase() === name.toLowerCase());
    };
}

export class InventoryItemObject {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: string,
        private readonly addToCartButton: Locator,
        private readonly removeButton: Locator,
        public readonly element: Locator
    ) {}

    async addToCart() {
        await this.addToCartButton.click();
    }

    async removeFromCart() {
        if (await this.removeButton.isVisible()) {
            await this.removeButton.click();
        }
    }

    get priceValue(): number | null {
        const match = this.price.match(/\d+\.?\d*/);
        return match ? parseFloat(match[0]) : null;
    }
}