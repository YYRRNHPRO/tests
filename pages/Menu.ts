import { Locator, Page } from '@playwright/test';

export class Menu {
    private readonly page: Page;
    private readonly menuButton: Locator;
    private readonly logoutButton: Locator;
    private readonly allItemsButton: Locator;
    private readonly aboutButton: Locator;
    private readonly resetAppStateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutButton = page.locator('#logout_sidebar_link');
        this.allItemsButton = page.locator('#inventory_sidebar_link');
        this.aboutButton = page.locator('#about_sidebar_link');
        this.resetAppStateButton = page.locator('#reset_sidebar_link');
    }

    async openMenu() {
        await this.menuButton.click();
    }

    async logout() {
        await this.openMenu();
        await this.logoutButton.click();
    }

    async goToAllItems() {
        await this.openMenu();
        await this.allItemsButton.click();
    }

    async goToAbout() {
        await this.openMenu();
        await this.aboutButton.click();
    }

    async resetAppState() {
        await this.openMenu();
        await this.resetAppStateButton.click();
    }
}
