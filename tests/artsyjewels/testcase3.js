module.exports = {
    tags : ['testcase3'],
    'Go to homepage and try user login': function (browser){
        browser
            .url('https://www.artsyjewels.com/')
            .waitForElementVisible('body',1000)
            .maximizeWindow()
            .assert.title('Best Online Jewelry Store | Affordable Jewelry Brand – Artsyjewels')
            .useXpath()
            .click('//*[@id="header"]/div[1]/div/div/div[2]/ul/li[3]/a/span')
            .pause(1000)
            .setValue('//*[@id="customer_login"]/div/p[1]/input','test@test.com')
            .setValue('//*[@id="customer_login"]/div/p[2]/input','password')
            .click('//*[@id="customer_login"]/div/p[3]/input')
        browser.saveScreenshot('./screenshots/Chrome/login.jpg')
            .pause(20000)
            .end();
    }


}
