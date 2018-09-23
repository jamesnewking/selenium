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
    await driver.manage().window().maximize();
    //await driver.manage().window().setRect( {width: 1280, height: 720});
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
    await driver.findElement( { 'xpath' : '//*[@id="uniqid-NavSubmenu-dropdown-14"]/ul/li[17]/a'} ).click();
    await driver.sleep( 500 );
    await driver.quit();
};

xome_login()
    .then( () => console.log('Success!'), e => console.error('FAILURE: ' + e));