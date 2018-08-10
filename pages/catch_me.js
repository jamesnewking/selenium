module.exports = function(browser){
    let catch_loc = {
        buttonA : '.button0',
        buttonB : '.button1',
        buttonC : '.button2',
        mapA: '#theMap > div > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > img',
        mapB: '#theMap > div > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(2) > img',
        mapC: '#theMap > div > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(3) > img',
    };
    this.overButtonA = function(){
        browser
            .moveToElement(catch_loc.buttonA,10,10)
    };
    this.overButtonB = function(){
        browser
            .moveToElement(catch_loc.buttonB,10,10)
    };
    this.overButtonC = function(){
        browser
            .moveToElement(catch_loc.buttonC,10,10)
    };
    this.clickMapA = function(){
        browser
            .moveToElement(catch_loc.mapA,10,10)
            .click(catch_loc.mapA);
    };
    this.clickMapB = function(){
        browser
            .moveToElement(catch_loc.mapB,10,10)
            .click(catch_loc.mapB);
    };
    this.clickMapC = function(){
        browser
            .moveToElement(catch_loc.mapC,10,10)
            .click(catch_loc.mapC);
    };
    this.scrollDown = function(){
        browser
            .execute('scrollTo(0,500)');
    };

    return this;
};