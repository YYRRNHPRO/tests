import { test, expect } from '@playwright/test';
import fs from 'fs'

test.describe("Locators in Playwright", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:8080");
    });

/*Search by ROLE*/

test("Role locators", async ({ page }) => {
    await page.getByRole("button",{ name: "Primary Button"}).click();
    await page.getByRole("button", { name: "Save"}).click();

    //Searc for links
    await expect(page.getByRole("link", { name: "Playwright Documentation"})).toBeVisible();

    //search heading
    await expect(page.getByRole("heading", { name: "1. Buttons"})).toBeVisible();
    //Search for form elements
    await page.getByRole("textbox", { name: "Username:"}).fill("John");
    await page.getByRole("textbox", { name: "Email:"}).fill("John@gmail.com");
    await page.getByRole("textbox", { name: "Password:"}).fill("JohnJohnJohn");
    await page.getByRole("spinbutton", { name: "Number:"}).click();
    await page.getByRole("spinbutton", { name: "Number:"}).fill("62");

    await page.getByRole("checkbox", {name: "Option 1"}).check();
    await expect(page.getByRole("checkbox", {name: "Option 1"})).toBeChecked();

    await page.getByRole("radio", { name: "Choice 1"}).check();

    await page.getByRole("combobox", { name: "Select Option:"}).selectOption("canada");
});

test("label locators", async ({ page }) => {
    await page.getByLabel("Username:").fill("Alice");
    await page.getByLabel("Email:").fill("Alice@gmail.com");
    await page.getByLabel("Password:").fill("AliceAliceAlice");


    await expect(page.getByLabel("Username:")).toHaveValue("Alice");
    await expect(page.getByLabel("Email:")).toHaveValue("Alice@gmail.com");
});

test("placeholder locators", async ({ page }) => {
    await page.getByPlaceholder("Enter username").fill("Bob");
    await page.getByPlaceholder("Enter email").fill("Bob@gmail.com");
});

test("text locators", async ({ page }) => {
    await page.getByText("Primary Button").click();
    await page.getByText("Playwright Documentation").click();
});
test("List locators", async ({ page }) => {
    const listItems = page.locator("#unordered-list li");
    await expect(listItems).toHaveCount(4);

    await expect(listItems.nth(0)).toHaveText("First element");

    for(let i = 0; i < await listItems.count(); i++) {
        const text = await listItems.nth(i).textContent();
        console.log(`Item ${i}: ${text}`);
    }  
});
test("Dropdown and Select", async ({ page }) => {
    const countrySelect = page.getByLabel('Select country:')
    await countrySelect.selectOption('usa');
    await expect(countrySelect).toHaveValue('usa');

    await page.getByRole('button', { name: "Select action" }).click();
    await page.locator('[data-action="edit"]').click();
});
test("Model window locators", async ({ page }) => {
    await page.getByRole('button', { name: 'Open Modal' }).click();
    await page.locator('.modal-window');
});

test("Drag and drop", async ({ page }) => {
    const dragItem = page.locator('#tem1')

    const dragTarget = page.locator('#rop-target')

    await expect(dragItem).toBeVisible();

    await dragItem.dragTo(dragTarget);

    await expect(dragTarget.locator('#item1')).toBeVisible();
});

test("File upload", async ({ page }) => {
    const fileinput = page.locator('#file-input')

    await fileinput.setInputFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: fs.readFileSync('test.txt'),
    })


})

test('Datapicker', async ({ page }) => {
    const Datapicker = page.getByTestId('date-picker');

    await Datapicker.fill('2024-12-31');

    await expect(Datapicker).toHaveValue('2024-12-31');

    const currentDatePickerValue = await Datapicker.inputValue();
    expect(currentDatePickerValue).toBe('2025-12-10')
})

test('Dropdown and select', async ({ page }) => {
    const countrySelect = page.getByLabel('Select country:');
    
    await countrySelect.selectOption('usa');
    
    await expect(countrySelect).toHaveValue('usa');

    const actionButton = page.getByRole('button', { name: "Select action" });
    await actionButton.click();
    
    await page.locator('[data-action="edit"]').click();
});
})