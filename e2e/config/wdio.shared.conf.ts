import path from 'node:path';

export const config: WebdriverIO.Config = {
  runner: 'local',
  port: 4723,
  capabilities: [],
  specs: [path.join(__dirname, '../tests/**/*.spec.ts')],
  exclude: [],
  maxInstances: 1,
  logLevel: 'info',
  waitforTimeout: 20000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000,
  },
};
