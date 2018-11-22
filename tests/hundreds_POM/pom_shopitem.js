module.exports = class ShopItem {
    constructor (driver, webdriver, testingBrowser, gridItemNumber=1){
        this.driver = driver;
        this.webdriver = webdriver;
        this.testingBrowser = testingBrowser;
        this.gridItemNumber = gridItemNumber;

        this.itemElement =    { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div`},
        this.selectItem =      { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${this.gridItemNumber}) > a > div`},//.flip-to-back
        this.selectItemTitle = { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${this.gridItemNumber}) > div > a`},
        this.selectItemPrice = { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${this.gridItemNumber}) > div > p > span`},
              
        this.firstItem = { 'css' : '#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(1) > a > div.flip-to-back > img.front-image'},
        this.lastElementOnPage = {'css' : `#PageContainer > footer > div > div > div.grid__item.large--six-twelfths > div.footer-newsletter`},

        this.desktopSingleItemPic = { 'css' : '#desktop_product_carousel > div > div > span.is-selected > img.original'},
        this.singleItemPic = { 'css' : '#mobile_product_carousel > div > div > img.is-selected'},//for mobile
        this.singleItemTitle = { 'css' : '#PageContainer > main > div > div > div > div.clearfix.quickview-content > div.grid__item.main-info.animate.slide-left.animated > h1'},
        this.singleItemPrice = { 'css' : '#ProductPrice > span '},
        this.singleItemColor = { 'css' : '#AddToCartForm > div.swatch-panda.clearfix > div.panda-header > span'},
        this.singleItemColorSelection = { 'xpath' : '//*[@id="AddToCartForm"]/div[3]/div'},

        this.singleItem1stColor = { 'xpath' : '//*[@id="AddToCartForm"]/div[3]/div[2]'},
        this.singleItme2ndColor = { 'xpath' : '//*[@id="AddToCartForm"]/div[3]/div[3]'},
        this.singleItem3rdColor = { 'xpath' : '//*[@id="AddToCartForm"]/div[3]/div[4]'},
        this.singleColorArr = [
            this.singleItem1stColor,
            this.singleItme2ndColor,
            this.singleItem3rdColor
        ],

        this.singleItemSizeS   = { 'css' : '#AddToCartForm > ul > li:nth-child(1) '},
        this.singleItemSizeM   = { 'css' : '#AddToCartForm > ul > li:nth-child(2) '},
        this.singleItemSizeL   = { 'css' : '#AddToCartForm > ul > li:nth-child(3) '},
        this.singleItemSizeXL  = { 'css' : '#AddToCartForm > ul > li:nth-child(4) '},
        this.singleItemSizeXXL = { 'css' : '#AddToCartForm > ul > li:nth-child(5) '},
        this.singleSizeArr = [
            this.singleItemSizeS,
            this.singleItemSizeM,
            this.singleItemSizeL,
            this.singleItemSizeXL,
            this.singleItemSizeXXL
        ],

        this.singleItemSize = { 'css' : '#AddToCartForm > div.sizes-header > span'},
        this.sizeMap = {
            'Small':'S',
            'Medium':'M',
            'Large':'L',
            'X Large':'XL',
            'XX Large':'XXL',
            'One Size':'O/S',
            'N/A':'N/A'
    }
        this.addToCart = { 'css' : '#AddToCart' },
        this.addToCartText = { 'css' : '#AddToCartText' },
        this.buyItNow = { 'css' : '#AddToCartForm > div.shopify-payment-button > div > div > div > button' },
        this.morePaymentOptions = { 'css' : 'button.shopify-payment-button__more-options'},
        this.checkoutButton = { 'css' : 'body > div.shopify-cleanslate > div > span > div > div > div:nth-child(2) > div > div > div:nth-child(2) > div > button'},

        //#cart_form > div.products > div:nth-child(1) > div.desktop > div.right > div.info > a
        //if multiple items in small cart
        this.smallCartTitle = { 'css' : '#cart_form > div.products > div > div.desktop > div.right > div.info > a'},
        this.smallCartColor = { 'css' : '#cart_form > div.products > div > div.desktop > div.right > div.options > div.color'},
        this.smallCartSize =  { 'css' :'#cart_form > div.products > div > div.desktop > div.right > div.options > div.size'},
        this.smallCartPrice = { 'css' : '#cart_form > div.products > div > div.next-line > p'},
        this.smallCartCheckout = { 'css' : '#cart_form > div.has-items.first > a.btn.secondary.submit'}
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
        this.selectItem =      { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${this.gridItemNumber}) > a > div`};//.flip-to-back
        this.selectItemTitle = { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${this.gridItemNumber}) > div > a`};
        this.selectItemPrice = { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${this.gridItemNumber}) > div > p > span`};
        return originalGridNumber;
    };

    async iterateGridItems(){

        let originalNumber = this.gridItemNumber;
        if (this.testingBrowser==='safari'){
            await this.driver.sleep(3000);
        }
        let allItemElements = await this.driver.findElements( this.itemElement );
        let numberOfItemsInGrid = allItemElements.length;
        let itemElement, itemTitle, itemPrice;

        console.log(`Total number of items on this page: ${numberOfItemsInGrid}`);
        for (let i=1; i<numberOfItemsInGrid+1 ;i++){
            this.resetGridItemNumber(i); 
            itemElement = await this.driver.findElement( this.selectItem );   
            itemTitle = await this.driver.findElement( this.selectItemTitle ).getText();
            itemPrice = await this.driver.findElement( this.selectItemPrice ).getText();
            console.log(`${i}) ${itemTitle} ${itemPrice}`);
            await this.driver.executeScript( "arguments[0].scrollIntoView(true);", itemElement );
        };
        this.resetGridItemNumber(originalNumber);
        return numberOfItemsInGrid;
    };

    async addOneItem(){
        let gridItem = {};
        await this.driver.wait( this.webdriver.until.elementIsVisible( this.driver.findElement( this.selectItemTitle )), 30000);
        gridItem.title = await this.driver.findElement( this.selectItemTitle ).getText();
        gridItem.price = await this.driver.findElement( this.selectItemPrice).getText();
        await this.driver.findElement( this.selectItem ).click();
        return gridItem;

 }

    /*
    /   adds a single item to the shopping cart
    /   size defaults to 0; 0 = S, 1 = M , 2 = L , 3 = XL , 4 = XXL;
    /   color defaults to 0; 0 is the 1st availble color, 1 is the 2nd available color
    */
    async addSingleItemToCart(size=0,color=0){
        let singleItem = {};
        try {
            await this.driver.wait( this.webdriver.until.elementLocated( this.singleItemPic ), 3000 );
            await this.driver.wait( this.webdriver.until.elementIsVisible( this.driver.findElement( this.singleItemPic )), 3000 );
        } catch (error) {
            await this.driver.wait( this.webdriver.until.elementLocated( this.desktopSingleItemPic ), 3000 );
            await this.driver.wait( this.webdriver.until.elementIsVisible( this.driver.findElement( this.desktopSingleItemPic )), 3000 );
        }
        await this.driver.executeScript("window.scrollTo(0,19000);");
        let itemBuyElementLoc = await this.driver.wait( this.webdriver.until.elementLocated( this.buyItNow ),3000);
        await this.driver.executeScript( "arguments[0].scrollIntoView(false);", itemBuyElementLoc );
        await this.driver.findElement( this.singleColorArr[color] ).click();
        await this.driver.findElement( this.singleSizeArr[size] ).click();
        let selectedSizeClass = await this.driver.findElement( this.singleSizeArr[size] ).getAttribute('class');
        if(selectedSizeClass.indexOf('disabled')>-1){
            console.log('this combination is sold out!');
        };
        singleItem.title = await this.driver.findElement( this.singleItemTitle ).getText();
        singleItem.price = await this.driver.findElement( this.singleItemPrice ).getText();
        singleItem.color = await this.driver.findElement( this.singleItemColor ).getText();
        singleItem.size  = await this.driver.findElement( this.singleItemSize ).getText();

        let colorElements  = await this.driver.findElements( this.singleItemColorSelection );
        let numberOfColors = colorElements.length -1;
        console.log(`number of colors is: ${numberOfColors}`);
        console.log('_________________');
        console.log(`${singleItem.size} maps to ${this.sizeMap[singleItem.size]}`);
        console.log('_________________');
        singleItem.size = this.sizeMap[singleItem.size];
        let buyItNowDisabled = await this.driver.findElement( this.buyItNow ).getAttribute('disabled');
        if (buyItNowDisabled){
            console.log('can not buy it now');
            let addToCartText = await this.driver.findElement( this.addToCartText ).getText();
            console.log(`this combo is: ${addToCartText}`);
            console.log(`**defaulting to selecting size S, 1st color combo**`);
            await this.driver.findElement( this.singleColorArr[0] ).click();
            await this.driver.findElement( this.singleSizeArr[0] ).click();
        }
        await this.driver.findElement( this.addToCart ).click();
        if (this.testingBrowser === 'safari'){
            let morePaymentIsVisible = await this.driver.wait(this.webdriver.until.elementLocated( this.morePaymentOptions ), 2000 ).isDisplayed();
            console.log(`is morePayment visible? ${morePaymentIsVisible}`);
            await this.driver.findElement( this.buyItNow ).click();
            if(morePaymentIsVisible){
                console.log(`alternate payment options like amazon pay`);
                await this.driver.switchTo().activeElement();//debug
                await this.driver.wait( this.webdriver.until.elementIsVisible(this.driver.findElement(this.checkoutButton)), 2500);
                await this.driver.findElement( this.checkoutButton ).click();
            }
        } else {
            let smallCart = await this.getSmallCartInfo();
            console.log(`testing small cart`);
            console.log(smallCart);
            await this.driver.findElement( this.smallCartCheckout ).click();
        }
        return singleItem;

    }

    async getSmallCartInfo(){
        //await this.driver.switchTo().activeElement();
        //await this.driver.switchTo().defaultContent();
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