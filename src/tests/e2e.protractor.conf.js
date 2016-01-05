exports.config = {

  allScriptsTimeout: 99999,

  // The address of a running selenium server.
  //seleniumAddress: 'http://localhost:4444/wd/hub',

    seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.48.2.jar',
    seleniumPort: 4444,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'firefox'
  },

  baseUrl: 'http://localhost:9000/',

  framework: 'jasmine',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['/src/tests/e2e/**/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose : true,
    includeStackTrace : true
  }
};
