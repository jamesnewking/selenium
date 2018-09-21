// http://lance.bio/2017/09/26/javascript-selenium-newb-cheat-sheet/
var credentials = require('../../credentials.js');

var webdriver = require('selenium-webdriver'),
    Builder = webdriver.Builder,
    By = webdriver.By,
    logging = webdriver.logging,
    until = webdriver.until;

let driver = new Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

var winName;

driver.get( 'https://xome.com')
    .then( () => driver.manage().window().setRect({width: 640, height: 480}) )
    .then( () => driver.manage().window().maximize() )
    .then( () => driver.getWindowHandle().then( wname => winName=wname ))
    .then( () => driver.findElement( { 'xpath' : '//*[@id="js-SiteHead"]/div/nav/div[3]/div[2]/div[2]/a[1]'} ).click())
    .then( () => driver.switchTo().frame('login-iframe'))
    .then( () => driver.sleep( 1000 ))
    .then( () => driver.findElement( { 'id' : 'security_loginname' } ).sendKeys( credentials.username))
    .then( () => driver.findElement( { 'id' : 'security_password'  } ).sendKeys( credentials.password))
    .then( () => driver.findElement( { 'id' : 'submit-button'             } ).click() )
    .then( () => driver.sleep( 1000 ))
    .then( () => driver.switchTo().window(winName)).catch(()=> console.log('nope!'))
    .then( () => driver.findElement( { 'id' : 'homepage-search-field' } ).sendKeys('Irvine, CA'))
    .then( () => driver.findElement( { 'className' : 'search-field-button'   } ).click() )
    .then( () => driver.sleep( 1000 ))
    .then( () => driver.findElement( { 'id' : 'uniqid-NavSubmenu-button-14'             } ).click() )
    .then( () => driver.sleep( 1000 ))
    .then( () => driver.findElement( { 'xpath' : '//*[@id="uniqid-NavSubmenu-dropdown-14"]/ul/li[17]/a'} ).click() )
    .then( () => driver.sleep( 3000 ))
    .then( () => driver.quit() );
