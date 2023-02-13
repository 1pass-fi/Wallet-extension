import { TYPE } from '../../src/constants/accountConstants'
import formatLongString from '../../src/options/utils/formatLongString'
import { bootstrap } from '../bootstrap'
import Automation, { goToWalletSettingPage } from '../utils/automation'
import { CUSTOM_TOKEN_ADDRESS, SECRET_PHRASES, WALLET_ADDRESS } from '../utils/testConstants'

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
    }, 500000)

    it('should display correct account information ETH', async () => {
      extPage = await context.launchExtPage()
      await extPage.bringToFront()
      const displayAccount = await extPage.waitForSelector(
        `[data-testid="popup-header-displayingaccount"]`
      )

      await displayAccount.click()

      const ethAccount = await extPage.waitForXPath(
        `//span[contains(text(), "0x660839")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      await ethAccount.click()

      /* IMPORT CUSTOM TOKEN */
      const goToImportToken = await extPage.waitForSelector(`[data-testid="Tokens"]`)
      await goToImportToken.click()

      const importTokenButton = await extPage.$(`[data-testid="import-token-button"]`)
      await importTokenButton.click()

      const searchInputField = await extPage.waitForSelector(`input`)
      await searchInputField.type(CUSTOM_TOKEN_ADDRESS.ETH_UNI_TOKEN)

      const UNITokenOption = await extPage.waitForSelector(`[data-testid="UNI"]`)
      await UNITokenOption.click()

      const selectAccountCheckbox = await extPage.waitForSelector('div[role="checkbox"]')
      await selectAccountCheckbox.click()

      const [confirmButton] = await extPage.$x('//button[text()="Confirm"]')
      await confirmButton.click()

      await extPage.waitForSelector('[data-testid="popup-loading-screen"]', {
        visible: true
      })

      await extPage.waitForSelector('[data-testid="popup-loading-screen"]', {
        hidden: true
      })

      await extPage.close()
      await optionPage.reload({ waitUntil: 'networkidle0' })

      /* ASSIGN ACCOUNT CARD VALUE */
      accountCardETH = await optionPage.waitForXPath(
        `//div[contains(text(), "${WALLET_ADDRESS.ETHEREUM_SENDER}")]/ancestor::div[@data-testid="account-card-setting-page"]`
      )

      /* CHECK ETH BALANCE */
      const balance = await accountCardETH.$(`[data-testid="account-card-balance"]`)
      const balanceText = await balance.evaluate((el) => el.textContent)
      const mainBalance = balanceText.split(' ')[1]
      const mainSymbol = balanceText.split(' ')[2]

      expect(Number(mainBalance)).toBeGreaterThan(0)
      expect(mainSymbol).toBe('ETH')

      const extendButton = await accountCardETH.$(
        `[data-testid="account-card-drop-down-${WALLET_ADDRESS.ETHEREUM_SENDER}"]`
      )
      await extendButton.click()

      const accountBalances = await accountCardETH.$(`[data-testid="account-card-account-balance"]`)
      const accountBalanceMain = await accountBalances.$(
        `[data-testid="account-card-account-balance-ETH"]`
      )
      let tokenBalance, tokenSymbol
      tokenBalance = (await accountBalanceMain.evaluate((el) => el.textContent)).split(' ')[0]
      tokenSymbol = (await accountBalanceMain.evaluate((el) => el.textContent)).split(' ')[1]
      expect(Number(tokenBalance)).toBeGreaterThan(0)
      expect(Number(tokenBalance)).toEqual(Number(mainBalance))
      expect(tokenSymbol).toBe('ETH')

      /* CHECK UNI BALANCE */
      const accountBalanceCustom = await accountBalances.$(
        `[data-testid="account-card-account-balance-UNI"]`
      )
      tokenBalance = (await accountBalanceCustom.evaluate((el) => el.textContent)).split(' ')[0]
      tokenSymbol = (await accountBalanceCustom.evaluate((el) => el.textContent)).split(' ')[1]
      expect(Number(tokenBalance)).toBeGreaterThan(0)
      expect(tokenSymbol).toBe('UNI')

      /* CHECK ETH ASSETS */
      const assets = await accountCardETH.$(`[data-testid="account-card-assets"]`)
      const assetsText = await assets.evaluate((el) => el.textContent)
      const assetsValue = assetsText.split(' ')[1]
      expect(Number(assetsValue)).toBeGreaterThanOrEqual(0)

      const nftAssets = await accountCardETH.$(`[data-testid="account-card-nft-assets"]`)
      const nftAssetsText = await nftAssets.evaluate((el) => el.textContent)
      const [nftAssetsValue, nftAssetsSymbol] = nftAssetsText.split(' ')
      expect(Number(nftAssetsValue)).toBeGreaterThanOrEqual(0)
      expect(Number(nftAssetsValue)).toEqual(Number(assetsValue))
      expect(nftAssetsSymbol).toBe('ETH')
    }, 500000)

    it('should display correct account information SOL', async () => {
      extPage = await context.launchExtPage()
      await extPage.bringToFront()
      const displayAccount = await extPage.waitForSelector(
        `[data-testid="popup-header-displayingaccount"]`
      )

      await displayAccount.click()

      const solAccount = await extPage.waitForXPath(
        `//span[contains(text(), "9cGCJ")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      await solAccount.click()

      /* IMPORT CUSTOM TOKEN */
      const goToImportToken = await extPage.waitForSelector(`[data-testid="Tokens"]`)
      await goToImportToken.click()

      const importTokenButton = await extPage.$(`[data-testid="import-token-button"]`)
      await importTokenButton.click()

      const searchInputField = await extPage.waitForSelector(`input`)
      await extPage.waitForTimeout(5000)

      await searchInputField.type(CUSTOM_TOKEN_ADDRESS.SOL_USDC_TOKEN)

      const USDCTokenOption = await extPage.waitForSelector(`[data-testid="USDC"]`)
      await USDCTokenOption.click()

      let selectAccountCheckbox = await extPage.waitForSelector('div[role="checkbox"]')
      await selectAccountCheckbox.click()

      let [confirmButton] = await extPage.$x('//button[text()="Confirm"]')
      await confirmButton.click()

      await extPage.waitForSelector('[data-testid="popup-loading-screen"]', {
        visible: true
      })

      await extPage.waitForSelector('[data-testid="popup-loading-screen"]', {
        hidden: true
      })

      await extPage.close()
      await optionPage.reload({ waitUntil: 'networkidle0' })

      /* ASSIGN ACCOUNT CARD VALUE */
      accountCardSOL = await optionPage.waitForXPath(
        `//div[contains(text(), "${WALLET_ADDRESS.SOLANA_SENDER}")]/ancestor::div[@data-testid="account-card-setting-page"]`
      )

      /* CHECK SOL BALANCE */
      const balance = await accountCardSOL.$(`[data-testid="account-card-balance"]`)
      const balanceText = await balance.evaluate((el) => el.textContent)
      const mainBalance = balanceText.split(' ')[1]
      const mainSymbol = balanceText.split(' ')[2]

      expect(Number(mainBalance)).toBeGreaterThan(0)
      expect(mainSymbol).toBe('SOL')

      const extendButton = await accountCardSOL.$(
        `[data-testid="account-card-drop-down-${WALLET_ADDRESS.SOLANA_SENDER}"]`
      )
      await extendButton.click()

      const accountBalances = await accountCardSOL.$(`[data-testid="account-card-account-balance"]`)
      const accountBalanceMain = await accountBalances.$(
        `[data-testid="account-card-account-balance-SOL"]`
      )
      let tokenBalance, tokenSymbol
      tokenBalance = (await accountBalanceMain.evaluate((el) => el.textContent)).split(' ')[0]
      tokenSymbol = (await accountBalanceMain.evaluate((el) => el.textContent)).split(' ')[1]
      expect(Number(tokenBalance)).toBeGreaterThan(0)
      expect(Number(tokenBalance)).toEqual(Number(mainBalance))
      expect(tokenSymbol).toBe('SOL')

      /* CHECK USDC BALANCE */
      const accountBalanceCustom = await accountBalances.$(
        `[data-testid="account-card-account-balance-USDC"]`
      )
      tokenBalance = (await accountBalanceCustom.evaluate((el) => el.textContent)).split(' ')[0]
      tokenSymbol = (await accountBalanceCustom.evaluate((el) => el.textContent)).split(' ')[1]
      expect(Number(tokenBalance)).toBeGreaterThan(0)
      expect(tokenSymbol).toBe('USDC')

      /* CHECK ETH ASSETS */
      const assets = await accountCardSOL.$(`[data-testid="account-card-assets"]`)
      const assetsText = await assets.evaluate((el) => el.textContent)
      const assetsValue = assetsText.split(' ')[1]
      expect(Number(assetsValue)).toBeGreaterThanOrEqual(0)

      const nftAssets = await accountCardSOL.$(`[data-testid="account-card-nft-assets"]`)
      const nftAssetsText = await nftAssets.evaluate((el) => el.textContent)
      const [nftAssetsValue, nftAssetsSymbol] = nftAssetsText.split(' ')
      expect(Number(nftAssetsValue)).toBeGreaterThanOrEqual(0)
      expect(Number(nftAssetsValue)).toEqual(Number(assetsValue))
      expect(nftAssetsSymbol).toBe('SOL')
    }, 500000)

    it('should display correct account information K2', async () => {
      extPage = await context.launchExtPage()
      await extPage.bringToFront()
      const displayAccount = await extPage.waitForSelector(
        `[data-testid="popup-header-displayingaccount"]`
      )

      await displayAccount.click()

      const k2Account = await extPage.waitForXPath(
        `//span[contains(text(), "32Dz2")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      await k2Account.click()

      /* IMPORT CUSTOM TOKEN */
      const goToImportToken = await extPage.waitForSelector(`[data-testid="Tokens"]`)
      await goToImportToken.click()

      const importTokenButton = await extPage.$(`[data-testid="import-token-button"]`)
      await importTokenButton.click()

      const searchInputField = await extPage.waitForSelector(`input`)
      await extPage.waitForTimeout(3000)

      await searchInputField.type('WI')

      const WIBUTokenOption = await extPage.waitForSelector(`[data-testid="WIBU"]`)
      await WIBUTokenOption.click()

      let selectAccountCheckbox = await extPage.waitForSelector('div[role="checkbox"]')
      await selectAccountCheckbox.click()

      let [confirmButton] = await extPage.$x('//button[text()="Confirm"]')
      await confirmButton.click()

      await extPage.waitForSelector('[data-testid="popup-loading-screen"]', {
        visible: true
      })

      await extPage.waitForSelector('[data-testid="popup-loading-screen"]', {
        hidden: true
      })

      await extPage.close()
      await optionPage.reload({ waitUntil: 'networkidle0' })

      /* ASSIGN ACCOUNT CARD VALUE */
      accountCardK2 = await optionPage.waitForXPath(
        `//div[contains(text(), "${WALLET_ADDRESS.K2_ADDRESS}")]/ancestor::div[@data-testid="account-card-setting-page"]`
      )

      /* CHECK K2 BALANCE */
      const balance = await accountCardK2.$(`[data-testid="account-card-balance"]`)
      const balanceText = await balance.evaluate((el) => el.textContent)
      const mainBalance = balanceText.split(' ')[1]
      const mainSymbol = balanceText.split(' ')[2]

      expect(Number(mainBalance)).toBeGreaterThan(0)
      expect(mainSymbol).toBe('KOII')

      const extendButton = await accountCardK2.$(
        `[data-testid="account-card-drop-down-${WALLET_ADDRESS.K2_ADDRESS}"]`
      )
      await extendButton.click()

      const accountBalances = await accountCardK2.$(`[data-testid="account-card-account-balance"]`)
      const accountBalanceMain = await accountBalances.$(
        `[data-testid="account-card-account-balance-KOII"]`
      )
      let tokenBalance, tokenSymbol
      tokenBalance = (await accountBalanceMain.evaluate((el) => el.textContent)).split(' ')[0]
      tokenSymbol = (await accountBalanceMain.evaluate((el) => el.textContent)).split(' ')[1]
      expect(Number(tokenBalance)).toBeGreaterThan(0)
      expect(Number(tokenBalance)).toEqual(Number(mainBalance))
      expect(tokenSymbol).toBe('KOII')

      /* CHECK WIBU BALANCE */
      const accountBalanceCustom = await accountBalances.$(
        `[data-testid="account-card-account-balance-WIBU"]`
      )
      tokenBalance = (await accountBalanceCustom.evaluate((el) => el.textContent)).split(' ')[0]
      tokenSymbol = (await accountBalanceCustom.evaluate((el) => el.textContent)).split(' ')[1]
      expect(Number(tokenBalance)).toBeGreaterThan(0)
      expect(tokenSymbol).toBe('WIBU')

      /* CHECK K2 ASSETS */
      // const assets = await accountCardK2.$(`[data-testid="account-card-assets"]`)
      // const assetsText = await assets.evaluate((el) => el.textContent)
      // const assetsValue = assetsText.split(' ')[1]
      // expect(Number(assetsValue)).toBeGreaterThanOrEqual(0)

      // const nftAssets = await accountCardK2.$(`[data-testid="account-card-nft-assets"]`)
      // const nftAssetsText = await nftAssets.evaluate((el) => el.textContent)
      // const [nftAssetsValue, nftAssetsSymbol] = nftAssetsText.split(' ')
      // expect(Number(nftAssetsValue)).toBeGreaterThanOrEqual(0)
      // expect(Number(nftAssetsValue)).toEqual(Number(assetsValue))
      // expect(nftAssetsSymbol).toBe('KOII')
    }, 500000)
  })

  describe('Copy address', () => {
    let accountCardETH, accountCardK2, accountCardSOL

    beforeAll(async () => {
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

      extPage = await context.launchExtPage()
      await browser
        .defaultBrowserContext()
        .overridePermissions(await optionPage.url(), ['clipboard-read', 'clipboard-write'])

      await browser
        .defaultBrowserContext()
        .overridePermissions(await extPage.url(), ['clipboard-read', 'clipboard-write'])
    }, 50000)

    it('should copy the correct address to clipboard in the options page', async () => {
      await optionPage.bringToFront()
      /* ETH Account */
      let copyAddressIcon = await accountCardETH.$(`[data-testid="account-card-copy-icon"]`)
      await copyAddressIcon.click()

      expect(await optionPage.evaluate(() => navigator.clipboard.readText())).toBe(
        WALLET_ADDRESS.ETHEREUM_SENDER
      )

      /* SOL Account */
      copyAddressIcon = await accountCardSOL.$(`[data-testid="account-card-copy-icon"]`)
      await copyAddressIcon.click()
      expect(await optionPage.evaluate(() => navigator.clipboard.readText())).toBe(
        WALLET_ADDRESS.SOLANA_SENDER
      )

      /* K2 Account */
      copyAddressIcon = await accountCardK2.$(`[data-testid="account-card-copy-icon"]`)
      await copyAddressIcon.click()
      expect(await optionPage.evaluate(() => navigator.clipboard.readText())).toBe(
        WALLET_ADDRESS.K2_ADDRESS
      )
    }, 100000)

    afterAll(async () => {
      await extPage.close()
    })
  })

  describe('Change account name', () => {
    let accountCardETH, accountCardK2, accountCardSOL

    beforeAll(async () => {
      await optionPage.bringToFront()
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
    }, 50000)

    it('should display correct account name after changing', async () => {
      /* ETH Account */
      let editAccountNameIcon = await accountCardETH.$(`[data-testid="edit-account-name-icon"]`)
      await editAccountNameIcon.click()
      let inputAccountName = await accountCardETH.$(`[data-testid="input-account-name"]`)
      await inputAccountName.click({ clickCount: 3 })
      await inputAccountName.type('ETH_ACCOUNT_NEW')

      expect(await inputAccountName.evaluate((el) => el.value)).toBe('ETH_ACCOUNT_NEW')
      let saveAccountNameIcon = await accountCardETH.$(`[data-testid="save-account-name-icon"]`)
      await saveAccountNameIcon.click()

      await optionPage.waitForSelector(`[data-testid="input-account-name"]`, { hidden: true })

      let accountName = await accountCardETH.$(`[data-testid="account-card-accountname"]`)
      expect(await accountName.evaluate((el) => el.textContent)).toBe('ETH_ACCOUNT_NEW')

      /* SOL Account */
      editAccountNameIcon = await accountCardSOL.$(`[data-testid="edit-account-name-icon"]`)
      await editAccountNameIcon.click()
      inputAccountName = await accountCardSOL.$(`[data-testid="input-account-name"]`)
      await inputAccountName.click({ clickCount: 3 })
      await inputAccountName.type('SOL_ACCOUNT_NEW')

      expect(await inputAccountName.evaluate((el) => el.value)).toBe('SOL_ACCOUNT_NEW')
      saveAccountNameIcon = await accountCardSOL.$(`[data-testid="save-account-name-icon"]`)
      await saveAccountNameIcon.click()

      await optionPage.waitForSelector(`[data-testid="input-account-name"]`, { hidden: true })

      accountName = await accountCardSOL.$(`[data-testid="account-card-accountname"]`)
      expect(await accountName.evaluate((el) => el.textContent)).toBe('SOL_ACCOUNT_NEW')

      /* K2 Account */
      editAccountNameIcon = await accountCardK2.$(`[data-testid="edit-account-name-icon"]`)
      await editAccountNameIcon.click()
      inputAccountName = await accountCardK2.$(`[data-testid="input-account-name"]`)
      await inputAccountName.click({ clickCount: 3 })
      await inputAccountName.type('K2_ACCOUNT_NEW')

      expect(await inputAccountName.evaluate((el) => el.value)).toBe('K2_ACCOUNT_NEW')
      saveAccountNameIcon = await accountCardK2.$(`[data-testid="save-account-name-icon"]`)
      await saveAccountNameIcon.click()

      await optionPage.waitForSelector(`[data-testid="input-account-name"]`, { hidden: true })

      accountName = await accountCardK2.$(`[data-testid="account-card-accountname"]`)
      expect(await accountName.evaluate((el) => el.textContent)).toBe('K2_ACCOUNT_NEW')

      /* Check new account name on the extension page */
      extPage = await context.launchExtPage()
      await extPage.bringToFront()
      const displayAccount = await extPage.waitForSelector(
        `[data-testid="popup-header-displayingaccount"]`
      )

      await displayAccount.click()

      const ethAccount = await extPage.waitForXPath(
        `//span[contains(text(), "0x660839")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      const ethPopupAccountName = await ethAccount.$(`[data-testid="popup-header-account-name"]`)
      expect(await ethPopupAccountName.evaluate((el) => el.textContent)).toBe(formatLongString('ETH_ACCOUNT_NEW', 12))

      const solAccount = await extPage.waitForXPath(
        `//span[contains(text(), "9cGCJ")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      const solPopupAccountName = await solAccount.$(`[data-testid="popup-header-account-name"]`)
      expect(await solPopupAccountName.evaluate((el) => el.textContent)).toBe(formatLongString('SOL_ACCOUNT_NEW', 12))

      const k2Account = await extPage.waitForXPath(
        `//span[contains(text(), "32Dz2")]/ancestor::div[@data-testid="popup-header-account"]`
      )
      const k2PopupAccountName = await k2Account.$(`[data-testid="popup-header-account-name"]`)
      expect(await k2PopupAccountName.evaluate((el) => el.textContent)).toBe(formatLongString('K2_ACCOUNT_NEW', 12))

      await extPage.close()
    }, 500000)
  })

  afterAll(async () => {
    await context.closePages()
  })
})
