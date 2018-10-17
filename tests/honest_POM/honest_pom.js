const assert = require('assert');
const fetch = require('node-fetch');
const webdriver = require('selenium-webdriver'),
    Builder = webdriver.Builder,
    By = webdriver.By,
    logging = webdriver.logging,
    until = webdriver.until;
//const test = require('selenium-webdriver/testing');
const { expect } = require('chai');
//const { should } = require('chai').should();
const credentials = require('../../honest_cred');
const honestXpath = require('./honest_pom_xpath');
var driver;
let browserToTest = process.argv[4];
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const screenSize = {
    width: 1280,
    height: 920
};
const title = require("./pom_title");
const advertisement = require("./pom_ad");
const feeding = require("./pom_feeding");
const emptycart = require("./pom_emptycart");
const backtomain = require("./pom_backtomain");

describe( 'Honest smoke test', () => {
    before(async () => {

        switch(browserToTest) {
            case '--edge':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.edge())
                    .build();
                browserToTest = 'edge';
                break;
            case '--firefox':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.firefox())
                    .build();
                browserToTest = 'firefox';
                break;
            case '--headlessfirefox':
                driver = await new webdriver
                    .Builder().usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.firefox())
                    .setFirefoxOptions(new firefox.Options().headless().windowSize(screenSize))
                    .build();
                browserToTest = 'firefox';
                console.log('headless FireFox mode');
                break;
            case '--ie':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.ie())
                    .build();
                browserToTest = 'ie';
                break;
            case '--headlesschrome':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.chrome())
                    .setChromeOptions(new chrome.Options().headless().windowSize(screenSize))
                    .build();
                browserToTest = 'chrome';
                console.log('headless Chrome mode');
                break;
            default:
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.chrome())
                    .build();
                browserToTest = 'chrome';
        }
        console.log(`Testing browser: ${browserToTest}`);
        await driver.get('https://www.honest.com');
        await driver.manage().setTimeouts({implicit:10000});

        if (browserToTest === 'edge'){
            await driver.manage().window().maximize();
        } else {
            await driver.manage().window().setRect( {width: 1280, height: 920});
        };
    } );

    after(async () => {
        await driver.quit();

    });

    it(`(1) testing webpage title`, async () => {
        let webTitle = new title(driver);
        expect(webTitle.expectedTitleName).to.equal(await webTitle.actualWebTitle(), 'Error: main webpage title does not match')

    })

    it('(2) close splash ad', async() => {
        let splashAd = new advertisement(driver);
        let adResult = await splashAd.checkSplashAd();
        console.log(`SplashAd type is ${adResult}`);
        expect(adResult).to.be.a('string');
    });

    it('(3) click diapering on Nav', async () => {
        await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
        await driver.sleep(1000);
        await driver.findElement( { 'xpath' : honestXpath.topNavDiapering } ).click();
    });

    it('(4) add feeding to cart', async () => {
        let feedingItem = new feeding(driver, webdriver);
        let singleItem = await feedingItem.addFeedingItem();
        let singleItemTitle = singleItem.name;
        let singleItemPrice = singleItem.price;
        let cartItem = await feedingItem.cartItem();
        let cartItemName = cartItem.name;
        let cartItemPrice = cartItem.price;

        expect(singleItemTitle.trim()).to.equal(feedingItem.formulaName().trim(),'Error: product name does not match!');
        expect(singleItemTitle.trim()).to.equal(cartItemName.trim(),'Error: product name does not match in the cart!');
        expect(singleItemPrice.trim()).to.equal(cartItemPrice.trim(),'Error: product price does not match in the cart!');
    });

    it('(5) empty cart', async () => {
        let emptyCart = new emptycart(driver);
        await emptyCart.clickEmptyCart();
        const emptyCartMsg = await emptyCart.cartMessage();
        const emptyCartPrice = await emptyCart.cartPrice();
        console.log(`verify empty cart: ${emptyCartMsg} with price: ${emptyCartPrice}`);
        expect(emptyCartMsg).to.equal(emptyCart.expectedMsg(),'Error: empty cart message does not match!');
        expect(emptyCartPrice).to.equal(emptyCart.expectedPrice(),'Error: empty cart message does not match!');
    });

    it('(6) back to main page', async () => {
        let backToMainPage = new backtomain(driver, webdriver);
        expect( await backToMainPage.isBacktoMainPage(), 'Error: Did not get back to main page').to.be.true;
    });

});

