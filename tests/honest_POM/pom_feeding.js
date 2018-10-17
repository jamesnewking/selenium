module.exports = class Feeding {
    constructor (driver, webdriver){
        this.driver = driver;
        this.webdriver = webdriver;
        this.topNavFeeding = { 'xpath': '//*[@id="header-nav"]/div/navigation-default/nav/div/ul/li[3]/a'};
        this.premiumInfantFormulaXpath = { 'xpath':'//*[@id="breast-formula-feeding"]/div/div[2]/cl-product-tile/figure/a/img'};
        this.singlePremiumInfantFormula = { 'xpath': '//*[@id="js-container-main"]/div[3]/div[1]/h1'};
        this.singlePremiumInfantFormulaSizeDropDown = { 'xpath': '//*[@id="js-container-main"]/div[3]/div[2]/div[1]/div[3]/div[2]/div[2]/div/div/div/div/div/select'};
        this.singlePremiumInfantFormulaPrice = { 'xpath':'//*[@id="js-container-main"]/div[3]/div[2]/div[1]/div[3]/div[1]/div[1]/span/span[2]'};
        this.singlePremiumInfantFormulaBuyNow = { 'xpath':'//*[@id="js-container-main"]/div[3]/div[2]/div[1]/div[3]/div[2]/div[3]/div/buy-now-button/button'};
        this.singlePremiumInfantFormulaCart = { 'xpath': '//*[@id="js-navbar-top"]/div[1]/div/ul/li[3]/ul/li/a/div[2]'};
        this.cart1stItemName = { 'xpath': '/html/body/div[2]/div/div[5]/div/div/div[2]/div[1]/div[1]/h5'};
        this.cart1stItemPrice  = { 'xpath': '/html/body/div[2]/div/div[5]/div/div/div[2]/div[1]/div[2]/h5'};
        this.premiumInfantFormulaName = 'Organic Premium Infant Formula';
    };

    async addFeedingItem(){
        //await this.driver.sleep(1000);
        await this.driver.findElement( this.topNavFeeding ).click();
        //await this.driver.sleep(1000);
        await this.driver.executeScript( "window.scrollTo(0,300);" );
        await this.driver.findElement( this.premiumInfantFormulaXpath ).click().catch( ()=> console.log('did not find premium baby formula') );
        //await this.driver.sleep(1000);
        let singleItemTitle = await this.driver.findElement( this.singlePremiumInfantFormula ).getText();
        console.log(`the item title is: ${singleItemTitle}`);
        let itemDropDown = await this.driver.findElement( this.singlePremiumInfantFormulaSizeDropDown );
        const actions = this.driver.actions({bridge:true});
        await actions.click(itemDropDown).sendKeys( this.webdriver.Key.ARROW_DOWN ).perform();
        //await this.driver.sleep(1000);//needed for firefox
        await actions.sendKeys(this.webdriver.Key.ENTER).perform();
        // await actions.move({duration:1500,origin:itemDropDown,x:20,y:-100}).click().perform();
        let itemPrice = await this.driver.findElement( this.singlePremiumInfantFormulaPrice ).getText();
        itemPrice = "$" + itemPrice;
        await this.driver.findElement( this.singlePremiumInfantFormulaBuyNow ).click();
        console.log(`the price is ${itemPrice}`);
        return { 'name': singleItemTitle, 'price': itemPrice};
    }

    async cartItem() {
        await this.driver.findElement( this.singlePremiumInfantFormulaCart ).click();
        await this.driver.wait(this.webdriver.until.elementLocated( this.cart1stItemName ) );
        let cartItemName = await this.driver.findElement( this.cart1stItemName ).getText();
        let cartItemPrice = await this.driver.findElement( this.cart1stItemPrice ).getText();
        console.log(`The item name ${cartItemName} is ${cartItemPrice}`);
        return { 'name': cartItemName, 'price': cartItemPrice };
    }

    formulaName() {
        return this.premiumInfantFormulaName;
    }


}