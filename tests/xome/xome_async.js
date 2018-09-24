var credentials = require('../../credentials.js');

var webdriver = require('selenium-webdriver'),
    Builder = webdriver.Builder,
    By = webdriver.By,
    logging = webdriver.logging,
    until = webdriver.until;

// let driver = new Builder()
//     .usingServer('http://localhost:4444/wd/hub')
//     .withCapabilities(webdriver.Capabilities.chrome())
//     .build();

async function xome_login(){
    let windowName;
    let driver = new Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.chrome()).build();
    //let driver = new Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.firefox()).build();
    //let driver = new Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.edge()).build();
    //let driver = new Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.ie()).build();//screen out of bounds


    await driver.get('https://www.xome.com');
    //await driver.manage().window().maximize();
    await driver.manage().window().setRect( {width: 1280, height: 920});
    //await driver.executeScript('alert("hello")');
    await driver.sleep( 500 );
    await driver.findElement( { 'xpath' : '//*[@id="js-SiteHead"]/div/nav/div[3]/div[2]/div[2]/a[1]'} ).click();
    let driverCapa = await driver.getCapabilities();
    let browserName = driverCapa.getBrowserName();
    console.log('browser is: ', browserName);
    //windowName = await driver.getWindowHandle();
    //console.log('Window name is: ', windowName);
    let loginFrame = await driver.findElement(By.id('login-iframe'));
    await driver.switchTo().frame(loginFrame).catch( ()=> console.log('did not switch to active element') );
    //await driver.switchTo().frame('login-iframe');
    await driver.sleep( 1500 );
    await driver.findElement( { 'id' : 'security_loginname' } ).sendKeys( credentials.username).catch( () => console.log('could not find element security_loginname'));
    await driver.findElement( { 'id' : 'security_password'  } ).sendKeys( credentials.password).catch( () => console.log('could not find element security_password'));
    await driver.findElement( { 'id' : 'submit-button'      } ).click();
    await driver.sleep( 1000 );
    await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
    await driver.sleep( 1000 );

    //await driver.switchTo().window('windowName').catch(()=> console.log('Could not find the window'));
    //chrome didn't need to switch back to main window since the modal closed itself after login
    await driver.findElement( { 'id' : 'homepage-search-field' } ).clear();
    await driver.findElement( { 'id' : 'homepage-search-field' } ).sendKeys('Irvine, CA');
    await driver.findElement( { 'className' : 'search-field-button'   } ).click();
    await driver.sleep( 1000 );
    await driver.findElement( { 'id' : 'uniqid-NavSubmenu-button-14'  } ).click();
    await driver.sleep( 1000 );

    await driver.wait(until.elementLocated( { 'xpath' : '//*[@id="mapsearch-results-body"]/div'} ) );

    let properties = await driver.findElements( { 'xpath' : '//*[@id="mapsearch-results-body"]/div' } );
    console.log(`Number of properties on the page: ${properties.length}`);

    let topContact = await driver.findElement({'xpath': `//div[6]/div/div/nav/div[3]/div[2]/div[1]/div[1]/span`});
    const actions = driver.actions({bridge:true});
    await actions.move({duration:500,origin:topContact,x:0,y:0}).perform();
    console.log('moved mouse?');
    // await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
    // await driver.sleep( 1000 );

    if( browserName==='chrome' || browserName==='MicrosoftEdge') {
        for (let pInPage = 1; pInPage <= properties.length; pInPage++) {
            //await driver.wait(until.elementLocated( {'xpath' : `//*[@id="mapsearch-results-body"]/div[${pInPage}]/div[2]/a` }));
            await driver.sleep(1500);
            await driver.findElement({'xpath': `//*[@id="mapsearch-results-body"]/div[${pInPage}]`}).click();//click on the property listed
            await driver.findElement({'xpath': `//*[@id="mapsearch-results-body"]/div[${pInPage}]`}).catch(() => console.log(`can not find the ${pInPage}th property!`));//click on the first property listed
            console.log(`div[${pInPage}]`);
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
    await driver.wait(until.elementLocated( { 'xpath' : '//*[@id="uniqid-NavSubmenu-dropdown-14"]'} ));//menu dropdown
    await driver.findElement( { 'id' : 'uniqid-NavSubmenu-button-14'  } ).click();
    await driver.sleep( 2500 );
    if (browserName==='MicrosoftEdge'){
        await driver.quit()
    };
    await driver.findElement( { 'xpath' : '//*[@id="uniqid-NavSubmenu-dropdown-14"]/ul/li[17]/a'} ).click();//logout
    await driver.quit();
};

xome_login()
    .then( () => console.log('Success!'), e => console.error('FAILURE: ' + e));