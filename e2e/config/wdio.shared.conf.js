const path = require('path');

exports.config = {
  runner: 'local',
  port: 4723,
  specs: [
    path.join(__dirname, '../tests/**/*.spec.js')
  ],
  exclude: [],
  maxInstances: 1,
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 20000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000
  }
};
