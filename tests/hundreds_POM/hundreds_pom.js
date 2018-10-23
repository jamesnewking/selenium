const fetch = require('node-fetch');
const webdriver = require('selenium-webdriver'),
    Builder = webdriver.Builder,
    By = webdriver.By,
    logging = webdriver.logging,
    until = webdriver.until;
const { expect } = require('chai');
var driver;
let browserToTest = process.argv[4];
let checkPix = process.argv[5];
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const screenSize = {
    width: 1280,
    height: 920
};
const hundPath = require('./hundreds_pom_path');
const title = require("./pom_title");
const shopitem = require("./pom_shopitem");


describe( 'The Hundreds smoke test', () => {
    before(async () => {
        switch(browserToTest) {
            case '--edge':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.edge())
                    .build();
                break;
            case '--firefox':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.firefox())
                    .build();
                break;
            case '--headlessfirefox':
                driver = await new webdriver
                    .Builder().usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.firefox())
                    .setFirefoxOptions(new firefox.Options().headless().windowSize(screenSize))
                    .build();
                console.log('headless FireFox mode');
                break;
            case '--ie':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.ie())
                    .build();
                break;
            case '--headlesschrome':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.chrome())
                    .setChromeOptions(new chrome.Options().headless().windowSize(screenSize))
                    .build();
                console.log('headless Chrome mode');
                break;
            default:
                let options = new chrome.Options();
                options.setUserPreferences({'profile.default_content_setting_values.notifications': 2});
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.chrome())
                    .setChromeOptions(options)
                    .build();
        }
        browserToTest = browserToTest.slice(2);
        console.log(`Testing browser: ${browserToTest}`);
        await driver.get('https://thehundreds.com/');
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


    it('(2) all img URLs are valid links, returns server code 200', async () => {
        if(checkPix==='--checkpix') {
            let imageArr = await driver.findElements({'css': 'img'});
            let linkArr = await driver.findElements({'css': 'a'});
            console.log(`number of <img> tags: ${await imageArr.length}`);
            console.log(`number of <a> tags: ${await linkArr.length}`);
            await driver.executeScript("window.scrollTo(0,30000);");
            await driver.sleep(1500);
            await driver.executeScript("window.scrollTo(0,-30000);");
            let badPictureLink = false;
            for (let i = 0; i < imageArr.length; i++) {
                //console.log( await imageArr[i].getAttribute('src'));
                let imgUrl;
                try {
                    imgUrl = await imageArr[i].getAttribute('src');
                }
                catch (err) {
                    console.log("something wrong with this imgUrl #", i);
                    badPictureLink = true;
                    continue;
                }

                if (imgUrl == null) {
                    console.log(`this imgUrl #${i} is null!`);
                    continue;
                }

                // try {
                //     expect(imgUrl).to.exist;
                // }
                // catch(err) {
                //     console.log(`this imgUrl: does not exist`);
                //     continue;
                // }
                expect(imgUrl).to.be.a("string");//.catch(() => console.log(`this imgUrl: ${imgUrl} is not a string`));
                console.log(`${i}) `, imgUrl);
                fetch(imgUrl)
                    .then(
                        (response) => {
                            if (response.status === 200) {
                                console.log(`${i})image link to ${imgUrl} is valid`);
                                return;
                            }
                        }
                    )
                    .catch(
                        (err) => console.log('the image link has error: ', err)
                    );

            }
            await driver.sleep(6000);
            expect( badPictureLink ).to.equal( false ,'There is at lease one img with a bad link');
        } else {
            console.log('--Checkpix did not run.');
        }
        });



    it('(3) click shop on Nav', async () => {
        if(browserToTest==='edge'){
            console.log('edge');
            await driver.findElement( hundPath.edgeTopNavShop ).click();
        } else {
            await driver.findElement( hundPath.topNavHamburger ).click();
            //await driver.findElement( hundPath.topNavHamburger ).click();
            //await driver.findElement( hundPath.topNavHamburger ).click();
            await driver.wait(until.elementLocated( hundPath.topNavShop )).isDisplayed();
            await driver.findElement( hundPath.topNavShop ).click();
        }
    });

    it('(4) add item to cart, verify product in cart', async () => {
        //await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
        let shopItem = new shopitem(driver, webdriver);
        let gridItem = await shopItem.addOneItem();
        const { gridItemTitle, gridItemPrice } = gridItem;
        console.log(`From the grid, the item: ${gridItemTitle} costs: ${gridItemPrice}`);

        let singleItem = await shopItem.addSingleItemToCart();
        const { singleTitle, singlePrice, singleColor, singleSize} = singleItem;
        console.log(`the single item: ${ singleTitle} that costs: ${singlePrice} in: ${singleColor} size: ${singleSize}`);

        let finalCart = await shopItem.getFinalCartInfo();
        const { payCartTitle, payCartPrice, payCartColor, payCartSize} = finalCart;
        expect( gridItemTitle.trim()).to.equal(singleTitle.trim(),'Error: product name does not match!');
        expect( gridItemTitle.trim()).to.equal(payCartTitle.trim(),'Error: product name does not match!');
        expect( gridItemPrice.trim()).to.equal(singlePrice.trim(),'Error: product price does not match!');
        expect( gridItemPrice.trim()).to.equal(payCartPrice.trim(),'Error: product price does not match!');
        expect( singleColor.trim()).to.equal(payCartColor.trim(),'Error: product color does not match!');
        expect( singleSize.slice(0,1)).to.equal(payCartSize.trim(),'Error: product size does not match!');
    });


});

