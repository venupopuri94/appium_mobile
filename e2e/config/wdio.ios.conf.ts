import fs from 'node:fs';
import path from 'node:path';
import { config } from './wdio.shared.conf';

function getIosAppPath(): string {
  if (process.env.IOS_APP_PATH) {
    return process.env.IOS_APP_PATH;
  }

  const localBuild = path.join(__dirname, '../../ios/build/Build/Products/Debug-iphonesimulator/AuthApp.app');
  const appCandidates = [localBuild];
  const derivedDataDir = path.join(process.env.HOME || '', 'Library/Developer/Xcode/DerivedData');

  if (fs.existsSync(derivedDataDir)) {
    for (const entry of fs.readdirSync(derivedDataDir)) {
      if (entry.startsWith('AuthApp-')) {
        appCandidates.push(
          path.join(derivedDataDir, entry, 'Build/Products/Debug-iphonesimulator/AuthApp.app'),
        );
      }
    }
  }

  const existingApps = appCandidates.filter((candidate) => fs.existsSync(candidate));
  existingApps.sort((left, right) => {
    const leftExecutable = path.join(left, 'AuthApp');
    const rightExecutable = path.join(right, 'AuthApp');
    const leftModified = fs.existsSync(leftExecutable) ? fs.statSync(leftExecutable).mtimeMs : 0;
    const rightModified = fs.existsSync(rightExecutable) ? fs.statSync(rightExecutable).mtimeMs : 0;
    return rightModified - leftModified;
  });

  return existingApps[0] || localBuild;
}

const iosCapability: Record<string, string | number | boolean> = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 18 Pro',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '27.0',
  'appium:bundleId': 'org.reactjs.native.example.AuthApp',
  'appium:newCommandTimeout': 240,
  'appium:autoAcceptAlerts': true,
  'appium:noReset': false,
};

const appPath = getIosAppPath();
if (fs.existsSync(appPath)) {
  iosCapability['appium:app'] = appPath;
}

config.capabilities = [iosCapability as WebdriverIO.Capabilities];
export { config };
