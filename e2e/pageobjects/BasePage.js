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
    for (const character of text) {
      await element.addValue(character);
    }

    await this.dismissKeyboardsAndPopups();
  }

  /**
   * Cross-platform text reader for React Native Text components
   * Prefer the element's displayed text. Appium can expose an accessibility
   * identifier through value/label when React Native text has a custom label.
   */
  async getElementText(element) {
    const text = await element.getText();
    if (text !== null && text !== undefined && text !== '') {
      return text;
    }

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
    return text;
  }
}

module.exports = BasePage;
