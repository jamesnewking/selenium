module.exports = {
    tags : ['testcase2'],
    'Open Homepage and search for silver bracelets': function (browser){
        browser
            .url('https://www.artsyjewels.com/')
            .waitForElementVisible('body',1000)
            .maximizeWindow()
            .assert.title('Best Online Jewelry Store | Affordable Jewelry Brand – Artsyjewels')
            .setValue('#header > div.header2.bg-white > div.main-header2 > div > div > div.col-md-6.col-sm-8.col-xs-12 > form > input[type="search"]:nth-child(2)', ['sterling silver', browser.Keys.ENTER])
            //.submitForm('#header > div.header2.bg-white > div.main-header2 > div > div > div.col-md-6.col-sm-8.col-xs-12 > form')
            //.getText('body > div.wrap > section > div > div > h3', function(result){console.log('The expected result is: ?')} )
            .pause(10000)
            .useXpath()
            .getText('/html/body/div[1]/div[2]/div/div/strong',function(result){console.log('sterling silver?', result.value)})
            .assert.containsText( '/html/body/div[1]/div[2]/div/div/strong' , 'sterling silver')
            .execute(function(){console.log('This seems to be working!')})
            .pause(20000)
            .end();
    }


}
