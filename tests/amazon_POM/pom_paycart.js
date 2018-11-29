module.exports = class PayCart {
    constructor (driver, webdriver){
        this.driver = driver;
        this.webdriver = webdriver;
        
        this.payCartTitle = { 'xpath' : '//*[@id="activeCartViewForm"]/div[2]/div/div[4]/div/div[1]/div/div/div[2]/ul/li[1]/span/a/span'};
        this.payCartPrice = { 'xpath' : '//*[@id="activeCartViewForm"]/div[2]/div/div[4]/div/div[2]/p/span'};    
    };

    async getFinalCartInfo(){
        let payCart = {};
        try{
            await this.driver.wait(this.webdriver.until.elementLocated( this.payCartTitle ), 5000);
        }catch{
            this.driver.sleep(3000);
        }
        payCart.title = await this.driver.findElement( this.payCartTitle ).getText();
        payCart.price = await this.driver.findElement( this.payCartPrice ).getText();
        return payCart;
    }


}