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

  async logout() {
    await this.waitForDisplayed(this.logoutButton);
    await this.logoutButton.click();
  }
}

module.exports = new HomePage();
