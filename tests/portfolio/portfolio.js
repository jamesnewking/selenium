var helper = require('../../pages/helper');
var locate = require('../../pages/locate');
var catchMe = require('../../pages/catch_me');
let winModal = '#modalContent > div > div.modal-content.wikipedia-text-bg.col-md-5.col-lg-5 > div.modal-header > h4';

module.exports = {
    tags : ['portfolio'],

    before: function(browser){
        // console.log('this is the log');
        // console.log('I should see:',catchMe.winningModal);
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
            .waitForElementVisible(locate.catch_me_title,3000);
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
            .click(locate.catch_me_link)
    },
    'switch to catch me window' : function(browser){
        browser
            .windowHandles(function(result){
                console.log('the window names are: ', result);
                browser.switchWindow(result.value[1]);
            })
    },
    'wait for catch me window to open' : function(browser){
        browser
            .waitForElementPresent('body > div.container-fluid.header > div > div.offset-xs-2.col-xs-6.offset-sm-1.col-sm-6.offset-md-1.col-md-6 > div:nth-child(1) > span',5000)
    },
    'verify catch me window title' : function(browser){
        browser
            .assert.title('Catch Me If You Can')
    },
    'scroll down the window' : function(browser){
        catchMe(browser).scrollDown();
    },
    'in catch me window, hover over button A' : function(browser){
        catchMe(browser).overButtonA();
        browser
            .pause(2000);//wait until speech is done
    },
    'in catch me window, hover over button B' : function(browser){
        catchMe(browser).overButtonB();
        browser
            .pause(2000);//wait until speech is done
    },
    'in catch me window, hover over button C' : function(browser){
        catchMe(browser).overButtonC();
        browser
            .pause(2000);//wait until speech is done
    },
    'in catch me map, click on marker A' : function(browser){
        catchMe(browser).clickMapA();
        browser
            .pause(3000);
    },
    'in catch me map, click on marker B' : function(browser){
        catchMe(browser).clickMapB();
        browser
            .pause(3000);
    },
    'in catch me map, click on marker C' : function(browser){
        catchMe(browser).clickMapC();
        browser
            .pause(3000);
    },
    'click on buttonA' : function(browser){
        let foundAnswer = false;
        catchMe(browser).clickButtonA();
        browser.isVisible(winModal, function(result){
            foundAnswer = result.value;
        });
        if(foundAnswer){
            browser
                .click(winModal)
                .pause(2000)
                .end();}
        else { catchMe(browser).clickButtonB(); };
        browser.isVisible(winModal, function(result){
            foundAnswer = result.value;
        });
        if(foundAnswer) {
            browser
                .click(winModal)
                .pause(2000)
                .end();}
         else {
            catchMe(browser).clickButtonC(); };
    },
    after : function(browser){
        //utils(browser).closeBrowser;
        browser
            .click(winModal)
            .pause(2000)
            .end();
    }
};