import BasePage from './BasePage';

class SignupPage extends BasePage {
  get title() {
    return this.byAccessibilityId('signup-title');
  }

  get nameInput() {
    return this.byAccessibilityId('signup-name-input');
  }

  get emailInput() {
    return this.byAccessibilityId('signup-email-input');
  }

  get passwordInput() {
    return this.byAccessibilityId('signup-password-input');
  }

  get signupButton() {
    return this.byAccessibilityId('signup-submit-button');
  }

  get goToLoginButton() {
    return this.byAccessibilityId('goto-login-button');
  }

  get errorMessage() {
    return this.byAccessibilityId('signup-error-text');
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    await this.typeInput(this.nameInput, name);
    await this.typeInput(this.emailInput, email);
    await this.typeInput(this.passwordInput, password);
    await this.waitForDisplayed(this.signupButton);
    await this.signupButton.click();
  }

  async navigateToLogin(): Promise<void> {
    await this.dismissKeyboardsAndPopups();
    await this.waitForDisplayed(this.goToLoginButton);
    await this.goToLoginButton.click();
  }
}

export default new SignupPage();
