module.exports = function(browser){
    this.openBrowser = function(){
        browser
            .maximizeWindow()
            .url('https://www.artsyjewels.com/')
            .waitForElementVisible('body',1000);
        return browser
    };
    this.loginButton = function(){
        browser
            .click('#header > div.top-header.light-style > div > div > div:nth-child(2) > ul > li:nth-child(3) > a > span')
    };
    this.userLogin = function(){
        browser
            .useXpath()
            .setValue('//*[@id="customer_login"]/div/p[1]/input','email@yahoo.com')
            .setValue('//*[@id="customer_login"]/div/p[2]/input','password')
            .click('//*[@id="customer_login"]/div/p[3]/input')
    };
    this.verifyUser = function(){
        browser
            .verify.containsText( '/html/body/div[1]/div[2]/div/div/div/div[1]/h2' , 'generic_user')
    };
    this.userLogout = function(){
        browser
            .click('/html/body/div[1]/div[2]/div/div/div/div[1]/p/a')
    };
    this.closeBrowser = function(){
        browser.end()
            //.pause(1000)
            //.end()
    };
    return this;
};