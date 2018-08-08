module.exports = {
    'tags': ['testcase1'],
    'Open Homepage and click on headers': function (browser){
        browser
            .url('https://www.artsyjewels.com/')
            .waitForElementVisible('body',1000)
            .maximizeWindow()
            .assert.title('Best Online Jewelry Store | Affordable Jewelry Brand – Artsyjewels')
            .moveToElement('#header > div.header2.bg-white > div.header-nav2 > div > div > div.col-md-9.col-sm-8.col-xs-12 > nav > ul > li:nth-child(2) > a',10,10)
            .click('#header > div.header2.bg-white > div.header-nav2 > div > div > div.col-md-9.col-sm-8.col-xs-12 > nav > ul > li:nth-child(2) > ul > li:nth-child(8) > a')
            .execute(function(){console.log('This seems to be working!')})
            .pause(10000)
            .end();
    }


}
