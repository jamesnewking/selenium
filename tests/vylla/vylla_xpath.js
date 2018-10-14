module.exports = {
    url: 'https://www.vylla.com',
    text: {
        mainPageTitle: 'Compare Home Loans and Search For Homes | Vylla',
    },

    signIn: {'xpath' :'//*[@id="header"]/header/div/div[1]/a/span[1]/span'},
    signInButton: { 'xpath' : '//*[@id="btnLogOn"]' },
    input_email: { 'xpath' : '//*[@id="UserName"]' },
    input_password: { 'xpath' : '//*[@id="Password"]' },

    myVyllaTitleXpath: { 'xpath' : '/html/body/div[2]/div/div/h2' },
    myVyllaTitleName: 'My Vylla',

    signedInUser: { 'xpath' : '//*[@id="header"]/header/div/div[1]/a/span[1]/span' },
    signOutLink: { 'xpath': '//*[@id="crr-sb"]/div[1]/a'},
    signedOutUserText: 'Sign In',

    myVyllaNavHomes: { 'xpath' : '//*[@id="header"]/header/div/div[3]/a[1]/span[1]'},
    input_city: { 'xpath': '//*[@id="searchBox"]'},
    display_cityName: { 'xpath': '//*[@id="headerMorpher"]' },
    display_propertiesFound: { 'xpath': '//*[@id="srp-seo-h1-tag"]/span/span' },

    resultsFirstProperty: { 'xpath': '/html/body/div[11]/div[2]/section/div[2]/section/div/div[1]/div[1]/div/a/div/div[1]'},
    resultsFirstPropertyAddr: { 'xpath': '/html/body/div[11]/div[2]/section/div[2]/section/div/div[1]/div[1]/div/a/div/div[2]/div[1]/div[3]/span/span[1]' },
    resultsFirstPropertyPrice: { 'xpath': '/html/body/div[11]/div[2]/section/div[2]/section/div/div[1]/div[1]/div/a/div/div[2]/div[1]/div[2]/span[1]' },
    resultsIndividualAddr: { 'xpath': '/html/body/div[3]/div[2]/div[1]/div[1]/h2'},
    resultsIndividualPrice: { 'xpath': '/html/body/div[3]/div[2]/div[2]/div/div/div/div[1]/div/span[1]'},
    resultsNumOfPictures: { 'xpath': '//*[@id="gallery-1"]/div[5]'},
    resultsNextPicture: { 'xpath': '/html/body/div[2]/div/div[2]'},

}