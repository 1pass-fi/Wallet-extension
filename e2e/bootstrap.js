const puppeteer = require('puppeteer')

async function bootstrap(options = {}) {
  const { devtools = false, slowMo = false, appUrl } = options
  const browser = await puppeteer.launch({
    headless: false,
    devtools,
    args: [
      '--disable-extensions-except=./extension',
      '--load-extension=./extension',
    ],
    defaultViewport: null,
    ...(slowMo && { slowMo }),
  })

  const appPage = await browser.newPage()
  await appPage.goto('https://google.com', { waitUntil: 'load' })

  const targets = await browser.targets()
  const extensionTarget = targets.find(target => target.type() === 'service_worker')
  const partialExtensionUrl = extensionTarget.url() || ''
  const [, , extensionId] = partialExtensionUrl.split('/')

  const extPage = await browser.newPage()
  const extensionUrl = `chrome-extension://${extensionId}/popup.html`
  await extPage.goto(extensionUrl, { waitUntil: 'load' })

  const optionPage = await browser.newPage()
  const optionUrl = `chrome-extension://${extensionId}/options.html#`
  await optionPage.goto(optionUrl, { waitUntil: 'load'})

  return {
    appPage,
    browser,
    extensionUrl,
    extPage,
    optionPage
  }
}

module.exports = { bootstrap }
