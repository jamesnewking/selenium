module.exports = class SubCart {
    constructor (driver, webdriver){
        this.driver = driver;
        this.webdriver = webdriver;
        
        this.subCartPrice = { 'xpath' : '//*[@id="hlb-subcart"]/div[1]/span/span[2]'};
        this.cartButton =   { 'xpath' : '//*[@id="hlb-view-cart-announce"]'};

    };

    async getSubCartInfo(){
        let subPayCart = {};
        try{
            await this.driver.wait(this.webdriver.until.elementLocated( this.cartButton ), 5000);
        }catch{
            this.driver.sleep(3000);
        }
        let orderSummary = await this.driver.findElement( this.cartButton ).isDisplayed();
        if ( orderSummary ){
            subPayCart.price = await this.driver.findElement( this.subCartPrice ).getText().catch( () => console.log("Did not find sub cart price!") );
            await this.driver.findElement( this.cartButton ).click();
        };
        return subPayCart;
    }


}