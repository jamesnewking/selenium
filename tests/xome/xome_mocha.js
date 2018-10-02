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
var credentials = require('../../credentials.js');

var driver;

describe( 'Xome smoke test', () => {
    before(async () => {
        //this.timeout(2000);
        driver =await new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.chrome()).build();
        await driver.get('https://www.xome.com');
        //await driver.manage().window().maximize();
        await driver.manage().window().setRect( {width: 1280, height: 920});
    } );

    after(async () => {
        await driver.quit();

    });

    it('check for expected web page title',async () => {
        let pageTitle = await driver.getTitle();
        expect(pageTitle).to.equal('Xome Retail | Real Estate & Homes For Sale' , 'Error: Title is not Xome!');
    });


    it('check for all img URLs', async () => {
        let imageArr = await driver.findElements({'css': 'img'});
        let linkArr = await driver.findElements({'css' : 'a'});
        console.log(`number of <a> tags: ${await linkArr.length}`);
        for (let i = 0; i < imageArr.length; i++) {
            //console.log( await imageArr[i].getAttribute('src'));
            let imgUrl = await imageArr[i].getAttribute('src');
            expect(imgUrl).to.exist;
            expect(imgUrl).to.be.a("string");
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


    // function get(url) {
    //     // Return a new promise.
    //     return new Promise(function(resolve, reject) {
    //         // Do the usual XHR stuff
    //         var req = new XMLHttpRequest();
    //         req.open('GET', url);
    //
    //         req.onload = function() {
    //             // This is called even on 404 etc
    //             // so check the status
    //             if (req.status == 200) {
    //                 // Resolve the promise with the response text
    //                 resolve(req.response);
    //             }
    //             else {
    //                 // Otherwise reject with the status text
    //                 // which will hopefully be a meaningful error
    //                 reject(Error(req.statusText));
    //             }
    //         };
    //
    //         // Handle network errors
    //         req.onerror = function() {
    //             reject(Error("Network Error"));
    //         };
    //
    //         // Make the request
    //         req.send();
    //     });
    // }

    it(`login to Xome as ${credentials.loginName}`, async () => {
        await driver.findElement( { 'xpath' : '//*[@id="js-SiteHead"]/div/nav/div[3]/div[2]/div[2]/a[1]'} ).click();


        let loginFrame = await driver.findElement(By.id('login-iframe'));
        await driver.switchTo().frame(loginFrame).catch( ()=> console.log('did not switch to active element') );
        await driver.sleep( 1500 );
        await driver.findElement( { 'id' : 'security_loginname' } ).sendKeys( credentials.username).catch( () => console.log('could not find element security_loginname'));
        await driver.findElement( { 'id' : 'security_password'  } ).sendKeys( credentials.password).catch( () => console.log('could not find element security_password'));
        await driver.findElement( { 'id' : 'submit-button'      } ).click();
        await driver.sleep( 1000 );
    })

    it('verify the login name is correct', async () => {
        let loginName = await driver.findElement({ 'xpath': '//*[@id="uniqid-NavSubmenu-button-14"]/span/span'}).getText();
        expect(loginName).to.equal(credentials.loginName, 'Error: login name does not match');
    })

    it(`search homes in ${credentials.city}`, async () => {
        await driver.findElement( { 'id' : 'homepage-search-field' } ).clear();
        await driver.findElement( { 'id' : 'homepage-search-field' } ).sendKeys(credentials.city);
        await driver.findElement( { 'className' : 'search-field-button'   } ).click();
        await driver.sleep( 1000 );
        ////*[@id="location-criteria-list"]/ul/li/a
        let cityName = await driver.findElement( { 'xpath': '//*[@id="location-criteria-list"]/ul/li/a'}).getText();
        expect(cityName).to.equal(credentials.cityName, 'Error: city name does not match');

        // await driver.findElement( { 'id' : 'uniqid-NavSubmenu-button-14'  } ).click();
        // await driver.sleep( 1000 );


    })

    it(`verify the number of properties on the page`, async () => {
        await driver.wait(until.elementLocated( { 'xpath' : '//*[@id="mapsearch-results-body"]/div'} ) );
        let properties = await driver.findElements( { 'xpath' : '//*[@id="mapsearch-results-body"]/div' } );
        console.log(`Number of properties on the page: ${properties.length}`);
        expect(properties.length).to.equal(24, 'Error: number of properties on the page is not 24');
    })

    it(`click through the pictures on each of the properties`, async () => {
        let properties = await driver.findElements( { 'xpath' : '//*[@id="mapsearch-results-body"]/div' } );
        // let topContact = await driver.findElement({'xpath': `//div[6]/div/div/nav/div[3]/div[2]/div[1]/div[1]/span`});
        // const actions = driver.actions({bridge:true});
        // await actions.move({duration:500,origin:topContact,x:0,y:0}).perform();
        // console.log('moved mouse?');

        // await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
        // await driver.sleep( 1000 );
        let driverCapa = await driver.getCapabilities();
        var browserName = driverCapa.getBrowserName();
        //console.log('browser is: ', browserName);

        if( browserName==='chrome' || browserName==='MicrosoftEdge') {
            for (let pInPage = 1; pInPage <= properties.length; pInPage++) {
                //await driver.wait(until.elementLocated( {'xpath' : `//*[@id="mapsearch-results-body"]/div[${pInPage}]/div[2]/a` }));
                await driver.sleep(1500);
                await driver.findElement({'xpath': `//*[@id="mapsearch-results-body"]/div[${pInPage}]`}).click();//click on the property listed
                await driver.findElement({'xpath': `//*[@id="mapsearch-results-body"]/div[${pInPage}]`}).catch(() => console.log(`can not find the ${pInPage}th property!`));//click on the first property listed
                //console.log(`div[${pInPage}]`);
                //*[@id="mapsearch-results-body"]/div[2]//second property
                await driver.wait(until.elementLocated({'xpath': '//*[@id="ltslide-total"]'}));
                await driver.sleep(1000);
                let picTotal = await driver.findElement({'xpath': '//*[@id="ltslide-total"]'}).getText();//number of property pictures
                let streetAddr = await driver.findElement({'xpath': '//*[@id="listingdetail-title-summary"]/div[2]/div/h1'}).getText();//street address
                let cityAddr = await driver.findElement({'xpath': '//*[@id="listingdetail-title-summary"]/div[2]/div/div/span[1]'}).getText();//city address
                let askingPrice = await driver.findElement({'xpath': '//*[@id="listingdetail-title-summary"]/div[1]/div[2]/span[1]/span/span'}).getText();//property asking price
                console.log(`The property at ${streetAddr} ${cityAddr} has asking price of ${askingPrice} with ${picTotal} property pictures`);
                if (picTotal > 1) {
                    for (let i = 0; i < picTotal; i++) {
                        if (browserName==='MicrosoftEdge'){
                            await driver.sleep(1500);
                        };
                        await driver.findElement({'xpath': '//*[@id="gallery-photos-all"]/div/div/div/a[2]'}).click().catch(() => console.log('nope, could not find next pic >'));
                        if (i > 3) {
                            i = picTotal;//So we don't click through all of the pictures, because there could be a lot of pictures!
                        }
                    }
                    //await driver.findElement( { 'xpath' : '//*[@id="gallery-photos-all"]/div/div/div/a[2]/i'    } ).click();//next picture >
                }
                ;
                await driver.findElement({'xpath': '//*[@id="top-navigation-v3-closer"]/span'}).click();//close modal
                if (pInPage > 5) {
                    pInPage = properties.length;//so we don't click through all of the properties
                }
            }
        }


    })

    it('logout of Xome', async () => {
        await driver.wait(until.elementLocated({ 'xpath': '//*[@id="uniqid-NavSubmenu-dropdown-14"]'} ));//menu dropdown
        await driver.findElement( { 'id' : 'uniqid-NavSubmenu-button-14'  } ).click();
        await driver.sleep ( 2500 );
        await driver.findElement( { 'xpath' : '//*[@id="uniqid-NavSubmenu-dropdown-14"]/ul/li[17]/a'} ).click();//logout
    })

});

