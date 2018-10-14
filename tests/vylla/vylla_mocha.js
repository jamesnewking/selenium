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
const credentials = require('../../vylla_cred');
const vyllaXpath = require('./vylla_xpath');
var driver;
let browserToTest = process.argv[4];
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const screenSize = {
    width: 1280,
    height: 920
};

describe( 'Vylla smoke test', () => {
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
        await driver.get( vyllaXpath.url );

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

    it(`testing webpage title: ${vyllaXpath.text.mainPageTitle}`, async () => {
        const websiteTitle = await driver.getTitle();
        expect(websiteTitle).to.equal(vyllaXpath.text.mainPageTitle, 'Error: main webpage title does not match')

    })

    it('all img URLs are valid links, returns server code 200', async () => {
            let imageArr = await driver.findElements({'css': 'img'});
            let linkArr = await driver.findElements({'css' : 'a'});
            console.log(`number of <img> tags: ${await imageArr.length}`);
            console.log(`number of <a> tags: ${await linkArr.length}`);
            await driver.executeScript( "window.scrollTo(0,3000);" );
            await driver.executeScript( "window.scrollTo(0,-3000);" );
            for (let i = 0; i < imageArr.length; i++) {
                console.log( await imageArr[i].getAttribute('src'));
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


    it(`login to Vylla as ${credentials.loginName}`, async () => {
        //await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));//for ie
        //await driver.sleep(1000);
        let sign_in = await driver.findElement( vyllaXpath.signIn  );
        console.log('found signin element!');
        // const actions = driver.actions({bridge:true});
        // await actions.move({duration:1500,origin:sign_in,x:0,y:0}).perform();
        // console.log('moving mouse');
        await sign_in.click();

        //let loginFrame = await driver.findElement(By.id('login-iframe'));
        //await driver.switchTo().frame(loginFrame).catch( ()=> console.log('did not switch to active element') );
        await driver.wait(until.elementLocated( vyllaXpath.signInButton ));

        await driver.findElement( vyllaXpath.input_email ).sendKeys( credentials.username).catch( () => console.log('could not find element security_loginname'));
        if (browserToTest==='edge'){
            await driver.sleep(1500);
        };
        await driver.findElement( vyllaXpath.input_password ).sendKeys( credentials.password).catch( () => console.log('could not find element security_password'));
        // await driver.executeScript( "window.scrollTo(0,300);" );
        // var numIframes = await driver.findElements(By.css("iframe"));
        // console.log('number of iframes: ${numIframes.length}', numIframes.length);
        // //await driver.switchTo().frame(driver.findElement(By.css("iframe")));
        // for (let i=0;i<numIframes.length;i++){
        //     await driver.sleep(1500);
        //     if (i===1){i++};
        //     console.log("frame: ", i);
        //     await driver.switchTo().frame(i);
        //     await driver.findElement( { 'xpath': honestXpath.captcha}).click().catch( () => console.log("didn't find captcha!") );
        // }
        // //await driver.switchTo().frame(6);//0,1,2,3,4,5
        // //await driver.findElement( { 'xpath': honestXpath.captcha}).click().catch( () => console.log("didn't find captcha!") );
        // await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
        await driver.findElement( vyllaXpath.signInButton ).click().catch( () => console.log("did't find submit button!", i) );
        await driver.wait(until.elementLocated( vyllaXpath.myVyllaTitleXpath ));
        //await driver.sleep(2500);
        //debug
        //await driver.manage().timeouts().pageLoadTimeout(10, TimeUnit.SECONDS);
        //await driver.manage().timeouts().pageLoadTimeout(3000);
        let myVyllaTitle = await driver.findElement( vyllaXpath.myVyllaTitleXpath ).getText();
        let logInUserName = await driver.findElement( vyllaXpath.signedInUser ).getText();
        expect(myVyllaTitle).to.equal( vyllaXpath.myVyllaTitleName, 'error: myVylla title did not match' );
        expect(logInUserName).to.equal( credentials.loginName, 'error: user login name did not match');

    })

    it(`search for homes in ${credentials.city}`, async () => {
        await driver.sleep(5000);
        //await driver.wait(until.elementLocated( vyllaXpath.myVyllaTitleXpath ));
        await driver.findElement( vyllaXpath.myVyllaNavHomes).click();
        //await driver.wait(until.elementLocated( vyllaXpath.input_city) );
        await driver.findElement( vyllaXpath.input_city ).sendKeys(credentials.city);
        const actions = driver.actions({bridge:true});
        await actions.sendKeys(webdriver.Key.ENTER).perform();
        await driver.wait(until.elementLocated( vyllaXpath.display_cityName));
        await driver.sleep(2500);
        let displayedCityName = await driver.findElement( vyllaXpath.display_cityName ).getText();
        let propertiesFound = await driver.findElement( vyllaXpath.display_propertiesFound).getText();
        displayedCityName = displayedCityName.slice(3);//to remove 'in '
        console.log(`found ${propertiesFound} properties in ${displayedCityName}`);
        expect(displayedCityName).to.equal(credentials.city);
    })

    it(`click on first property`, async () => {
        await driver.sleep(2500);
        let firstPropertyAddr = await driver.findElement( vyllaXpath.resultsFirstPropertyAddr).getText();
        let firstPropertyPrice = await driver.findElement( vyllaXpath.resultsFirstPropertyPrice).getText();
        console.log(`the property at ${firstPropertyAddr} is asking ${firstPropertyPrice}`);
        await driver.findElement( vyllaXpath.resultsFirstProperty ).click();
        await driver.sleep(2500);
        //console.log(`The property on ${firstPropertyAddr} is asking ${firstPropertyPrice}`);
        let individualAddr = await driver.findElement( vyllaXpath.resultsIndividualAddr).getText();
        let individualPrice = await driver.findElement( vyllaXpath.resultsIndividualPrice).getText();
        console.log(`property addr is: ${individualAddr}`);
        let streetIndex = individualAddr.indexOf(",");
        individualAddr = individualAddr.slice(0, streetIndex);
        console.log(`Individual property on ${individualAddr} is asking ${individualPrice}`);
        await driver.sleep(1000);
        let hasPictures = true;
        let numOfPictures = await driver.findElement( vyllaXpath.resultsNumOfPictures ).getText().catch( () => {
            hasPictures = false;
            console.log('no pictures for this property');} );
        if (hasPictures) {
            let pictureIndex = numOfPictures.indexOf('OF');
            numOfPictures = parseInt(numOfPictures.slice(pictureIndex + 3));
            console.log(`number of pictures is:${numOfPictures}`);
            for (let i = 0; i < numOfPictures; i++) {
                await driver.sleep(500);
                await driver.findElement(vyllaXpath.resultsNextPicture).click();
            }
        };
        expect(firstPropertyAddr).to.equal(individualAddr);
        expect(firstPropertyPrice).to.equal(individualPrice);
    });

    it(`logout ${credentials.loginName}`, async () => {
        await driver.findElement( vyllaXpath.signedInUser).click();
        await driver.findElement( vyllaXpath.signOutLink).click();
        let signedOutName = await driver.findElement( vyllaXpath.signedInUser).getText();
        expect(signedOutName.toUpperCase()).to.equal(vyllaXpath.signedOutUserText.toUpperCase());
    })
});

