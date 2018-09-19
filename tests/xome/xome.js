var webdriver = require('selenium-webdriver');
//
// var browser = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
//
// browser.get('https://jameswww.com');
//
//     var promise = browser.getTitle();
//     console.log('running');
//     promise.then(function(title) {
//         console.log(title)
//     });

//browser.quit();

// var webdriver = require("selenium-webdriver");
//
// function createDriver() {
//     var driver = new webdriver.Builder()
//         .usingServer('http://localhost:4444/wd/hub')
//         .withCapabilities(webdriver.Capabilities.chrome())
//         .build();
//     //driver.manage().timeouts().setScriptTimeout(10000);
//     return driver;
// }
//
// var driver = createDriver();
// driver.get("https://www.yahoo.com");
// console.log('running');
// driver.getTitle(function (title) {
//     console.log('title is:',title)
// });
// // driver.getTitle().then(function (title) {
// //     console.log(title);


//driver.quit();
var driver = new webdriver.Builder()
        .usingServer('http://localhost:4444/wd/hub')
        .withCapabilities(webdriver.Capabilities.chrome())
        .build();
//var driver = new webdriver.Builder().build();
driver.get('https://jameswww.com/catch_me/');

// var element = driver.findElement(webdriver.By.name('q'));
// element.sendKeys('Cheese!');
// //element.submit();
// console.log('running before title checking');

var elementNa = driver.findElement(webdriver.By.className('weather-text'));
elementNa.getText().then(text => console.log(`Text is ${text}`)).catch( () => console.log("didn't find title"));

// const webTitle = async () => {
//     console.log(await driver.getTitle());
//     return "done";
// }

// webTitle();

driver.pause(3000);
driver.getTitle().then((title) => {console.log('Page title is: ' + title);}).catch( () => {console.log("Didn't find page title")});

// driver.wait(function() {
//     return driver.getTitle().then(function(title) {
//         return title.toLowerCase().lastIndexOf('cheese!', 0) === 0;
//     });
// }, 3000);
//
// driver.getTitle().then(function(title) {
//     console.log('Page title is: ' + title);
// });

// const exitBrowser = async () => {
//     await driver.quit();
//     return "done";
// }
//
// exitBrowser();
// driver.close();
// driver.quit();