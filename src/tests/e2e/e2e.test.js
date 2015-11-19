'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('http://juliemr.github.io/protractor-demo/');

    expect(browser.getTitle()).toEqual('SuperCalculator');
  });
});
