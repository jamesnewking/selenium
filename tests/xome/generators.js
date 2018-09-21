const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

describe('Google Search', function(){
    let driver;

    test.before(function*(){
        driver = yield new Builder().forBrowser('firefox').build();
    });

    test.it('example', function* theTestFunction(){
        yield driver.get('https://www.google.com/ncr');
        yield driver.findElement(By.name('q')).sendKeys('webdriver');
        yield driver.findElement(By.name('btnG')).click();
        yield driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    });

    test.after(function*(){
        yield driver.quit();
    });
});