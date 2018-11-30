const fetch = require('node-fetch');
const webdriver = require('selenium-webdriver'),
    until = webdriver.until;
const { expect } = require('chai');
var driver, testingBrowser;
let browserToTest = process.argv[4];
let checkPix = process.argv[5];
let viewPort = process.argv[6];
let emulate = process.argv[7];
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const screenSize = {
    width: 1280,
    height: 920
};
const amazonPath = require('./amazon_pom_path');
const title = require("./pom_title");
const shopitem = require("./pom_shopitem");
const viewPortSizes = require("./pom_viewport");
const emulatePhones = require("./pom_emulate");
const sPayCart = require("./pom_subcart");
const PayCart = require("./pom_paycart");
const checkPicture = require("./pom_checkpix");
let startTime, endTime, setViewPort;


describe( 'Amazon smoke test', () => {
    before(async () => {
        if (browserToTest=== undefined){
            browserToTest = '--chrome';
        }
        browserToTest = browserToTest.slice(2);
        let options = new chrome.Options();
        options.setUserPreferences({'profile.default_content_setting_values.notifications': 2});
        if (emulate){
            emulate = emulate.slice(2);
            if(browserToTest === 'chrome' || browserToTest === 'headlesschrome'){
                console.log(`emulating: ${emulatePhones[emulate]}`);
            };
            options.setMobileEmulation({deviceName: `${emulatePhones[emulate]}`  });//mobile emulation
        };
            
        switch(browserToTest) {
            case 'safari':
                driver = await new webdriver.Builder()
                .usingServer('http://localhost:4444/wd/hub')
                .withCapabilities(webdriver.Capabilities.safari())
                .build();
                break;
            case 'edge':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.edge())
                    .build();
                break;
            case 'firefox':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.firefox())
                    .setFirefoxOptions(new firefox.Options().setPreference("dom.webnotifications.enabled", false))
                    .build();
                break;
            case 'headlessfirefox':
                driver = await new webdriver
                    .Builder().usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.firefox())
                    .setFirefoxOptions(new firefox.Options().headless().windowSize(screenSize))
                    .build();
                break;
            case 'ie':
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.ie())
                    .build();
                break;
            case 'headlesschrome':
                options.headless().windowSize(screenSize);
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.chrome())
                    .setChromeOptions(options)
                    .build();
                break;
            case 'chrome':
            default:
                browserToTest = 'chrome';
                driver = await new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.chrome())
                    .setChromeOptions(options)
                    .build(); 
        }
        startTime = new Date();
        console.log(`Starting test at ${startTime}`);
        let testCapa = await driver.getCapabilities();
        testingBrowser = await testCapa.getBrowserName();
        console.log(`Testing browser: ${testingBrowser}`);
        //____________________________________________//
        await driver.get('https://amazon.com/');
        await driver.manage().setTimeouts({implicit:1000});//debug
        
        // if (browserToTest === 'edge'){
        //     //await driver.manage().window().maximize();
        //     console.log('why maximize?');
        // } else {
        if (viewPort){
            viewPort = viewPort.slice(2);
            setViewPort = viewPortSizes[viewPort];
        } else {
            setViewPort = viewPortSizes['hd'];
            viewPort = 'hd'
        };
        console.log(`viewport: ${viewPort}`);
        await driver.manage().window().setRect( setViewPort );
        //bug: edge not resizing window
        // };
    } );

    it(`(1) testing webpage title`, async () => {
        let webTitle = new title(driver);
        expect(webTitle.expectedTitleName).to.equal(await webTitle.actualWebTitle(), 'Error: main webpage title does not match')
    })

    it('(2) all img URLs are valid links, returns server code 200', async () => {
        if(checkPix==='--checkpix') {
            let checkingPictureLink = new checkPicture(driver, webdriver, fetch);
            let hasBadPictureLink = await checkingPictureLink.checkForValidLink();
            expect( hasBadPictureLink ).to.equal( false ,'There is at lease one img with a bad link');
        } else {
            console.log('--Checkpix did not run.');
        }
        });



    it('(3) search for pillows', async () => {
        
        await driver.findElement( amazonPath.searchBar ).sendKeys('pillow').catch( async () => {
            await driver.findElement( amazonPath.searchBarMobile ).sendKeys('pillow');
        }); 
        await driver.findElement( amazonPath.searchButton).click().catch( async () => {
            await driver.findElement( amazonPath.searchButtonMobile ).click()
        });
        await driver.sleep(3000);
    });

    it('(4) verify names/prices of items for purchase', async () => {
        let checkShopItem = new shopitem(driver, webdriver, testingBrowser);
        let numberItemsScreen = await checkShopItem.iterateGridItems();//debug
        expect( numberItemsScreen ).to.equal( 33 ,'Error: number of products does not match!');
    });

    it('(5) add item to cart, verify product in cart', async () => {
        let singleItem = {};
        let gridItem = {};
        let smallPayCart;
        
        let shopItem = new shopitem(driver, webdriver, testingBrowser, 4);
        //shopItem.scrollDownUpPage();
        gridItem = await shopItem.addOneItem();
        gridItem.price = `$${gridItem.priceDollars}.${gridItem.priceCents}`;
        singleItem = await shopItem.addSingleItemToCart();
        let subPayCart = new sPayCart(driver,webdriver);
        smallPayCart = await subPayCart.getSubCartInfo();
        let finalPayCart = new PayCart(driver, webdriver);
        let checkOutCart = await finalPayCart.getFinalCartInfo();
        
        console.log(`----`);
        console.log(`--From the grid,  the item: ${ gridItem.title }, price: $${ gridItem.priceDollars }.${ gridItem.priceCents }`);
        console.log(`--From single item   title: ${ singleItem.title}, our price: ${singleItem.ourPrice}, buy box price: ${singleItem.buyBoxPrice}`);
        console.log(`--From sub paycart   price: ${ smallPayCart.price}`);
        console.log(`--From final paycart title: ${ checkOutCart.title}, price: ${ checkOutCart.price}`);
        console.log(`----`);
        
        expect( gridItem.title.trim() ).to.equal( singleItem.title.trim()  ,'Error: product name does not match!');
        expect( gridItem.title.trim() ).to.equal( checkOutCart.title.trim() ,'Error: product name does not match!');
        expect( singleItem.ourPrice.trim() ).to.equal( singleItem.buyBoxPrice.trim()  ,'Error: product price does not match!');
        expect( gridItem.price.trim() ).to.equal( singleItem.ourPrice.trim()  ,'Error: product price does not match!');
        expect( gridItem.price.trim() ).to.equal( checkOutCart.price.trim() ,'Error: product price does not match!');
    });


});

