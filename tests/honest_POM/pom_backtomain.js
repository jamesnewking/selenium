module.exports = class BackToMain {
    constructor (driver, webdriver){
        this.driver = driver;
        this.webdriver = webdriver;
        this.topLeftMainLogo = { 'xpath' : '//*[@id="checkout-header"]/div[2]/div/div/div[1]/a/img'};
        this.topNavFeeding = { 'xpath' : '//*[@id="header-nav"]/div/navigation-default/nav/div/ul/li[3]/a'};
    };

    async isBacktoMainPage(){
        let previousTitle = await this.driver.getTitle();
        await this.driver.findElement( this.topLeftMainLogo ).click();
        await this.driver.wait(this.webdriver.until.elementLocated( this.topNavFeeding ) );
        let topNavFeeding = await this.driver.findElement( this.topNavFeeding );
        let currentTitle = await this.driver.getTitle();
        //console.log(`Did we go back to the main page? ${await this.topNavFeeding.isDisplayed()}`);
        console.log(`previous page title is: ${previousTitle} and current page title is: ${currentTitle}`);

        let isDisplay = await topNavFeeding.isDisplayed();
        return isDisplay;
    };



}