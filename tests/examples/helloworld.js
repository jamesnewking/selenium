module.exports = {
    '@tags': ['helloworldclick'],
    'We are going to click and click on a button': function (browser) {

        browser
            .url('https://google.com')
            .waitForElementVisible('body',1000)
            //.click('body > main > div > div:nth-child(1) > a')
            .execute( function(){ console.log('testing123'); } )
            .pause(25000)
            .end();
    }
}