module.exports = function(browser){
    this.openBrowser = function(){
        browser
            .maximizeWindow()
            .url('http://jameswww.com/')
            .waitForElementVisible('body',2000);
        return browser
    };
    this.scrollDown = function(){
        browser
            .execute('scrollTo(0,500)');
    }
    this.closeBrowser = function(){
        browser.end()
        //.pause(1000)
        //.end()
    };
    return this;
};