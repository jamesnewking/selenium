var utils = require('../../pages/utils');

module.exports = {
    tags : ['login'],

    before: function(browser){
        utils(browser).openBrowser();

    },
    'Go to the login page' : function (browser){
        browser.pause(1000)
        utils(browser).loginButton();
        utils(browser).userLogin();
        browser.pause(1000)
    },
    'Verify user logged in' : function (browser){
        utils(browser).verifyUser();
    },
    'Logout of user account' : function (browser){
        browser.pause(1000);
        utils(browser).userLogout();
    },
    after : function(browser){
        //utils(browser).closeBrowser;
        browser.pause(1000);
        browser.end();
    }

};