module.exports = class ShopItem {
    constructor (driver, webdriver, testingBrowser, gridItemNumber=1){
        this.driver = driver;
        this.webdriver = webdriver;
        this.testingBrowser = testingBrowser;
        this.gridItemNumber = gridItemNumber;

        this.itemElement =    { 'css' : `ul#s-results-list-atf > li`},

        this.selectItemSponsored =               { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/h5`};
        this.selectItemDivNumNotSponsor = 3;
        this.selectItemDivNumSponsor = 4;
        this.selectItemDivNum = 3;
        this.selectItem =                        { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[${this.selectItemDivNum}]/div[1]/a`};
        this.selectItemSponsor =                 { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[4]/div[1]/a`};
        this.selectItemNOTSponsor =                 { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[3]/div[1]/a`};
        //this.selectItemSponsored =               { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[4]/div[1]/a`};
        this.selectItemTitleDivNumNotSponsor = 3;
        this.selectItemTitleDivNumSponsor = 4;
        this.selectItemTitleDivNum = 3;
        this.selectItemTitle =                   { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[${this.selectItemTitleDivNum}]/div[1]/a/h2`};
        //this.selectItemTitleSponsored =          { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[4]/div[1]/a/h2`};
        this.selectItemPriceDollarsDivNumNotSponsor = 5;
        this.selectItemPriceDollarsDivNumSponsor = 6;
        this.selectItemPriceDollarsDivNum = 5;
        this.selectItemPriceDollars =            { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[${this.selectItemPriceDollarsDivNum}]/div[1]/a/span[2]/span/span`};
        //this.selectItemPriceDollarsSponsored =   { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[6]/div[1]/a/span[2]/span/span`};
        this.selectItemPriceCentsDivNumNotSponsor = 5;
        this.selectItemPriceCentsDivNumSponsor = 6;
        this.selectItemPriceCentsDivNum = 5;
        this.selectItemPriceCents =              { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[${this.selectItemPriceCentsDivNum}]/div[1]/a/span[2]/span/sup[2]`};
        //this.selectItemPriceCentsSponsored =     { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[6]/div[1]/a/span[2]/span/sup[2]`};

        this.singleItemTitle =                   { 'xpath' : '//*[@id="productTitle"]'};
        this.singleItemOurPrice =                { 'xpath' : '//*[@id="priceblock_ourprice"]'};
        this.singleItemBuyBoxPrice =             { 'xpath' : '//*[@id="price_inside_buybox"]'};
        this.addToCart =                         { 'xpath' : '//*[@id="add-to-cart-button"]'};
        //______________________________________
    };

    async scrollDownUpPage(){
        try{
            await this.driver.wait( this.webdriver.until.elementLocated( this.firstItem ), 5000 );
        }catch{
            await this.driver.sleep(3000);
        };
        await this.driver.executeScript("window.scrollTo(0,30000);");
        await this.driver.wait( this.webdriver.until.elementIsVisible( this.driver.findElement( this.lastElementOnPage )), 30000 );
        await this.driver.executeScript("window.scrollTo(0,-30000);");
        await this.driver.wait( this.webdriver.until.elementIsVisible( this.driver.findElement( this.firstItem )), 30000 );
    };

    resetGridItemNumber(newGridItemNumber){
        let originalGridNumber = this.gridItemNumber;
        this.gridItemNumber = newGridItemNumber;
        this.selectItemNOTSponsor =              { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[3]/div[1]/a`};
        this.selectItem =                        { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[${this.selectItemDivNum}]/div[1]/a`};
        this.selectItemTitle =                   { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[${this.selectItemTitleDivNum}]/div[1]/a/h2`};
        this.selectItemPriceDollars =            { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[${this.selectItemPriceDollarsDivNum}]/div[1]/a/span[2]/span/span`};
        this.selectItemPriceCents =              { 'xpath' : `//*[@id="result_${this.gridItemNumber}"]/div/div[${this.selectItemPriceCentsDivNum}]/div[1]/a/span[2]/span/sup[2]`};
        return originalGridNumber;
    };

    async iterateGridItems(){
        let count = 0;
        let skipTheseDivs = [3,7,11,17,22,26,28];
        //let isSponsored = false;
        let originalNumber = this.gridItemNumber;
        if (this.testingBrowser==='safari'){
            await this.driver.sleep(3000);
        }
        let allItemElements = await this.driver.findElements( this.itemElement );
        let numberOfItemsInGrid = allItemElements.length;
        let itemElement, itemTitle, itemPriceDollars, itemPriceCents;

        console.log(`Total number of items on this page: ${numberOfItemsInGrid}`);
        for (let i=0; i<numberOfItemsInGrid ;i++){
            
            if (skipTheseDivs.indexOf(i)>-1){
                continue;//top rated(3) or amazon's choice(7) or ad(11) or subscribe&save(17) or no prime(22,26)
            }
            this.resetGridItemNumber(i);

            let isNotSponsored = await this.driver.findElement( this.selectItemNOTSponsor ).catch( () => console.log('sponsored') );
            if(isNotSponsored){
                this.selectItemDivNum =             this.selectItemDivNumNotSponsor;
                this.selectItemTitleDivNum  =       this.selectItemTitleDivNumNotSponsor;
                this.selectItemPriceDollarsDivNum = this.selectItemPriceDollarsDivNumNotSponsor;
                this.selectItemPriceCentsDivNum =   this.selectItemPriceCentsDivNumNotSponsor;
            } 
            else {
                this.selectItemDivNum =             this.selectItemDivNumSponsor;
                this.selectItemTitleDivNum  =       this.selectItemTitleDivNumSponsor;
                this.selectItemPriceDollarsDivNum = this.selectItemPriceDollarsDivNumSponsor;
                this.selectItemPriceCentsDivNum =   this.selectItemPriceCentsDivNumSponsor;
            }

            this.resetGridItemNumber(i); 
            itemElement = await this.driver.findElement( this.selectItem );   
            itemTitle = await this.driver.findElement( this.selectItemTitle ).getText();
            itemPriceDollars = await this.driver.findElement( this.selectItemPriceDollars ).getText();
            itemPriceCents = await this.driver.findElement( this.selectItemPriceCents ).getText();
            console.log(`${++count}) $${itemPriceDollars}.${itemPriceCents} ${itemTitle} `);
            await this.driver.executeScript( "arguments[0].scrollIntoView(true);", itemElement );
        };
        this.resetGridItemNumber(originalNumber);
        return numberOfItemsInGrid;
    };

    async addOneItem(){
        let gridItem = {};
        await this.driver.executeScript("window.scrollTo(0,-19000);");
        let elementLoc = await this.driver.wait( this.webdriver.until.elementLocated( this.selectItemTitle ),3000);
        await this.driver.executeScript( "arguments[0].scrollIntoView(false);", elementLoc );
        gridItem.title = await this.driver.findElement( this.selectItemTitle ).getText();
        gridItem.priceDollars = await this.driver.findElement( this.selectItemPriceDollars).getText();
        gridItem.priceCents = await this.driver.findElement( this.selectItemPriceCents).getText();
        await this.driver.findElement( this.selectItem ).click();
        return gridItem;

 }

    async addSingleItemToCart(){
        let singleItem = {};
        singleItem.title =          await this.driver.findElement( this.singleItemTitle ).getText();
        singleItem.ourPrice =       await this.driver.findElement( this.singleItemOurPrice ).getText();
        singleItem.buyBoxPrice =    await this.driver.findElement( this.singleItemBuyBoxPrice ).getText();
        await this.driver.findElement(this.addToCart).click();
        
        return singleItem;

    }

    async getSmallCartInfo(){
        let smallCart = {};
        await this.driver.wait( this.webdriver.until.elementLocated( this.smallCartTitle ) );
        smallCart.smallCartTitle = await this.driver.findElement( this.smallCartTitle ).getText();
        smallCart.smallCartPrice = await this.driver.findElement( this.smallCartPrice ).getText();
        smallCart.smallCartColor = await this.driver.findElement( this.smallCartColor ).getText();
        smallCart.smallCartSize = await this.driver.findElement( this.smallCartSize ).getText();
        
        console.log(`small cart: ${smallCart.smallCartTitle}`);
        console.log(`small cart: ${smallCart.smallCartPrice}`);
        console.log(`small cart: ${smallCart.smallCartColor}`);
        console.log(`small cart: ${smallCart.smallCartSize}`);
        return smallCart;
    }

}