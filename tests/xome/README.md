#Before starting a selenium test
##make sure selenium server is running

> java -jar selenium-server-standalone-3.13.0.jar
#####make sure the selenium server port is set correctly

###then run selenium test
> node xome_async.js


####to run Internet Explorer, make sure IEDriverServer_64.exe is running
> .withCapabilities(webdriver.Capabilities.ie())

####to run EDGE, make sure MicrosoftWebDriver.exe is running
> .withCapabilities(webdriver.Capabilities.edge())

> the browsers are: chrome, edge, firefox, ie, safari

#to run test with mocha/chai and selenium
> make sure selenium server is running

> mocha xome_mocha.js --timeout 100000

