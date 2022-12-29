const puppeteer = require('puppeteer')

async function bootstrap(options = {}) {
  const { devtools = false, slowMo = false, appUrl } = options
  const browser = await puppeteer.launch({
    headless: false,
    devtools,
    args: ['--disable-extensions-except=./extension', '--load-extension=./extension'],
    defaultViewport: null,
    ...(slowMo && { slowMo })
  })
  let appPage, extPage, optionPage

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
    await appPage.goto('https://google.com', { waitUntil: 'load' })
    return appPage
  }

  const launchExtPage = async () => {
    extPage = await browser.newPage()
    const targets = await browser.targets()
    const extensionTarget = targets.find((target) => target.type() === 'service_worker')
    const partialExtensionUrl = extensionTarget.url() || ''
    const [, , extensionId] = partialExtensionUrl.split('/')
    const extensionUrl = `chrome-extension://${extensionId}/popup.html`
    await extPage.goto(extensionUrl, { waitUntil: 'load' })
    return extPage
  }

  const launchOptionPage = async () => {
    optionPage = await browser.newPage()
    const targets = await browser.targets()
    const extensionTarget = targets.find((target) => target.type() === 'service_worker')
    const partialExtensionUrl = extensionTarget.url() || ''
    const [, , extensionId] = partialExtensionUrl.split('/')
    const optionUrl = `chrome-extension://${extensionId}/options.html#`
    await optionPage.goto(optionUrl, { waitUntil: 'load' })
    return optionPage
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
    optionPage,
    closePages
  }
}

module.exports = { bootstrap }
