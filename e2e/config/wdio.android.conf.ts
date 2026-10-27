import path from 'node:path';
import { config } from './wdio.shared.conf';

const androidCapability: Record<string, string | number | boolean> = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
  'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '13.0',
  'appium:app':
    process.env.ANDROID_APP_PATH ||
    path.join(__dirname, '../../android/app/build/outputs/apk/debug/app-debug.apk'),
  'appium:appPackage': 'com.authapp',
  'appium:appActivity': '.MainActivity',
  'appium:newCommandTimeout': 240,
  'appium:autoGrantPermissions': true,
};

config.capabilities = [androidCapability as WebdriverIO.Capabilities];
export { config };
