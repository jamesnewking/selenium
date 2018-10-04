function get(url) {
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


// let topContact = await driver.findElement({'xpath': `//div[6]/div/div/nav/div[3]/div[2]/div[1]/div[1]/span`});
// const actions = driver.actions({bridge:true});
// await actions.move({duration:500,origin:topContact,x:0,y:0}).perform();
// console.log('moved mouse?');

// await driver.switchTo().defaultContent().catch( ()=> console.log('can not find defaultContent window'));
// await driver.sleep( 1000 );
//let driverCapa = await driver.getCapabilities();
//var browserName = driverCapa.getBrowserName();
//console.log('browser is: ', browserName);

// let firefoxCapa = webdriver.Capabilities.firefox();
// let firefoxOptions = {
//     "overlappingCheckDisabled": true
// };
//firefoxCapa.set('firefoxOptions', firefoxOptions);
//driver = await new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities(firefoxCapa).build();

//let driverCapa = await driver.getCapabilities();
//var browserName = await driverCapa.getBrowserName();
//console.log(browserName);