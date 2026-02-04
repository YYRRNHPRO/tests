import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { Menu } from '../pages/Menu';

test.describe('Полное тестирование saucedemo.com', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let productDetailsPage: ProductDetailsPage;
  let menu: Menu;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    menu = new Menu(page);
    await page.goto('https://www.saucedemo.com/');
  });

  test('Успешная авторизация', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Блокировка пользователя (locked_out_user)', async () => {
    await loginPage.authorize('locked_out_user', 'secret_sauce');
    expect(await loginPage.getErrorMessage()).toContain('Sorry, this user has been locked out.');
  });

  test('Добавление и удаление товаров из корзины', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
    const item = await inventoryPage.findItemByName('Sauce Labs Backpack');
    await item?.addToCart();
    await inventoryPage.clickCart();
    expect(await cartPage.getCartItemsCount()).toBe(1);
    await cartPage.removeItemByName('Sauce Labs Backpack');
    expect(await cartPage.getCartItemsCount()).toBe(0);
  });

  test('Переход к деталям товара', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
    await expect(inventoryPage.page).toHaveURL(/inventory/);
    const bikeLightLink = inventoryPage.page.locator('[data-test="item-0-title-link"]');
    await bikeLightLink.click();
    expect(await productDetailsPage.getTitle()).toContain('Sauce Labs Bike Light');
    await productDetailsPage.goBackToProducts();
    await expect(inventoryPage.page).toHaveURL(/inventory/);
  });

  test('Оформление заказа (checkout flow)', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
    const item = await inventoryPage.findItemByName('Sauce Labs Bolt T-Shirt');
    await item?.addToCart();
    await inventoryPage.clickCart();
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInfo('Ivan', 'Ivanov', '123456');
    await checkoutPage.clickContinue();
    expect(await checkoutPage.isSummaryVisible()).toBeTruthy();
    await checkoutPage.clickFinish();
    expect(await checkoutPage.isCompleteHeaderVisible()).toBeTruthy();
  });

  test('Валидация обязательных полей на checkout', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
    const item = await inventoryPage.findItemByName('Sauce Labs Onesie');
    await item?.addToCart();
    await inventoryPage.clickCart();
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInfo('', '', '');
    await checkoutPage.clickContinue();
    expect(await checkoutPage.getErrorMessage()).toContain('Error: First Name is required');
  });

  test('Логаут через меню', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
    await menu.logout();
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Сброс состояния приложения', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
    const item = await inventoryPage.findItemByName('Sauce Labs Backpack');
    await item?.addToCart();
    await menu.resetAppState();
    expect(await inventoryPage.getCartItemCount()).toBe('');
  });

  test('Проверка сортировки товаров', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
    await expect(inventoryPage.page).toHaveURL(/inventory/);
    const sortSelect = inventoryPage.page.locator('select[data-test="product_sort_container"]');
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption('za');
    const firstItem = inventoryPage.page.locator('.inventory_item_name').first();
    await expect(firstItem).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });
});
