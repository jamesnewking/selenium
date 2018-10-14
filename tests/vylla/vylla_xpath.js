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

    myVyllaNavHomes: { 'xpath' : '//*[@id="header"]/header/div/div[3]/a[1]/span[1]'},
    input_city: { 'xpath': '//*[@id="searchBox"]'},
    display_cityName: { 'xpath': '//*[@id="headerMorpher"]' },
    display_propertiesFound: { 'xpath': '//*[@id="srp-seo-h1-tag"]/span/span' },



}