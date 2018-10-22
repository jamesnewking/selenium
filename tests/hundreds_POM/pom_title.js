module.exports = class Title {
    constructor (driver){
        this.driver = driver;
        this.expectedTitleName = 'The Hundreds';
    };

    async actualWebTitle(){
        const webTitle = await this.driver.getTitle();
        return webTitle;
    }

    expectedTitle(){
        return this.expectedTitleName;
    }
}