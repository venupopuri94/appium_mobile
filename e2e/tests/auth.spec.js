const LoginPage = require('../pageobjects/LoginPage');
const SignupPage = require('../pageobjects/SignupPage');
const HomePage = require('../pageobjects/HomePage');

describe('Mobile Authentication Flow - Comprehensive Test Suite', () => {
  beforeEach(async () => {
    // Dismiss any iOS system modal or sheet if visible
    try {
      const closeBtn = await $('~close');
      if (await closeBtn.isDisplayed()) {
        await closeBtn.click();
      }
    } catch (e) {}

    // If we land in Home screen from a prior run, logout to reset to Login
    try {
      const isHome = await HomePage.welcomeTitle.isDisplayed();
      if (isHome) {
        await HomePage.logout();
      }
    } catch (e) {}

    // If on Signup screen, go back to Login
    try {
      const isSignup = await SignupPage.goToLoginButton.isDisplayed();
      if (isSignup) {
        await SignupPage.navigateToLogin();
      }
    } catch (e) {}

    await LoginPage.waitForDisplayed(LoginPage.emailInput, 15000);
  });

  describe('1. Login Screen Tests', () => {
    it('should display all login screen elements properly', async () => {
      await LoginPage.waitForDisplayed(LoginPage.title, 10000);
      await expect(LoginPage.emailInput).toBeDisplayed();
      await expect(LoginPage.passwordInput).toBeDisplayed();
      await expect(LoginPage.loginButton).toBeDisplayed();
      await expect(LoginPage.goToSignupButton).toBeDisplayed();
    });

    it('should show validation error when submitting empty fields', async () => {
      await LoginPage.loginButton.click();
      await LoginPage.waitForDisplayed(LoginPage.errorMessage, 5000);
      const errorMsg = await LoginPage.getElementText(LoginPage.errorMessage);
      expect(errorMsg).toContain('Please enter both email and password.');
    });

    it('should show error when credentials are invalid', async () => {
      await LoginPage.login('invalid_user@test.com', 'WrongPass!');
      await LoginPage.waitForDisplayed(LoginPage.errorMessage, 5000);
      const errorMsg = await LoginPage.getElementText(LoginPage.errorMessage);
      expect(errorMsg).toContain('Invalid email or password.');
    });

    it('should successfully login with valid credentials and navigate to Home Screen', async () => {
      await LoginPage.login('user@test.com', 'Password123!');

      await HomePage.waitForDisplayed(HomePage.welcomeTitle, 15000);
      const email = await HomePage.getElementText(HomePage.userEmail);
      expect(email).toEqual('user@test.com');

      // Logout and return to Login
      await HomePage.logout();
      await LoginPage.waitForDisplayed(LoginPage.emailInput, 15000);
    });
  });

  describe('2. Signup Screen Tests', () => {
    it('should navigate from Login to Signup screen', async () => {
      await LoginPage.navigateToSignup();
      await SignupPage.waitForDisplayed(SignupPage.title, 10000);
      await expect(SignupPage.nameInput).toBeDisplayed();
      await expect(SignupPage.emailInput).toBeDisplayed();
      await expect(SignupPage.passwordInput).toBeDisplayed();
      await expect(SignupPage.signupButton).toBeDisplayed();
      await expect(SignupPage.goToLoginButton).toBeDisplayed();

      // Navigate back to Login
      await SignupPage.navigateToLogin();
      await LoginPage.waitForDisplayed(LoginPage.emailInput, 10000);
    });

    it('should show validation error when registering with empty fields', async () => {
      await LoginPage.navigateToSignup();
      await SignupPage.waitForDisplayed(SignupPage.signupButton, 10000);
      await SignupPage.signupButton.click();

      await SignupPage.waitForDisplayed(SignupPage.errorMessage, 5000);
      const errorMsg = await SignupPage.getElementText(SignupPage.errorMessage);
      expect(errorMsg).toContain('Please fill in all fields.');

      await SignupPage.navigateToLogin();
      await LoginPage.waitForDisplayed(LoginPage.emailInput, 10000);
    });

    it('should show error when attempting to sign up with an existing email', async () => {
      await LoginPage.navigateToSignup();
      await SignupPage.waitForDisplayed(SignupPage.nameInput, 10000);

      await SignupPage.signup('Existing User', 'user@test.com', 'Password123!');
      await SignupPage.waitForDisplayed(SignupPage.errorMessage, 5000);
      const errorMsg = await SignupPage.getElementText(SignupPage.errorMessage);
      expect(errorMsg).toContain('An account with this email already exists.');

      await SignupPage.navigateToLogin();
      await LoginPage.waitForDisplayed(LoginPage.emailInput, 10000);
    });

    it('should successfully register a new user and transition directly to Home Screen', async () => {
      await LoginPage.navigateToSignup();
      await SignupPage.waitForDisplayed(SignupPage.nameInput, 10000);

      const testName = 'Jane Doe';
      const testEmail = `jane_${Date.now()}@test.com`;
      const testPass = 'SecurePass987!';

      await SignupPage.signup(testName, testEmail, testPass);

      await HomePage.waitForDisplayed(HomePage.welcomeTitle, 15000);
      const displayedName = await HomePage.getElementText(HomePage.userName);
      const displayedEmail = await HomePage.getElementText(HomePage.userEmail);

      expect(displayedName).toEqual(testName);
      expect(displayedEmail).toEqual(testEmail);

      // Logout and return to Login
      await HomePage.logout();
      await LoginPage.waitForDisplayed(LoginPage.emailInput, 15000);
    });
  });

  describe('3. Home Screen Tests', () => {
    it('should display user info and logout correctly', async () => {
      await LoginPage.login('user@test.com', 'Password123!');

      await HomePage.waitForDisplayed(HomePage.welcomeTitle, 15000);
      await expect(HomePage.screen).toBeDisplayed();
      await expect(HomePage.welcomeTitle).toBeDisplayed();
      await expect(HomePage.userName).toBeDisplayed();
      await expect(HomePage.userEmail).toBeDisplayed();
      await expect(HomePage.logoutButton).toBeDisplayed();

      const userEmail = await HomePage.getElementText(HomePage.userEmail);
      expect(userEmail).toEqual('user@test.com');

      // Test logout functionality
      await HomePage.logout();
      await LoginPage.waitForDisplayed(LoginPage.emailInput, 15000);
      await expect(LoginPage.emailInput).toBeDisplayed();
    });
  });
});
