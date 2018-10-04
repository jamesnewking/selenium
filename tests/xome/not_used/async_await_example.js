const {Builder, By, Key, until, Actions} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');

async function doGoogleSearch() {
    let driver = new Builder().forBrowser('firefox').build();
    await driver.get('http://www.google.com');
    await driver.findElement(By.name('q')).sendKeys('webdriver');
    await driver.findElement(By.name('q')).sendKeys(webdriver.Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    await driver.quit();
}

doGoogleSearch()
    .then( () => console.log('Success!'), e => console.error('FAILURE: ' + e));
