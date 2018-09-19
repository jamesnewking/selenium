// http://lance.bio/2017/09/26/javascript-selenium-newb-cheat-sheet/

var webdriver = require('selenium-webdriver'),
    Builder = webdriver.Builder,
    By = webdriver.By,
    logging = webdriver.logging,
    until = webdriver.until;

let driver = new Builder().forBrowser('chrome').build();

driver.get( 'https://jameswww.com')
    .then( () => driver.findElement( { 'id' : 'name'             } ).sendKeys( 'My Name'))
    .then( () => driver.findElement( { 'id' : 'email'             } ).sendKeys( 'test@test.com'))
    .then( () => driver.findElement( { 'id' : 'phone'             } ).sendKeys( '8885551212'))
    //.then( () => driver.findElement( { 'id' : 'message'             } ).sendKeys( 'My automation works!'))
    .then( () => driver.findElement( { 'id' : 'sendMessageButton'} ).click())
    .then( () => driver.sleep( 5000 ))
    .then( () => {let result = driver.findElement( { 'xpath' : '//*[@id="success"]/div/strong'} ).catch(()=>console.log('message did not send')); result.getText().then(text => console.log('result is:',text))})
    .then( () => driver.sleep( 10000 ))
    .then( () => driver.wait(until.titleIs('James Wang Web Portfolio'), 3000))
    .then( () => console.log('found title'))
    .then( () => { driver.getTitle().then((title) => console.log('title is: ', title)).catch( ()=> console.log('no title found'))}  )
    .catch( () => console.log('catch block'))
    .then( () => driver.quit());
