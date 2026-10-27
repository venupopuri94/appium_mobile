const BasePage = require('./BasePage');

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

  get settingsScreen() {
    return this.byAccessibilityId('settings-screen');
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
}

module.exports = new HomePage();
