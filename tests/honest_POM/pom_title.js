module.exports = class Title {
    constructor (driver){
        this.driver = driver;
        this.expectedTitleName = 'Natural Baby & Beauty Company | The Honest Company | The Honest Company';
    };

    async actualWebTitle(){
        const webTitle = await this.driver.getTitle();
        return webTitle;
    }

    expectedTitle(){
        return this.expectedTitleName;
    }
}