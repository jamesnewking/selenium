module.exports = class PayCart {
    constructor (driver, webdriver){
        this.driver = driver;
        this.webdriver = webdriver;
        
        this.showOrderSummary = { 'css': 'body > button > span > span > span.order-summary-toggle__text.order-summary-toggle__text--show'},
        this.payCartTitle = { 'css' : '#order-summary > div > div.order-summary__section.order-summary__section--product-list > div > table > tbody > tr > td.product__description > span.product__description__name.order-summary__emphasis'},
        this.payCartPrice = { 'css' : '#order-summary > div > div.order-summary__section.order-summary__section--product-list > div > table > tbody > tr > td.product__price > span'},
        this.payCartSizeColor = { 'css' : '#order-summary > div > div.order-summary__section.order-summary__section--product-list > div > table > tbody > tr > td.product__description > span.product__description__variant.order-summary__small-text'}

    };

    async getFinalCartInfo(){
        let payCart = {};
        let orderSummaryDropdown = await this.driver.findElement( this.showOrderSummary ).isDisplayed();
        if ( orderSummaryDropdown ){
            await this.driver.findElement( this.showOrderSummary ).click();
        };

        await this.driver.wait( this.webdriver.until.elementLocated( this.payCartTitle ) );
        payCart.title = await this.driver.findElement( this.payCartTitle ).getText();
        payCart.price = await this.driver.findElement( this.payCartPrice ).getText();
        payCart.sizeColor = await this.driver.findElement( this.payCartSizeColor ).getText();
        console.log(`The final pay cart title: ${payCart.title}, price: ${payCart.price}, size/color: ${payCart.sizeColor}`)
        const slashLoc = payCart.sizeColor.lastIndexOf('/');
        payCart.size = payCart.sizeColor.slice(0,slashLoc-1);
        payCart.color = payCart.sizeColor.slice(slashLoc+2);
        return payCart;
    }


}