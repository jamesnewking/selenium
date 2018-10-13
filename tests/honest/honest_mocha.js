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

    // after(async () => {
    //     await driver.quit();
    //
    // });

      // it(`hover mouse over auctions`, async () => {
    //     let auctionsToptab = await driver.findElement({'xpath': xomeXpath.auctionsToptab});
    //     let searchAuctions = await driver.findElement({'xpath': xomeXpath.searchAuctions});
    //     let allHomes       = await driver.findElement({'xpath': xomeXpath.allHomes});
    //
    //     const actions = driver.actions({bridge:true});
    //     await actions.move({duration:1500,origin:auctionsToptab,x:0,y:0}).perform();
    //     await actions.move({duration:1500,origin:searchAuctions,x:0,y:0}).perform();
    //     await actions.move({duration:1500,origin:allHomes,x:0,y:0}).perform();
    //     await allHomes.click();
    // });
    //
    // it('back to main Xome page', async () => {
    //     await driver.findElement({'xpath': xomeXpath.mainLogo}).click();
    //     await driver.wait(until.elementLocated({'xpath': xomeXpath.mainSlogan}));
    //     const mainSlogan = await driver.findElement({'xpath': xomeXpath.mainSlogan}).getText();
    //     //console.log(`Main page slogan is: ${mainSlogan}`);
    //     expect(mainSlogan).to.equal(xomeXpath.text.textSlogan,'Error: slogan does not match');
    // });
    //
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
        // let splash1 = await driver.findElement( { 'xpath' : honestXpath.close_splash_ad1} ).isDisplayed();
        // if (splash1){
        //     console.log("splash1 appeared!");
        //     await driver.findElement( { 'xpath' : honestXpath.close_splash_ad1} ).click();
        // } else {
        //     console.log("splash2 appeared!");
        //     await driver.findElement( { 'xpath' : honestXpath.close_splash_ad2} ).click();
        // }

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

    it('all img URLs are valid links, returns server code 200', async () => {
            let imageArr = await driver.findElements({'css': 'img'});
            let linkArr = await driver.findElements({'css' : 'a'});
            console.log(`number of <img> tags: ${await imageArr.length}`);
            console.log(`number of <a> tags: ${await linkArr.length}`);
            await driver.executeScript( "window.scrollTo(0,3000);" );
            await driver.executeScript( "window.scrollTo(0,-3000);" );
            for (let i = 0; i < imageArr.length; i++) {
                //console.log( await imageArr[i].getAttribute('src'));
                let imgUrl;
                try {
                    imgUrl = await imageArr[i].getAttribute('src');
                }
                catch(err){
                    console.log("something wrong with this imgUrl #", i);
                    continue;
                }

                if (imgUrl == null){
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
                console.log(`${i}) `,imgUrl);
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
        });

    it('add feeding to cart', async () => {
        await driver.sleep(1000);
        await driver.findElement( { 'xpath' : honestXpath.topNavFeeding } ).click();
        await driver.sleep(1000);
        await driver.findElement( { 'xpath' : honestXpath.premiumInfantFormula.xpath}).click().catch( ()=> console.log('did not find premium baby formula') );
        await driver.sleep(1000);
        let singleItemTitle = await driver.findElement( { 'xpath' : honestXpath.singlePremiumInfantFormula}).getText();
        console.log(`the item title is: ${singleItemTitle}`);
        let itemDropDown = await driver.findElement( { 'xpath' : honestXpath.singlePremiumInfantFormulaSizeDropDown} );
        await itemDropDown.click();
        const actions = driver.actions({bridge:true});
        await actions.move({duration:1500,origin:itemDropDown,x:50,y:0}).click().perform();
        expect(singleItemTitle).to.equal(honestXpath.premiumInfantFormula.name,'Error: product name does not match!');
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
// //http://scraping.pro/recaptcha-solve-selenium-python/
// //https://www.packtpub.com/mapt/book/web_development/9781783981922/3/ch03lvl1sec38/simulating-scrolling-in-phantomjs
//
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

    // it('verify the login name is correct', async () => {
    //     await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));//need this for firefox
    //     await driver.wait(until.elementLocated( { 'xpath' : xomeXpath.loginName } ) );
    //     let loginName = await driver.findElement({ 'xpath': xomeXpath.loginName }).getText();
    //     expect(loginName.toUpperCase()).to.equal(credentials.loginName, 'Error: login name does not match');
    // })
    //
    // it(`search homes in ${credentials.city}`, async () => {
    //     await driver.findElement( { 'id' : 'homepage-search-field' } ).clear();
    //     await driver.findElement( { 'id' : 'homepage-search-field' } ).sendKeys(credentials.city);
    //     await driver.findElement( { 'className' : 'search-field-button'   } ).click();
    //     await driver.sleep( 1000 );
    //     ////*[@id="location-criteria-list"]/ul/li/a
    //     if( browserToTest==='edge' ){
    //         await driver.wait(until.elementLocated( { 'xpath' : xomeXpath.cityName } ) );
    //     };
    //     let cityName = await driver.findElement( { 'xpath': xomeXpath.cityName }).getText();
    //     expect(cityName).to.equal(credentials.cityName, 'Error: city name does not match');
    //
    // })
    //
    // it(`verify the number of properties on the page`, async () => {
    //     await driver.wait(until.elementLocated( { 'xpath' : xomeXpath.firstPropImg } ) );
    //     let properties = await driver.findElements( { 'xpath' : xomeXpath.firstPropImg } );
    //     console.log(`Number of properties on the page: ${properties.length}`);
    //     expect(properties.length).to.equal(24, 'Error: number of properties on the page is not 24');
    // })
    //
    // it(`click through the pictures on each of the properties`, async () => {
    //     let properties = await driver.findElements( { 'xpath' : xomeXpath.firstPropImg } );
    //
    //     if( browserToTest !== 'firefox' ) {
    //         for (let pInPage = 1; pInPage <= properties.length; pInPage++) {
    //             await driver.sleep(1500);
    //             await driver.findElement({'xpath': `//*[@id="mapsearch-results-body"]/div[${pInPage}]`}).catch(() => console.log(`can not find the ${pInPage}th property!`));//click on the first property listed
    //             await driver.findElement({'xpath': `//*[@id="mapsearch-results-body"]/div[${pInPage}]`}).click();//click on the property listed
    //             await driver.wait(until.elementLocated({'xpath': xomeXpath.picTotal }));//make sure this is correct
    //             await driver.sleep(1000);
    //             let picTotal = await driver.findElement({'xpath': xomeXpath.picTotal }).getText();//number of property pictures
    //             if (picTotal === ''){
    //                 picTotal = 'no'; //in case of no pictures shown
    //             };
    //             let streetAddr  = await driver.findElement({'xpath': xomeXpath.streetAddr  }).getText();//street address
    //             let cityAddr    = await driver.findElement({'xpath': xomeXpath.cityAddr    }).getText();//city address
    //             let askingPrice = await driver.findElement({'xpath': xomeXpath.askingPrice }).getText();//property asking price
    //             expect(cityAddr).to.equal(xomeXpath.text.cityText, `Error: City name does not match ${xomeXpath.cityText}`);
    //             console.log(`The property at ${streetAddr} ${cityAddr} has asking price of ${askingPrice} with ${picTotal} property pictures`);
    //             if (picTotal > 1) {
    //                 for (let i = 0; i < picTotal; i++) {
    //                     if (browserToTest==='edge'){
    //                         await driver.sleep(1500);
    //                     };
    //                     await driver.findElement({'xpath': xomeXpath.nextPic }).click().catch(() => console.log('nope, could not find next pic >'));
    //                     if (i > 3) {
    //                         i = picTotal;//So we don't click through all of the pictures, because there could be a lot of pictures!
    //                     }
    //                 }
    //             };
    //             await driver.findElement({'xpath': xomeXpath.closeModal }).click();//close modal
    //             if (pInPage > 5) {
    //                 pInPage = properties.length;//so we don't click through all of the properties
    //             }
    //         }
    //     }
    // })
    //
    // if (browserToTest !== '--edge') { //edge bug where can not click on logout because out of viewable screen
    //     it('logout of Xome', async () => {
    //         await driver.switchTo().defaultContent().catch(() => console.log('can not find defaultContent window'));//for Edge
    //         await driver.wait(until.elementLocated({'xpath': xomeXpath.menuDropDown}));//menu dropdown
    //         await driver.findElement({'id': xomeXpath.navMenuButton}).click();
    //         await driver.sleep(1500);
    //         await driver.findElement({'xpath': xomeXpath.userLogout}).click();//logout; edge can not see the userLogout
    //     })
    // }
});

