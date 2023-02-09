const puppeteer = require('puppeteer')
const path = require('path')

async function bootstrap(options = {}) {
  const { devtools = false, slowMo = false, appUrl } = options
  const pathToExtension = path.join(__dirname, '..', 'extension')
  const browser = await puppeteer.launch({
    headless: false,
    devtools,
    args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
    defaultViewport: null,
    ...(slowMo && { slowMo })
  })
  let appPage, extPage, optionPage, testDappPage

  // wait until the option page loaded
  while ((await browser.pages()).length <= 1) {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 500)
    )
  }
  optionPage = await browser.pages().then((allPages) => allPages[1])

  const launchAppPage = async () => {
    appPage = await browser.newPage()
    await appPage.goto('https://google.com', { waitUntil: 'networkidle0' })
    return appPage
  }

  const launchExtPage = async (options = {}) => {
    const { popupPageLink = '' } = options
    extPage = await browser.newPage()
    const targets = await browser.targets()
    const extensionTarget = targets.find((target) => target.type() === 'service_worker')
    const partialExtensionUrl = extensionTarget.url() || ''
    const [, , extensionId] = partialExtensionUrl.split('/')
    const extensionUrl = `chrome-extension://${extensionId}/popup.html#/${popupPageLink}`
    await extPage.goto(extensionUrl, { waitUntil: 'networkidle0' })
    return extPage
  }

  const launchOptionPage = async (options = {}) => {
    const { optionPageLink } = options
    optionPage = await browser.newPage()
    const targets = await browser.targets()
    const extensionTarget = targets.find((target) => target.type() === 'service_worker')
    const partialExtensionUrl = extensionTarget.url() || ''
    const [, , extensionId] = partialExtensionUrl.split('/')
    const optionUrl = `chrome-extension://${extensionId}/options.html#/${optionPageLink}`
    await optionPage.goto(optionUrl, { waitUntil: 'networkidle0' })
    return optionPage
  }

  const launchTestDappPage = async (options = {}) => {
    testDappPage = await browser.newPage()
    const testDappUrl = 'http://localhost:3000'
    await testDappPage.goto(testDappUrl, { waitUntil: 'networkidle0' })
    return testDappPage
  }

  const closePages = async () => {
    await browser.close()
  }

  return {
    browser,
    launchAppPage,
    appPage,
    launchExtPage,
    extPage,
    launchOptionPage,
    testDappPage,
    launchTestDappPage,
    optionPage,
    closePages
  }
}

module.exports = { bootstrap }
