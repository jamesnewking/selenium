# Smoke test of theHundreds.com using JS/Selenium/Mocha/Chai and Page Object Model


## Before starting a selenium test
### make sure selenium server is running

> java -jar selenium-server-standalone-3.13.0.jar
##### make sure the selenium server port is set correctly

# to run test with mocha/chai and selenium
> make sure selenium server is running

> mocha hundreds_pom.js --timeout=100000 --firefox --checkpix --ipadpro9 --ipadpro

> if there is no --firefox option, will run on chrome by default

> options of browsers to test are: --chrome --firefox --edge --ie --headlesschrome --headlessfirefox

> for edge, set the --timeout=200000 (edge is slow, need longer time to execute)

> for ie, make sure the system(not just the browser) display settings is set to 100% (scale and layout)

> the 3rd option: --checkpix is to verify all img on the main webpage have valid server response of 200; looking for broken img links; --none or nothing or any other commands will not run checkpix

> the 4th option: --ipadpro9 is to set the viewport to run the test; if no options set then it will default to --hd

> the 5th option: --ipadpro is to emulate a certain device on Chrome; common emulation options are: iphonex, iphone8plus, ipad, ipadpro, galaxys5; note that the viewport should be set larger than the emulation option


> issues:
1) in edge browser, the browser window size would not resize properly
