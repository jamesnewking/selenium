module.exports = class CheckPixURL {
    constructor (driver,webdriver,fetch){
        console.log('checkPix class started');
        this.driver = driver;
        this.webdriver = webdriver;
        this.fetch = fetch;
        this.lastElementOnPage = {'css' : `#navFooter > div.navFooterLine.navFooterLinkLine.navFooterPadItemLine.navFooterCopyright > ul > li.nav_first > a`};
    };

    async checkForValidLink(){
        let imageArr = await this.driver.findElements({'css': 'img'});
        let linkArr = await this.driver.findElements({'css': 'a'});
        console.log(`number of <img> tags: ${await imageArr.length}`);
        console.log(`number of <a> tags: ${await linkArr.length}`);
        await this.driver.executeScript("window.scrollTo(0,30000);");
        //await driver.sleep(1500);
        //let lastElementOnPage = {'css' : `#navFooter > div.navFooterLine.navFooterLinkLine.navFooterPadItemLine.navFooterCopyright > ul > li.nav_first > a`};
        await this.driver.wait( this.webdriver.until.elementIsVisible(this.driver.findElement( this.lastElementOnPage )), 30000 );
        await this.driver.executeScript("window.scrollTo(0,-30000);");
        let badPictureLink = false;
        for (let i = 0; i < imageArr.length; i++) {
            //console.log( await imageArr[i].getAttribute('src'));
            let imgUrl;
            try {
                imgUrl = await imageArr[i].getAttribute('src');
            }
            catch (err) {
                console.log("something wrong with this imgUrl #", i);
                badPictureLink = true;
                continue;
            }

            if (imgUrl == null) {
                console.log(`this imgUrl #${i} is null!`);
                continue;
            }

            //expect(imgUrl).to.be.a("string");//.catch(() => console.log(`this imgUrl: ${imgUrl} is not a string`));
            console.log(`${i}) `, imgUrl);
            this.fetch(imgUrl)
                .then(
                    (response) => {
                        if (response.status === 200) {
                            console.log(`${i})image link to ${imgUrl} is valid`);
                            return;
                        }
                    }
                )
                .catch(
                    (err) => {
                        console.log('the image link has error: ', err);
                        badPictureLink = true;
                    }
                );

            }
        await this.driver.sleep(6000);
        return badPictureLink;
    }

}