import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { faker } from '@faker-js/faker';

test.describe('Shopping Cart tests', () => {

    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);

        await page.goto('https://www.saucedemo.com/');
        await loginPage.authorize('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('Add one item to the cart', async ({ page }) => {
    const item = await inventoryPage.findItemByName('Sauce Labs Onesie');
    await item?.addToCart();
    console.log('Added to cart:', item?.name);
    console.log('Item description:', item?.description);
});

        test('Add three items to the cart and check how many items are in the cart', async ({ page }) => {
        const item = await inventoryPage.findItemByName('Sauce Labs Onesie');
        await item?.addToCart();
        console.log('Added to cart:', item?.name);
        console.log('Item description:', item?.description);
        const item2 = await inventoryPage.findItemByName('Sauce Labs Bolt T-Shirt');
        await item2?.addToCart();
        console.log('Added to cart:', item2?.name);
        console.log('Item description:', item2?.description);
        const item3 = await inventoryPage.findItemByName('Sauce Labs Bike Light');
        await item3?.addToCart();
        console.log('Added to cart:', item3?.name);
        console.log('Item description:', item3?.description); 
        const cartItemCount = await inventoryPage.getCartItemCount();
        console.log('Number of items in the cart:', cartItemCount);    
    });

test('Item removal functionality', async () => {
    const item1 = await inventoryPage.findItemByName('Sauce Labs Onesie');
    await item1?.addToCart();

    const item2 = await inventoryPage.findItemByName('Sauce Labs Bolt T-Shirt');
    await item2?.addToCart();

    const item3 = await inventoryPage.findItemByName('Sauce Labs Bike Light');
    await item3?.addToCart();

    // Используем метод removeFromCart из объекта товара
    await item2?.removeFromCart();

    const cartItemCount = await inventoryPage.getCartItemCount();
    console.log('Number of items in the cart after removal:', cartItemCount);
    
    // Добавим проверку для надежности
    expect(cartItemCount).toBe('2');
});
});