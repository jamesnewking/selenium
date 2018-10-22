# Smoke test of theHundreds.com using JS/Selenium/Mocha/Chai and Page Object Model


## Before starting a selenium test
### make sure selenium server is running

> java -jar selenium-server-standalone-3.13.0.jar
##### make sure the selenium server port is set correctly

# to run test with mocha/chai and selenium
> make sure selenium server is running

> mocha hundreds_pom.js --timeout=100000 --firefox

> if there is no --firefox option, will run on chrome by default

> options of browsers to test are: --chrome --firefox --edge --ie --headlesschrome --headlessfirefox

> for edge, set the --timeout=200000 (edge is slow, need longer time to execute)

> for ie, make sure the system(not just the browser) display settings is set to 100% (scale and layout)

