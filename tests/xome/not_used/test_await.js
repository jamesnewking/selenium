const {Builder, By, Key, until} = require('selenium-webdriver');

async function main() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .build();

    await driver.get('http://www.google.com/ncr')

    const element = await driver.findElement(By.name('q'))

    await element.sendKeys('webdriver', Key.RETURN)
    await driver.wait(until.titleIs('swebdriver - Google Search'), 1000).catch( () => console.log('title not found'))
    await driver.quit();
}
main();