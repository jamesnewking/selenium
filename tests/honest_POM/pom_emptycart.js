module.exports = class EmptyCart {
    constructor (driver){
        this.driver = driver;
        this.cartEmptyItems = { 'xpath' : '/html/body/div[2]/div/div[5]/div/div/div[2]/div[2]/div[2]/div[2]/a'};
        this.cartEmptyMessage = { 'xpath' : '/html/body/div[2]/div/div[5]/div'};
        this.cartEmptySubtotal = { 'xpath' : '/html/body/div[2]/div/div[6]/div[2]/div[1]/div[2]'};
        this.message = `You have no items in your cart.`;
        this.price = `$0.00`;

    };

    async clickEmptyCart(){
        await this.driver.findElement( this.cartEmptyItems ).click();
    };

    async cartMessage(){
        let emptyCartMsg = await this.driver.findElement( this.cartEmptyMessage ).getText();
        return emptyCartMsg;
    };

    async cartPrice(){
        let emptyCartPrice = await this.driver.findElement( this.cartEmptySubtotal ).getText();
        emptyCartPrice = emptyCartPrice.trim();
        return emptyCartPrice;
    };

    expectedMsg(){
        return this.message;
    };

    expectedPrice(){
        return this.price;
    }

}