class BasePage {
  /**
   * Helper selector for cross-platform accessibility IDs / testIDs
   */
  byAccessibilityId(id) {
    return $(`~${id}`);
  }

  async waitForDisplayed(element, timeout = 10000) {
    await element.waitForDisplayed({ timeout });
  }

  /**
   * Type text into an input field safely across iOS and Android
   */
  async dismissKeyboardsAndPopups() {
    if (driver.isIOS) {
      try {
        const returnBtn = await $('~Return');
        if (await returnBtn.isDisplayed()) {
          await returnBtn.click();
        }
      } catch (e) {}

      try {
        const doneBtn = await $('~Done');
        if (await doneBtn.isDisplayed()) {
          await doneBtn.click();
        }
      } catch (e) {}

      try {
        const closeBtn = await $('~close');
        if (await closeBtn.isDisplayed()) {
          await closeBtn.click();
        }
      } catch (e) {}

      // If keyboard is still shown, tap outside or hide
      try {
        if (await driver.isKeyboardShown()) {
          await driver.hideKeyboard();
        }
      } catch (e) {}
    }
  }

  /**
   * Type text into an input field safely across iOS and Android
   */
  async typeInput(element, text) {
    await this.waitForDisplayed(element);
    await element.click();
    await element.clearValue();
    // Type characters sequentially
    for (const char of text) {
      await element.addValue(char);
    }

    await this.dismissKeyboardsAndPopups();
  }

  /**
   * Cross-platform text reader for React Native Text components
   * On iOS, getText() can return accessibilityLabel / testID if label is set.
   * This helper checks text, label, or value attribute cleanly.
   */
  async getElementText(element) {
    if (driver.isIOS) {
      const val = await element.getAttribute('value');
      if (val !== null && val !== undefined && val !== '') {
        return val;
      }
      const label = await element.getAttribute('label');
      if (label !== null && label !== undefined && label !== '') {
        return label;
      }
    }
    return await element.getText();
  }
}

module.exports = BasePage;
