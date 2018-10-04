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
const credentials = require('../../credentials.js');
const xomeXpath = require('./xome_xpath');
var driver;
let browserToTest = process.argv[4];

describe( 'Xome smoke test', () => {
    before(async () => {
        //this.timeout(2000);
        switch(browserToTest) {
            case '--edge':
                driver = await new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.edge()).build();
                browserToTest = 'edge';
                break;
            case '--firefox':
                driver = await new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.firefox()).build();
                browserToTest = 'firefox';
                break;
            case '--ie':
                driver = await new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.ie()).build();
                //driver = await new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities({'browserName':''}).build();
                browserToTest = 'ie';
                break;
            default:
                driver = await new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.chrome()).build();
                browserToTest = 'chrome';
        }
        console.log(`Testing browser: ${browserToTest}`);
        await driver.get('https://www.xome.com');

        if (browserToTest === 'edge'){
            await driver.manage().window().maximize();
        } else {
            await driver.manage().window().setRect( {width: 1280, height: 920});
        };
    } );

    after(async () => {
        await driver.quit();

    });

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

    it(`testing webpage title: ${xomeXpath.text.mainPageTitle}`, async () => {
        const websiteTitle = await driver.getTitle();
        expect(websiteTitle).to.equal(xomeXpath.text.mainPageTitle, 'Error: main webpage title does not match')

    })

    it(`login to Xome as ${credentials.loginName}`, async () => {
        await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));//for ie
        await driver.wait(until.elementLocated( { 'xpath' : xomeXpath.signIn } ) );//for ie
        await driver.findElement( { 'xpath' : xomeXpath.signIn } ).click();

        let loginFrame = await driver.findElement(By.id('login-iframe'));
        await driver.switchTo().frame(loginFrame).catch( ()=> console.log('did not switch to active element') );
        await driver.sleep( 1500 );
        await driver.findElement( { 'id' : 'security_loginname' } ).sendKeys( credentials.username).catch( () => console.log('could not find element security_loginname'));
        if (browserToTest==='edge'){
            await driver.sleep(1500);
        };
        await driver.findElement( { 'id' : 'security_password'  } ).sendKeys( credentials.password).catch( () => console.log('could not find element security_password'));
        await driver.findElement( { 'id' : 'submit-button'      } ).click();
        await driver.sleep( 1500 );
    })

    it('verify the login name is correct', async () => {
        await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));//need this for firefox
        await driver.wait(until.elementLocated( { 'xpath' : xomeXpath.loginName } ) );
        let loginName = await driver.findElement({ 'xpath': xomeXpath.loginName }).getText();
        expect(loginName.toUpperCase()).to.equal(credentials.loginName, 'Error: login name does not match');
    })

    it(`search homes in ${credentials.city}`, async () => {
        await driver.findElement( { 'id' : 'homepage-search-field' } ).clear();
        await driver.findElement( { 'id' : 'homepage-search-field' } ).sendKeys(credentials.city);
        await driver.findElement( { 'className' : 'search-field-button'   } ).click();
        await driver.sleep( 1000 );
        ////*[@id="location-criteria-list"]/ul/li/a
        if( browserToTest==='edge' ){
            await driver.wait(until.elementLocated( { 'xpath' : xomeXpath.cityName } ) );
        };
        let cityName = await driver.findElement( { 'xpath': xomeXpath.cityName }).getText();
        expect(cityName).to.equal(credentials.cityName, 'Error: city name does not match');

    })

    it(`verify the number of properties on the page`, async () => {
        await driver.wait(until.elementLocated( { 'xpath' : xomeXpath.firstPropImg } ) );
        let properties = await driver.findElements( { 'xpath' : xomeXpath.firstPropImg } );
        console.log(`Number of properties on the page: ${properties.length}`);
        expect(properties.length).to.equal(24, 'Error: number of properties on the page is not 24');
    })

    it(`click through the pictures on each of the properties`, async () => {
        let properties = await driver.findElements( { 'xpath' : xomeXpath.firstPropImg } );

        if( browserToTest !== 'firefox' ) {
            for (let pInPage = 1; pInPage <= properties.length; pInPage++) {
                await driver.sleep(1500);
                await driver.findElement({'xpath': `//*[@id="mapsearch-results-body"]/div[${pInPage}]`}).catch(() => console.log(`can not find the ${pInPage}th property!`));//click on the first property listed
                await driver.findElement({'xpath': `//*[@id="mapsearch-results-body"]/div[${pInPage}]`}).click();//click on the property listed
                await driver.wait(until.elementLocated({'xpath': xomeXpath.picTotal }));//make sure this is correct
                await driver.sleep(1000);
                let picTotal = await driver.findElement({'xpath': xomeXpath.picTotal }).getText();//number of property pictures
                if (picTotal === ''){
                    picTotal = 'no'; //in case of no pictures shown
                };
                let streetAddr  = await driver.findElement({'xpath': xomeXpath.streetAddr  }).getText();//street address
                let cityAddr    = await driver.findElement({'xpath': xomeXpath.cityAddr    }).getText();//city address
                let askingPrice = await driver.findElement({'xpath': xomeXpath.askingPrice }).getText();//property asking price
                expect(cityAddr).to.equal(xomeXpath.text.cityText, `Error: City name does not match ${xomeXpath.cityText}`);
                console.log(`The property at ${streetAddr} ${cityAddr} has asking price of ${askingPrice} with ${picTotal} property pictures`);
                if (picTotal > 1) {
                    for (let i = 0; i < picTotal; i++) {
                        if (browserToTest==='edge'){
                            await driver.sleep(1500);
                        };
                        await driver.findElement({'xpath': xomeXpath.nextPic }).click().catch(() => console.log('nope, could not find next pic >'));
                        if (i > 3) {
                            i = picTotal;//So we don't click through all of the pictures, because there could be a lot of pictures!
                        }
                    }
                };
                await driver.findElement({'xpath': xomeXpath.closeModal }).click();//close modal
                if (pInPage > 5) {
                    pInPage = properties.length;//so we don't click through all of the properties
                }
            }
        }
    })

    if (browserToTest !== '--edge') { //edge bug where can not click on logout because out of viewable screen
        it('logout of Xome', async () => {
            await driver.switchTo().defaultContent().catch(() => console.log('can not find defaultContent window'));//for Edge
            await driver.wait(until.elementLocated({'xpath': xomeXpath.menuDropDown}));//menu dropdown
            await driver.findElement({'id': xomeXpath.navMenuButton}).click();
            await driver.sleep(1500);
            await driver.findElement({'xpath': xomeXpath.userLogout}).click();//logout; edge can not see the userLogout
        })
    }
});

