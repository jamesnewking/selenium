module.exports = {
    'tags': ['demo'],
    'Demo test Google' : function (browser) {
        browser
            .url('http://www.google.com') // Go to a url
            .waitForElementVisible('body', 1000) // wait till page loads
            .assert.title('Google') // Make sure Site title matches
            .click('#gbqfbb') // click on search box
            .click('#tsf > div.tsf-p > div.jsb > center > div')
            .execute( function(){ console.log('This is working!'); } )
            .pause(15000)
            .end();
    }
};

// module.exports = {
//     tags: ['google'],
//     'Demo test Google' : function (browser) {
//         browser
//             .url('http://www.google.com') // Go to a url
//             .waitForElementVisible('body', 1000) // wait till page loads
//             .assert.title('Google') // Make sure Site title matches
//             .assert.visible('input[type=text]')
//             .setValue('input[type=text]', 'nightwatchjs') // send values
//             .click('button[name=btnG]') // click on search box
//             .pause(1000)
//             .end();
//     }
// };