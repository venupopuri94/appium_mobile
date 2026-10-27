import LoginPage from '../pageobjects/LoginPage';
import SignupPage from '../pageobjects/SignupPage';
import HomePage from '../pageobjects/HomePage';

describe('Mobile Authentication & App Flow', () => {
  it('completes signup, login, dashboard, and logout once for one new user', async () => {
    // A fresh app session should start on Login.
    await LoginPage.waitForDisplayed(LoginPage.emailInput, 15000);
    await expect(LoginPage.emailInput).toBeDisplayed();

    // Open Create Account and validate the empty and existing-account cases.
    await LoginPage.navigateToSignup();
    await SignupPage.waitForDisplayed(SignupPage.title, 10000);
    await expect(SignupPage.nameInput).toBeDisplayed();
    await expect(SignupPage.emailInput).toBeDisplayed();
    await expect(SignupPage.passwordInput).toBeDisplayed();

    await SignupPage.signupButton.click();
    await SignupPage.waitForDisplayed(SignupPage.errorMessage, 5000);
    expect(await SignupPage.getElementText(SignupPage.errorMessage)).toContain(
      'Please fill in all fields.',
    );

    await SignupPage.signup('Saketh Aryan', 'saketh.aryan@test.com', 'Test@123');
    await SignupPage.waitForDisplayed(SignupPage.errorMessage, 5000);
    expect(await SignupPage.getElementText(SignupPage.errorMessage)).toContain(
      'An account with this email already exists.',
    );

    // Create one new user; successful signup returns to Login.
    const testName = 'Venu Popuri';
    const testEmail = 'venu.popuri@test.com';
    const testPass = 'Test@123';
    await SignupPage.signup(testName, testEmail, testPass);

    await LoginPage.waitForDisplayed(LoginPage.emailInput, 15000);

    // Reject a wrong password, then log in with the created account.
    await LoginPage.login(testEmail, 'Wrong@123');
    await LoginPage.waitForDisplayed(LoginPage.errorMessage, 5000);
    expect(await LoginPage.getElementText(LoginPage.errorMessage)).toContain(
      'Invalid email or password.',
    );

    await LoginPage.login(testEmail, testPass);
    await HomePage.waitForDisplayed(HomePage.welcomeTitle, 15000);
    expect(await HomePage.getElementText(HomePage.userName)).toEqual(testName);
    expect(await HomePage.getElementText(HomePage.userEmail)).toEqual(testEmail);

    // Exercise the dashboard once.
    await HomePage.openAnalytics();
    expect(await HomePage.getElementText(HomePage.analyticsPeriodValue)).toEqual('Month');
    expect(await HomePage.getElementText(HomePage.analyticsSpendingTotal)).toEqual('$4,320');
    await HomePage.analyticsPeriodToggle.click();
    expect(await HomePage.getElementText(HomePage.analyticsPeriodValue)).toEqual('Quarter');
    expect(await HomePage.getElementText(HomePage.analyticsSpendingTotal)).toEqual('$12,400');
    await HomePage.returnToHomeFromAnalytics();

    await HomePage.openTransactions();
    expect(await HomePage.getElementText(HomePage.transactionCount)).toEqual('3 recent transactions');
    await HomePage.incomeTransactionsFilter.click();
    expect(await HomePage.getElementText(HomePage.transactionCount)).toEqual('1 recent transaction');
    await HomePage.expenseTransactionsFilter.click();
    expect(await HomePage.getElementText(HomePage.transactionCount)).toEqual('2 recent transactions');
    await HomePage.allTransactionsFilter.click();
    expect(await HomePage.getElementText(HomePage.transactionCount)).toEqual('3 recent transactions');
    await HomePage.returnToHomeFromTransactions();

    await HomePage.openBudget();
    expect(await HomePage.getElementText(HomePage.foodBudgetLimit)).toEqual('$1,200');
    await HomePage.increaseFoodBudgetButton.click();
    expect(await HomePage.getElementText(HomePage.foodBudgetLimit)).toEqual('$1,300');
    await HomePage.decreaseFoodBudgetButton.click();
    expect(await HomePage.getElementText(HomePage.foodBudgetLimit)).toEqual('$1,200');
    await HomePage.returnToHomeFromBudget();

    await HomePage.openSettings();
    expect(await HomePage.getElementText(HomePage.notificationsValue)).toContain('Enabled');
    await HomePage.notificationsToggle.click();
    expect(await HomePage.getElementText(HomePage.notificationsValue)).toContain('Disabled');
    await HomePage.notificationsToggle.click();
    expect(await HomePage.getElementText(HomePage.notificationsValue)).toContain('Enabled');
    expect(await HomePage.getElementText(HomePage.appearanceValue)).toEqual('Light Theme');
    await HomePage.appearanceToggle.click();
    expect(await HomePage.getElementText(HomePage.appearanceValue)).toEqual('Dark Theme');
    await HomePage.returnToHomeFromSettings();

    // Confirm sign out once and return to Login.
    await HomePage.logout(true);
    await LoginPage.waitForDisplayed(LoginPage.emailInput, 15000);
    await expect(LoginPage.emailInput).toBeDisplayed();
  });
});
