module.exports = class Advertisement {
    constructor (driver){
        this.driver = driver;
        this.adType = null;
        this.closeSplashAd1 = { 'xpath' : '//*[@id="bx-element-834546-PCW0QR6"]/button'};
        this.closeSplashAd2 = { 'xpath' : '//*[@id="bx-element-834545-ZCuZBvN"]/button'};
    };

    async checkSplashAd(){
        try {
            let splash1 = await this.driver.findElement( this.closeSplashAd1 ).isDisplayed();
            if (splash1) {
                this.adType = "splash1";
                await this.driver.findElement( this.closeSplashAd1 ).click();
            }
        }
        catch(err){
            try {
                this.adType = "splash2";
                await this.driver.findElement( this.closeSplashAd2 ).click();
            }catch(err){
                this.adType = "No splash ad!";
            }
        }

        return this.adType;

    }


}