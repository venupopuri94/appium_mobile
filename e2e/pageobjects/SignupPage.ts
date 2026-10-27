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

  private async revealSignupButton(): Promise<void> {
    if (await this.signupButton.isDisplayed().catch(() => false)) {
      return;
    }

    if (driver.isIOS) {
      await driver.execute('mobile: swipe', { direction: 'up' });
      return;
    }

    const { width, height } = await driver.getWindowSize();
    await driver.execute('mobile: swipeGesture', {
      left: 0,
      top: Math.floor(height * 0.2),
      width,
      height: Math.floor(height * 0.6),
      direction: 'up',
      percent: 0.6,
    });
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    await this.typeInput(this.nameInput, name);
    await this.typeInput(this.emailInput, email);
    await this.typeInput(this.passwordInput, password);
    await this.revealSignupButton();
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
