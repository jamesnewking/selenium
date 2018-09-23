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
    //let driver = new Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.ie()).build();
    //let driver = new Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.edge()).build();//3/1
    //.withCapabilities(webdriver.Capabilities.ie())
    await driver.get('https://www.xome.com');
    await driver.manage().window().maximize();
    //await driver.manage().window().setRect( {width: 1280, height: 720});
    windowName = await driver.getWindowHandle();
    console.log('Window name is: ', windowName);
    await driver.sleep( 2500 );
    await driver.findElement( { 'xpath' : '//*[@id="js-SiteHead"]/div/nav/div[3]/div[2]/div[2]/a[1]'} ).click();
    let driverCapa = await driver.getCapabilities();
    let browserName = driverCapa.getBrowserName();
    console.log('browser is: ', browserName);
    if( browserName === 'chrome' ){
        console.log("It's chrome!!");
        await driver.switchTo().frame('login-iframe');
    } else {
        console.log("it's not chrome");
        await driver.sleep( 1000 );
        let iframeNames = await driver.findElements(By.tagName("iframe"));
        console.log('iframe: ', iframeNames.length);
        if (iframeNames.length<4) {
            await driver.switchTo().frame(1).catch( () => console.log('nope not this frame') );
            console.log('frame: 1');
        } else {
            await driver.switchTo().frame(2).catch( () => console.log('nope not this frame 2') );
            console.log('frame: 2');
        }
    }
    //note//for chrome iframeNames[2]
    await driver.sleep( 2500 );
    //await driver.switchTo().frame(iframeNames[2]);
    await driver.findElement( { 'id' : 'security_loginname' } ).isDisplayed().catch( async () => { await driver.switchTo().frame(1).catch( ()=> console.log('not this frame 1 either!') );
        console.log('trying frame 1') } );
    await driver.findElement( { 'id' : 'security_loginname' } ).sendKeys( credentials.username).catch( () => console.log('could not find element security_loginname'));
    await driver.findElement( { 'id' : 'security_password'  } ).sendKeys( credentials.password).catch( () => console.log('could not find element security_password'));
    await driver.sleep( 2000 );
    await driver.findElement( { 'id' : 'submit-button'                } ).click();
    await driver.sleep( 2500 );
    await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
    await driver.sleep( 4000 );
    //await driver.switchTo().window('windowName').catch(()=> console.log('Could not find the window'));
    //chrome didn't need to switch back to main window since the modal closed itself after login
    await driver.findElement( { 'id' : 'homepage-search-field' } ).sendKeys('Irvine, CA');
    await driver.findElement( { 'className' : 'search-field-button'   } ).click();
    await driver.sleep( 1000 );
    await driver.findElement( { 'id' : 'uniqid-NavSubmenu-button-14'  } ).click();
    await driver.sleep( 1000 );
    await driver.findElement( { 'xpath' : '//*[@id="uniqid-NavSubmenu-dropdown-14"]/ul/li[17]/a'} ).click();
    await driver.sleep( 500 );
    await driver.quit();
};

xome_login()
    .then( () => console.log('Success!'), e => console.error('FAILURE: ' + e));