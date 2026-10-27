const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  get title() {
    return this.byAccessibilityId('login-title');
  }

  get emailInput() {
    return this.byAccessibilityId('login-email-input');
  }

  get passwordInput() {
    return this.byAccessibilityId('login-password-input');
  }

  get loginButton() {
    return this.byAccessibilityId('login-submit-button');
  }

  get goToSignupButton() {
    return this.byAccessibilityId('goto-signup-button');
  }

  get errorMessage() {
    return this.byAccessibilityId('login-error-text');
  }

  async login(email, password) {
    await this.typeInput(this.emailInput, email);
    await this.typeInput(this.passwordInput, password);
    await this.waitForDisplayed(this.loginButton);
    await this.loginButton.click();
  }

  async navigateToSignup() {
    await this.waitForDisplayed(this.goToSignupButton);
    await this.goToSignupButton.click();
  }
}

module.exports = new LoginPage();
