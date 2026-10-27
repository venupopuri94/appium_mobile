import BasePage from './BasePage';

class HomePage extends BasePage {
  get screen() {
    return this.byAccessibilityId('home-screen');
  }

  get welcomeTitle() {
    return this.byAccessibilityId('home-welcome-title');
  }

  get userName() {
    return this.byAccessibilityId('home-user-name');
  }

  get userEmail() {
    return this.byAccessibilityId('home-user-email');
  }

  get logoutButton() {
    return this.byAccessibilityId('logout-button');
  }

  // Logout confirmation alert elements
  get logoutModal() {
    return this.byAccessibilityId('logout-confirmation-modal');
  }

  get logoutAlertTitle() {
    return this.byAccessibilityId('logout-alert-title');
  }

  get logoutConfirmButton() {
    return this.byAccessibilityId('logout-confirm-button');
  }

  get logoutCancelButton() {
    return this.byAccessibilityId('logout-cancel-button');
  }

  // Demo screen navigation actions
  get analyticsActionButton() {
    return this.byAccessibilityId('action-analytics-button');
  }

  get settingsActionButton() {
    return this.byAccessibilityId('action-settings-button');
  }

  get backToHomeButton() {
    return this.byAccessibilityId('back-to-home-btn');
  }

  get settingsBackButton() {
    return this.byAccessibilityId('settings-back-btn');
  }

  get analyticsScreen() {
    return this.byAccessibilityId('analytics-screen');
  }

  get analyticsPeriodToggle() {
    return this.byAccessibilityId('analytics-period-toggle');
  }

  get analyticsPeriodValue() {
    return this.byAccessibilityId('analytics-period-value');
  }

  get analyticsSpendingTotal() {
    return this.byAccessibilityId('analytics-spending-total');
  }

  get settingsScreen() {
    return this.byAccessibilityId('settings-screen');
  }

  get transactionsActionButton() {
    return this.byAccessibilityId('action-transactions-button');
  }

  get transactionsScreen() {
    return this.byAccessibilityId('transactions-screen');
  }

  get transactionsBackButton() {
    return this.byAccessibilityId('transactions-back-btn');
  }

  get allTransactionsFilter() {
    return this.byAccessibilityId('transaction-filter-all');
  }

  get incomeTransactionsFilter() {
    return this.byAccessibilityId('transaction-filter-incoming');
  }

  get expenseTransactionsFilter() {
    return this.byAccessibilityId('transaction-filter-outgoing');
  }

  get transactionCount() {
    return this.byAccessibilityId('transaction-count');
  }

  get budgetActionButton() {
    return this.byAccessibilityId('action-budget-button');
  }

  get budgetScreen() {
    return this.byAccessibilityId('budget-screen');
  }

  get budgetBackButton() {
    return this.byAccessibilityId('budget-back-btn');
  }

  get increaseFoodBudgetButton() {
    return this.byAccessibilityId('budget-increase-food');
  }

  get decreaseFoodBudgetButton() {
    return this.byAccessibilityId('budget-decrease-food');
  }

  get foodBudgetLimit() {
    return this.byAccessibilityId('budget-limit-food');
  }

  get notificationsToggle() {
    return this.byAccessibilityId('settings-notifications-toggle');
  }

  get notificationsValue() {
    return this.byAccessibilityId('settings-notifications-value');
  }

  get appearanceToggle() {
    return this.byAccessibilityId('settings-appearance-toggle');
  }

  get appearanceValue() {
    return this.byAccessibilityId('settings-appearance-value');
  }

  async logout(confirm = true) {
    await this.waitForDisplayed(this.logoutButton);
    await this.logoutButton.click();

    // Wait for the modal content before querying its action buttons on iOS.
    await this.waitForDisplayed(this.logoutAlertTitle, 10000);
    await this.waitForDisplayed(this.logoutConfirmButton, 10000);
    if (confirm) {
      await this.logoutConfirmButton.click();
    } else {
      await this.logoutCancelButton.click();
      await this.waitForDisplayed(this.welcomeTitle);
    }
  }

  async openAnalytics() {
    await this.waitForDisplayed(this.analyticsActionButton);
    await this.analyticsActionButton.click();
    await this.waitForDisplayed(this.analyticsScreen);
  }

  async openSettings() {
    await this.waitForDisplayed(this.settingsActionButton);
    await this.settingsActionButton.click();
    await this.waitForDisplayed(this.settingsScreen);
  }

  async returnToHomeFromAnalytics() {
    await this.waitForDisplayed(this.backToHomeButton);
    await this.backToHomeButton.click();
    await this.waitForDisplayed(this.welcomeTitle);
  }

  async returnToHomeFromSettings() {
    await this.waitForDisplayed(this.settingsBackButton);
    await this.settingsBackButton.click();
    await this.waitForDisplayed(this.welcomeTitle);
  }

  async openTransactions(): Promise<void> {
    await this.waitForDisplayed(this.transactionsActionButton);
    await this.transactionsActionButton.click();
    await this.waitForDisplayed(this.transactionsScreen);
  }

  async returnToHomeFromTransactions(): Promise<void> {
    await this.waitForDisplayed(this.transactionsBackButton);
    await this.transactionsBackButton.click();
    await this.waitForDisplayed(this.welcomeTitle);
  }

  async openBudget(): Promise<void> {
    await this.waitForDisplayed(this.budgetActionButton);
    await this.budgetActionButton.click();
    await this.waitForDisplayed(this.budgetScreen);
  }

  async returnToHomeFromBudget(): Promise<void> {
    await this.waitForDisplayed(this.budgetBackButton);
    await this.budgetBackButton.click();
    await this.waitForDisplayed(this.welcomeTitle);
  }
}

export default new HomePage();
