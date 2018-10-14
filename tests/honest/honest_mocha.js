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
const honestXpath = require('./honest_xpath');
var driver;
let browserToTest = process.argv[4];
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const screenSize = {
    width: 1280,
    height: 920
};

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
                //driver = await new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities({'browserName':''}).build();
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

        if (browserToTest === 'edge'){
            await driver.manage().window().maximize();
        } else {
            await driver.manage().window().setRect( {width: 1280, height: 920});
        };
    } );

    after(async () => {
        await driver.quit();

    });

    // it('all img URLs are valid links, returns server code 200', async () => {
    //     let imageArr = await driver.findElements({'css': 'img'});
    //     let linkArr = await driver.findElements({'css' : 'a'});
    //     console.log(`number of <a> tags: ${await linkArr.length}`);
    //     for (let i = 0; i < imageArr.length; i++) {
    //         //console.log( await imageArr[i].getAttribute('src'));
    //         let imgUrl = await imageArr[i].getAttribute('src');
    //         expect(imgUrl).to.exist;
    //         expect(imgUrl).to.be.a("string");
    //         fetch(imgUrl)
    //             .then(
    //                 (response) => {
    //                     if (response.status === 200) {
    //                         console.log(`${i})image link to ${imgUrl} is valid`);
    //                         return;
    //                     }
    //                 }
    //             )
    //             .catch(
    //                 (err) => console.log('the image link has error: ', err)
    //             );
    //     }
    // });

    it(`testing webpage title: ${honestXpath.text.mainPageTitle}`, async () => {
        const websiteTitle = await driver.getTitle();
        expect(websiteTitle).to.equal(honestXpath.text.mainPageTitle, 'Error: main webpage title does not match')

    })

    it('close splash ad', async() => {
        await driver.sleep(3000);

        try {
            let splash1 = await driver.findElement( { 'xpath' : honestXpath.close_splash_ad1} ).isDisplayed();
            if (splash1) {
                console.log("splash1 appeared!");
                await driver.findElement({'xpath': honestXpath.close_splash_ad1}).click();
            }
        }
        catch(err){

            try {
                console.log("splash2 appeared!");
                await driver.findElement({'xpath': honestXpath.close_splash_ad2}).click();
            }catch(err){
                console.log("No splash ad!");
            }
        }
    });

    it('add diapers to cart', async () => {
        await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
        await driver.sleep(1000);
        await driver.findElement( { 'xpath' : honestXpath.topNavDiapering } ).click();
    });

    // it('all img URLs are valid links, returns server code 200', async () => {
    //         let imageArr = await driver.findElements({'css': 'img'});
    //         let linkArr = await driver.findElements({'css' : 'a'});
    //         console.log(`number of <img> tags: ${await imageArr.length}`);
    //         console.log(`number of <a> tags: ${await linkArr.length}`);
    //         await driver.executeScript( "window.scrollTo(0,3000);" );
    //         await driver.executeScript( "window.scrollTo(0,-3000);" );
    //         for (let i = 0; i < imageArr.length; i++) {
    //             //console.log( await imageArr[i].getAttribute('src'));
    //             let imgUrl;
    //             try {
    //                 imgUrl = await imageArr[i].getAttribute('src');
    //             }
    //             catch(err){
    //                 console.log("something wrong with this imgUrl #", i);
    //                 continue;
    //             }
    //
    //             if (imgUrl == null){
    //                 console.log(`this imgUrl #${i} is null!`);
    //                 continue;
    //             }
    //
    //             // try {
    //             //     expect(imgUrl).to.exist;
    //             // }
    //             // catch(err) {
    //             //     console.log(`this imgUrl: does not exist`);
    //             //     continue;
    //             // }
    //             expect(imgUrl).to.be.a("string");//.catch(() => console.log(`this imgUrl: ${imgUrl} is not a string`));
    //             console.log(`${i}) `,imgUrl);
    //             fetch(imgUrl)
    //                 .then(
    //                     (response) => {
    //                         if (response.status === 200) {
    //                             console.log(`${i})image link to ${imgUrl} is valid`);
    //                             return;
    //                         }
    //                     }
    //                 )
    //                 .catch(
    //                     (err) => console.log('the image link has error: ', err)
    //                 );
    //         }
    //     });

    it('add feeding to cart', async () => {
        await driver.sleep(1000);
        await driver.findElement( { 'xpath' : honestXpath.topNavFeeding } ).click();
        await driver.sleep(1000);
        await driver.executeScript( "window.scrollTo(0,300);" );
        await driver.findElement( { 'xpath' : honestXpath.premiumInfantFormula.xpath}).click().catch( ()=> console.log('did not find premium baby formula') );
        await driver.sleep(1000);
        let singleItemTitle = await driver.findElement( { 'xpath' : honestXpath.singlePremiumInfantFormula}).getText();
        console.log(`the item title is: ${singleItemTitle}`);
        let itemDropDown = await driver.findElement( { 'xpath' : honestXpath.singlePremiumInfantFormulaSizeDropDown} );
        const actions = driver.actions({bridge:true});
        await actions.click(itemDropDown).sendKeys( webdriver.Key.ARROW_DOWN ).perform();
        await driver.sleep(1000);//needed for firefox
        await actions.sendKeys(webdriver.Key.ENTER).perform();
        // await actions.move({duration:1500,origin:itemDropDown,x:20,y:-100}).click().perform();
        let itemPrice = await driver.findElement( {'xpath' : honestXpath.singlePremiumInfantFormulaPrice} ).getText();
        itemPrice = "$" + itemPrice;
        await driver.findElement( {'xpath' : honestXpath.singlePremiumInfantFormulaBuyNow} ).click();
        console.log(`the price is ${itemPrice}`);
        await driver.findElement( {'xpath' : honestXpath.singlePremiumInfantFormulaCart} ).click();

        await driver.wait(until.elementLocated( { 'xpath' : honestXpath.cart1stItemName } ) );
        let cartItemName = await driver.findElement( {'xpath' : honestXpath.cart1stItemName}).getText();
        let cartItemPrice = await driver.findElement( {'xpath' : honestXpath.cart1stItemPrice}).getText();
        console.log(`The item name ${cartItemName} is ${cartItemPrice}`);

        expect(singleItemTitle).to.equal(honestXpath.premiumInfantFormula.name,'Error: product name does not match!');
        expect(singleItemTitle).to.equal(cartItemName,'Error: product name does not match in the cart!');
        expect(itemPrice).to.equal(cartItemPrice,'Error: product price does not match in the cart!');
    });

    it('empty cart', async () => {
        await driver.findElement( {'xpath': honestXpath.cartEmptyItems} ).click();
        let emptyCartMsg = await driver.findElement( { 'xpath': honestXpath.cartEmptyMessage } ).getText();
        let emptyCartPrice = await driver.findElement( { 'xpath': honestXpath.cartEmptySubtotal } ).getText();
        console.log(`The cart is saying ${emptyCartMsg} with a subtotal of ${emptyCartPrice}`);
        expect(emptyCartMsg).to.equal(honestXpath.text.emptyCartMsg,'Error: empty cart message does not match!');
        expect(emptyCartPrice).to.equal(honestXpath.text.emptyCartTotal,'Error: empty cart message does not match!');
    });

    it('back to main page', async () => {
        let currentTitle = await driver.findElement( {'xpath': honestXpath.cartPageTitle} ).getText();
        await driver.findElement( {'xpath': honestXpath.topLeftMainLogo} ).click();
        await driver.wait(until.elementLocated( { 'xpath' : honestXpath.topNavFeeding }) );
        let topNavFeeding = await driver.findElement( {'xpath': honestXpath.topNavFeeding } );
        console.log(`Did we go back to the main page? ${await topNavFeeding.isDisplayed()}`);
        expect(await topNavFeeding.isDisplayed(),'Error: Did not get back to main page').to.be.true;
    });


    // it('add personal care to cart', async () => {
    //     await driver.sleep(1000);
    //     await driver.findElement( { 'xpath' : honestXpath.topNavPersonalCare } ).click();
    // });

//     it(`login to Honest Co. as ${credentials.loginName}`, async () => {
//         await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));//for ie
//         await driver.sleep(1000);
//         await driver.wait(until.elementLocated( { 'xpath' : honestXpath.signIn } ) );//for ie
//         let sign_in = await driver.findElement( { 'xpath' : honestXpath.signIn } );
//         console.log('found signin element!');
//         const actions = driver.actions({bridge:true});
//         await actions.move({duration:1500,origin:sign_in,x:0,y:0}).perform();
//         console.log('moving mouse');
//         await sign_in.click();
//
//         //let loginFrame = await driver.findElement(By.id('login-iframe'));
//         //await driver.switchTo().frame(loginFrame).catch( ()=> console.log('did not switch to active element') );
//         await driver.sleep( 1500 );
//         await driver.findElement( { 'id' : 'user_email' } ).sendKeys( credentials.username).catch( () => console.log('could not find element security_loginname'));
//         if (browserToTest==='edge'){
//             await driver.sleep(1500);
//         };
//         await driver.findElement( { 'id' : 'user_password'  } ).sendKeys( credentials.password).catch( () => console.log('could not find element security_password'));
//         await driver.executeScript( "window.scrollTo(0,300);" );
//         var numIframes = await driver.findElements(By.css("iframe"));
//         console.log('number of iframes: ${numIframes.length}', numIframes.length);
//         //await driver.switchTo().frame(driver.findElement(By.css("iframe")));
//         for (let i=0;i<numIframes.length;i++){
//             await driver.sleep(1500);
//             if (i===1){i++};
//             console.log("frame: ", i);
//             await driver.switchTo().frame(i);
//             await driver.findElement( { 'xpath': honestXpath.captcha}).click().catch( () => console.log("didn't find captcha!") );
//         }
//         //await driver.switchTo().frame(6);//0,1,2,3,4,5
//         //await driver.findElement( { 'xpath': honestXpath.captcha}).click().catch( () => console.log("didn't find captcha!") );
//         await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
//         await driver.findElement( { 'xpath' : honestXpath.submitSignInButton  } ).click().catch( () => console.log("did't find submit button!", i) );
//
//
//
//     })
});

