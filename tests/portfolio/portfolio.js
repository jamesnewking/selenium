var helper = require('../../pages/helper');
var locate = {
    catch_me:'#portfolio > div > div:nth-child(2) > div:nth-child(2)',
    catch_me_title:'#portfolioModal2 > div > div > div.container > div > div > div > h2',
    catch_me_link:'#portfolioModal2 > div > div > div.container > div > div > div > a > img',
};


module.exports = {
    tags : ['portfolio'],

    before: function(browser){
        helper(browser).openBrowser();
    },
    'webpage title' : function (browser){
        browser
            .assert.title('James Wang Web Portfolio')
    },
    // 'scroll down' : function (browser){
    //     helper(browser).scrollDown();
    // },
    'click on catch me' : function (browser){
        browser
            .click(locate.catch_me)
    },
    'switch to active modal' : function (browser){
        browser
            .waitForElementPresent(locate.catch_me_title,3000);
    },
    'move to modal element' : function (browser){
        browser
            .moveToElement(locate.catch_me_title,10,10);
    },
    'scroll down' : function (browser){
        helper(browser).scrollDown();
    },
    'verify modal title' : function (browser){
        browser
            .getText(locate.catch_me_title, function(result){
                console.log('result is:', result.value);
                this.assert.equal(result.value,"CATCH ME IF YOU CAN");
        });
    },
    'click on catch me live project' : function(browser){
        browser
            .click(locate.catch_me_link);
    },
    after : function(browser){
        //utils(browser).closeBrowser;
        browser
            .pause(2000)
            .end();
    }
};