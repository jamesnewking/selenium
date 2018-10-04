var webdriver = require('selenium-webdriver'),
    Builder = webdriver.Builder,
    By = webdriver.By,
    logging = webdriver.logging,
    until = webdriver.until;

let driver = new Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

async function jamesLoginTest(){
    let driver = new Builder().forBrowser('chrome').build();
    await driver.get('http://jameswww.com');
    await driver.manage().window().setRect({width: 640, height: 480});
    await driver.manage().window().maximize();
    await driver.findElement( { 'id' : 'name'             } ).sendKeys( 'My Name' );
    await driver.findElement( { 'id' : 'email'            } ).sendKeys( 'test@test.com' );
    await driver.findElement( { 'id' : 'phone'            } ).sendKeys( '8885551212' );
    //await driver.findElement( { 'id' : 'message'          } ).sendKeys( 'My automation works!');
    await driver.findElement( { 'id' : 'sendMessageButton'} ).click();
    await driver.sleep( 5000 );
    const result = await driver.findElement( { 'xpath' : '//*[@id="success"]/div/strong'} ).getText().catch(()=>console.log('message did not send'));
    console.log('The text back is: ', result);
    await driver.sleep( 2000 );
    await driver.wait(until.titleIs('James Wang Web Portfolio'), 3000);
    console.log('found title');
    const websiteTitle = await driver.getTitle();
    console.log('title is: ', websiteTitle);
    await driver.quit();
}

jamesLoginTest()
    .then( () => console.log('Success!'), e => console.error('FAILURE: ' + e));