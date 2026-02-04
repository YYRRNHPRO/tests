import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
    private readonly page: Page;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly finishButton: Locator;
    private readonly errorMessage: Locator;
    private readonly summaryContainer: Locator;
    private readonly completeHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.summaryContainer = page.locator('.summary_info');
        this.completeHeader = page.locator('.complete-header');
    }

    async fillCheckoutInfo(first: string, last: string, postal: string) {
        await this.firstNameInput.fill(first);
        await this.lastNameInput.fill(last);
        await this.postalCodeInput.fill(postal);
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async clickFinish() {
        await this.finishButton.click();
    }

    async getErrorMessage(): Promise<string> {
        return (await this.errorMessage.textContent()) || '';
    }

    async isSummaryVisible(): Promise<boolean> {
        return await this.summaryContainer.isVisible();
    }

    async isCompleteHeaderVisible(): Promise<boolean> {
        return await this.completeHeader.isVisible();
    }
}
