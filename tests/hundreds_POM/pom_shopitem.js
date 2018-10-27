module.exports = class ShopItem {
    constructor (driver, webdriver){
        this.driver = driver;
        this.webdriver = webdriver;
        this.firstItem = { 'css' : '#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(1) > a > div.flip-to-back'},
        this.firstItemTitle = { 'css' : '#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(1) > div > a'},
        this.firstItemPrice = { 'css' : '#PageContainer > main > div:nth-child(2) > div > div > div.grid-uniform > div:nth-child(1) > div > p > span'},

        this.singleItemTitle = { 'css' : '#PageContainer > main > div > div > div > div.clearfix.quickview-content > div.grid__item.main-info.animate.slide-left.animated > h1'},
        this.singleItemPrice = { 'css' : '#ProductPrice > span '},
        this.singleItemColor = { 'css' : '#AddToCartForm > div.swatch-panda.clearfix > div.panda-header > span'},
        
        this.singleItem1stColor = { 'xpath' : '//*[@id="AddToCartForm"]/div[3]/div[2]'},
        this.singleItme2ndColor = { 'xpath' : '//*[@id="AddToCartForm"]/div[3]/div[3]'},
       
        this.singleItemSizeS   = { 'css' : '#AddToCartForm > ul > li:nth-child(1) '},
        this.singleItemSizeM   = { 'css' : '#AddToCartForm > ul > li:nth-child(2) '},
        this.singleItemSizeL   = { 'css' : '#AddToCartForm > ul > li:nth-child(3) '},
        this.singleItemSizeXL  = { 'css' : '#AddToCartForm > ul > li:nth-child(4) '},
        this.singleItemSizeXXL = { 'css' : '#AddToCartForm > ul > li:nth-child(5) '},

        this.singleItemSize = { 'css' : '#AddToCartForm > div.sizes-header > span'},
        this.sizeMap = {
            'Small':'S',
            'Medium':'M',
            'Large':'L',
            'X Large':'XL',
            'XX Large':'XXL'
    }
        this.addToCart = { 'css' : '#AddToCart' }, //#AddToCartText
        this.buyItNow = { 'css' : '#AddToCartForm > div.shopify-payment-button > div > div > div > button' },

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

        await this.driver.wait( this.webdriver.until.elementLocated( this.firstItem ) );
        let itemTitle = await this.driver.findElement( this.firstItemTitle ).getText();
        let itemPrice = await this.driver.findElement( this.firstItemPrice).getText();

        await this.driver.findElement( this.firstItem ).click();
        return({gridItemTitle:itemTitle, gridItemPrice:itemPrice});

 }

    async addSingleItemToCart(){
        await this.driver.wait( this.webdriver.until.elementLocated( this.singleItemTitle ) );
        await this.driver.findElement( this.singleItme2ndColor ).click();
        await this.driver.findElement( this.singleItemSizeXXL ).click();
        let sizeXXLclass = await this.driver.findElement( this.singleItemSizeXXL ).getAttribute('class');
        console.log(`XXL class is: ${sizeXXLclass}`);
        if(sizeXXLclass.indexOf('disabled')>-1){
            console.log('this combination is sold out!');
        }
        await this.driver.findElement( this.singleItemSizeXL ).click();

        let singleItemTitle = await this.driver.findElement( this.singleItemTitle ).getText();
        let singleItemPrice = await this.driver.findElement( this.singleItemPrice ).getText();
        let singleItemColor = await this.driver.findElement( this.singleItemColor ).getText();
        let singleItemSize = await this.driver.findElement( this.singleItemSize ).getText();
        console.log('_________________');
        console.log(`${singleItemSize} maps to ${this.sizeMap[singleItemSize]}`);
        console.log('_________________');
        singleItemSize = this.sizeMap[singleItemSize];
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
        await this.driver.wait( this.webdriver.until.elementLocated( this.payCartTitle ) );
        let payCartTitle = await this.driver.findElement( this.payCartTitle ).getText();
        let payCartPrice = await this.driver.findElement( this.payCartPrice ).getText();
        let payCartSizeColor = await this.driver.findElement( this.payCartSizeColor ).getText();
        console.log(`the final pay cart title: ${payCartTitle}, price: ${payCartPrice}, size/color: ${payCartSizeColor}`)
        const slashLoc = payCartSizeColor.indexOf('/');
        console.log( slashLoc);
        const payCartSize = payCartSizeColor.slice(0,slashLoc-1);
        console.log( `size: ${payCartSize}`);
        const payCartColor = payCartSizeColor.slice(slashLoc+2);
        console.log( `color: ${payCartColor}`);
        return { payCartTitle: payCartTitle, payCartPrice: payCartPrice, payCartColor: payCartColor, payCartSize: payCartSize};
    }


}