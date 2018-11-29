module.exports = class Title {
    constructor (driver){
        this.driver = driver;
        this.expectedTitleName = 'Amazon.com: Online Shopping for Electronics, Apparel, Computers, Books, DVDs & more';
    };

    async actualWebTitle(){
        const webTitle = await this.driver.getTitle();
        return webTitle;
    }

    expectedTitle(){
        return this.expectedTitleName;
    }
}