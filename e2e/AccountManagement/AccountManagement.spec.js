import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation, { goToWalletSettingPage } from '../utils/automation'
import { SECRET_PHRASES, WALLET_ADDRESS } from '../utils/testConstants'

/* TEST CASES */
describe('AccountManagement', () => {
  let optionPage, extPage, browser, context

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage
    browser = context.browser

    /* Import wallets */
    await Automation.importWallet(optionPage, TYPE.ETHEREUM)
    await Automation.importWallet(optionPage, TYPE.K2, SECRET_PHRASES.K2, false)
    await Automation.importWallet(optionPage, TYPE.SOLANA, SECRET_PHRASES.TYPE_SOLANA, false)
  }, 500000)

  describe('Display account information', () => {
    let accountCardETH, accountCardK2, accountCardSOL

    beforeAll(async () => {
      /* Move to wallet setting page */
      await goToWalletSettingPage(optionPage)

      /* Assign account cards*/
      accountCardETH = await optionPage.waitForXPath(
        `//div[contains(text(), "${WALLET_ADDRESS.ETHEREUM_SENDER}")]/ancestor::div[@data-testid="account-card-setting-page"]`
      )

      accountCardK2 = await optionPage.waitForXPath(
        `//div[contains(text(), "${WALLET_ADDRESS.K2_ADDRESS}")]/ancestor::div[@data-testid="account-card-setting-page"]`
      )

      accountCardSOL = await optionPage.waitForXPath(
        `//div[contains(text(), "${WALLET_ADDRESS.SOLANA_SENDER}")]/ancestor::div[@data-testid="account-card-setting-page"]`
      )

      /* */
    }, 500000)

    it('should display correct network', async () => {
      await Automation.swapToNetworkOption(
        optionPage,
        WALLET_ADDRESS.ETHEREUM_SENDER,
        'Goerli TestNet',
        accountCardETH
      )

      await Automation.swapToNetworkOption(
        optionPage,
        WALLET_ADDRESS.SOLANA_SENDER,
        'Devnet',
        accountCardSOL
      )

      extPage = await context.launchExtPage()
      await extPage.bringToFront()

      let displayAccount = await extPage.waitForSelector(
        `[data-testid="popup-header-displayingaccount"]`
      )

      await displayAccount.click()

      /* ETH NETWORK */
      const ethAccount = await extPage.waitForXPath(
        `//span[contains(text(), "0x660839")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      await ethAccount.click()

      let providerDropdown = await extPage.waitForSelector(`[data-testid="provider-dropdown"]`)
      let currentNetwork = await providerDropdown.$(`[data-testid="current-label"]`)

      expect(await currentNetwork.evaluate((el) => el.textContent)).toBe('Goerli TestNet')

      await extPage.close()

      /* SOL NETWORK */
      extPage = await context.launchExtPage()
      await extPage.bringToFront()

      displayAccount = await extPage.waitForSelector(
        `[data-testid="popup-header-displayingaccount"]`
      )
      await displayAccount.click()

      const solAccount = await extPage.waitForXPath(
        `//span[contains(text(), "9cGCJ")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      await solAccount.click()

      providerDropdown = await extPage.waitForSelector(`[data-testid="provider-dropdown"]`)
      currentNetwork = await providerDropdown.$(`[data-testid="current-label"]`)

      expect(await currentNetwork.evaluate((el) => el.textContent)).toBe('DEVNET')
      await extPage.close()

      /* K2 NETWORK */
      extPage = await context.launchExtPage()
      await extPage.bringToFront()

      displayAccount = await extPage.waitForSelector(
        `[data-testid="popup-header-displayingaccount"]`
      )
      await displayAccount.click()

      const k2Account = await extPage.waitForXPath(
        `//span[contains(text(), "32Dz2")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      await k2Account.click()

      providerDropdown = await extPage.waitForSelector(`[data-testid="provider-dropdown"]`)
      currentNetwork = await providerDropdown.$(`[data-testid="current-label"]`)

      expect(await currentNetwork.evaluate((el) => el.textContent)).toBe('TESTNET')
      await extPage.close()
    }, 100000)

    it('should display correct balance', () => {}, 100000)

    it('should display correct number of assets', () => {}, 100000)
  })

  describe('Copy address', () => {})
  describe('Change account name', () => {})
  describe('Change account password', () => {})

  // afterAll(async () => {
  //   await context.closePages()
  // })
})
