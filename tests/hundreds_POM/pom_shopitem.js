module.exports = class ShopItem {
    constructor (driver, webdriver, gridItemNumber){
        this.driver = driver;
        this.webdriver = webdriver;

        this.firstItem =      { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${gridItemNumber}) > a > div`},//.flip-to-back
        this.firstItemTitle = { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${gridItemNumber}) > div > a`},
        this.firstItemPrice = { 'css' : `#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(${gridItemNumber}) > div > p > span`},

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
        this.addToCart = { 'css' : '#AddToCart' }, //#AddToCartText
        this.addToCartText = { 'css' : '#AddToCartText' },
        this.buyItNow = { 'css' : '#AddToCartForm > div.shopify-payment-button > div > div > div > button' },
        this.morePaymentOptions = { 'css' : 'button.shopify-payment-button__more-options'},
        this.showOrderSummary = { 'css': 'body > button > span > span > span.order-summary-toggle__text.order-summary-toggle__text--show'},

        this.smallCartTitle = { 'css' : '#cart_form > div.products > div > div.desktop > div.right > div.info > a'},
        this.smallCartColor = { 'css' : '#cart_form > div.products > div > div.desktop > div.right > div.options > div.color'},
        this.smallCartSize =  { 'css' :'#cart_form > div.products > div > div.desktop > div.right > div.options > div.size'},
        this.smallCartPrice = { 'css' : '#cart_form > div.products > div > div.next-line > p'},
        this.smallCartCheckout = { 'css' : '#cart_form > div.has-items.first > a.btn.secondary.submit'},

        this.payCartTitle = { 'css' : '#order-summary > div > div.order-summary__section.order-summary__section--product-list > div > table > tbody > tr > td.product__description > span.product__description__name.order-summary__emphasis'},
        this.payCartPrice = { 'css' : '#order-summary > div > div.order-summary__section.order-summary__section--product-list > div > table > tbody > tr > td.product__price > span'},
        this.payCartSizeColor = { 'css' : '#order-summary > div > div.order-summary__section.order-summary__section--product-list > div > table > tbody > tr > td.product__description > span.product__description__variant.order-summary__small-text'}

    };

    async addOneItem(){

        await this.driver.wait( this.webdriver.until.elementLocated( this.firstItemTitle ) );
        await this.driver.sleep(1000);//needed for mobile viewports

        let itemTitle = await this.driver.findElement( this.firstItemTitle ).getText();
        let itemPrice = await this.driver.findElement( this.firstItemPrice).getText();

        await this.driver.findElement( this.firstItem ).click();
        return({gridItemTitle:itemTitle, gridItemPrice:itemPrice});

 }

    /*
    /   adds a single item to the shopping cart
    /   size defaults to 0; 0 = S, 1 = M , 2 = L , 3 = XL , 4 = XXL;
    /   color defaults to 0; 0 is the 1st availble color, 1 is the 2nd available color
    */
    async addSingleItemToCart(size=0,color=0){
        await this.driver.wait( this.webdriver.until.elementLocated( this.singleItemPic ) );
        await this.driver.executeScript("window.scrollTo(0,19000);");
        let itemBuyElementLoc = await this.driver.findElement( this.buyItNow );
        await this.driver.executeScript( "arguments[0].scrollIntoView(false);", itemBuyElementLoc );
        
        await this.driver.findElement( this.singleColorArr[color] ).click();
        await this.driver.findElement( this.singleSizeArr[size] ).click();
        let selectedSizeClass = await this.driver.findElement( this.singleSizeArr[size] ).getAttribute('class');
        if(selectedSizeClass.indexOf('disabled')>-1){
            console.log('this combination is sold out!');
        };
        let singleItemTitle = await this.driver.findElement( this.singleItemTitle ).getText();
        let singleItemPrice = await this.driver.findElement( this.singleItemPrice ).getText();
        let singleItemColor = await this.driver.findElement( this.singleItemColor ).getText();
        let singleItemSize  = await this.driver.findElement( this.singleItemSize ).getText();
        let colorElements  = await this.driver.findElements( this.singleItemColorSelection );
        let numberOfColors = colorElements.length -1;
        console.log(`number of colors is: ${numberOfColors}`);
        console.log('_________________');
        console.log(`${singleItemSize} maps to ${this.sizeMap[singleItemSize]}`);
        console.log('_________________');
        singleItemSize = this.sizeMap[singleItemSize];
        let buyItNowDisabled = await this.driver.findElement( this.buyItNow ).getAttribute('disabled');
        if (buyItNowDisabled){
            console.log('can not buy it now');
            let addToCartText = await this.driver.findElement( this.addToCartText ).getText();
            console.log(`this combo is: ${addToCartText}`);
            console.log(`**defaulting to selecting size S, 1st color combo**`);
            await this.driver.findElement( this.singleColorArr[0] ).click();
            await this.driver.findElement( this.singleSizeArr[0] ).click();
        }
        let morePaymentOptions = await this.driver.findElement( this.morePaymentOptions ).isDisplayed();
        if ( morePaymentOptions ){
            await this.driver.findElement( this.morePaymentOptions ).click();
        };
        await this.driver.findElement( this.buyItNow ).click();
        return { singleTitle: singleItemTitle, singlePrice: singleItemPrice, singleColor: singleItemColor, singleSize: singleItemSize};

    }

    async getSmallCartInfo(){
        //await this.driver.sleep(3000);
        await this.driver.wait( this.webdriver.until.elementLocated( this.smallCartTitle ) );
        let smallCartTitle = await this.driver.findElement( this.smallCartTitle ).getText();
        let smallCartPrice = await this.driver.findElement( this.smallCartPrice ).getText();
        let smallCartColor = await this.driver.findElement( this.smallCartColor ).getText();
        let smallCartSize = await this.driver.findElement( this.smallCartSize ).getText();
        await this.driver.findElement( this.addToCart ).click();
        return { smallCartTitle: smallCartTitle, smallCartPrice: smallCartPrice, smallCartColor: smallCartColor, smallCartSize: smallCartSize};
    }

    async getFinalCartInfo(){
        let orderSummaryDropdown = await this.driver.findElement( this.showOrderSummary ).isDisplayed();
        if ( orderSummaryDropdown ){
            await this.driver.findElement( this.showOrderSummary ).click();
        };

        await this.driver.wait( this.webdriver.until.elementLocated( this.payCartTitle ) );
        let payCartTitle = await this.driver.findElement( this.payCartTitle ).getText();
        let payCartPrice = await this.driver.findElement( this.payCartPrice ).getText();
        let payCartSizeColor = await this.driver.findElement( this.payCartSizeColor ).getText();
        console.log(`the final pay cart title: ${payCartTitle}, price: ${payCartPrice}, size/color: ${payCartSizeColor}`)
        const slashLoc = payCartSizeColor.lastIndexOf('/');
        //console.log( slashLoc);
        const payCartSize = payCartSizeColor.slice(0,slashLoc-1);
        //console.log( `size: ${payCartSize}`);
        const payCartColor = payCartSizeColor.slice(slashLoc+2);
        //console.log( `color: ${payCartColor}`);
        return { payCartTitle: payCartTitle, payCartPrice: payCartPrice, payCartColor: payCartColor, payCartSize: payCartSize};
    }


}