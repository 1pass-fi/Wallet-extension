import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import { SECRET_PHRASES } from '../utils/testConstants'

describe('e2e test', () => {
  let context, optionPage, savePhrases, importedAccountAddress

  beforeAll(async () => {
    savePhrases = []
    context = await bootstrap()
    optionPage = context.optionPage
    return true
  })

  it('Import new wallet(s)', async () => {
    await optionPage.bringToFront()
    await optionPage.waitForSelector('#new-password')

    /* Accept TOS */
    // type password
    await optionPage.type('#new-password', 'OpenKoi@123')

    // click login button
    let loginButton = await optionPage.waitForSelector('#log-in-button')
    await loginButton.click()
    let tosMessage = (await optionPage.content()).match('Please accept the Terms of Service')

    // expect the error message
    expect(tosMessage).not.toBeNull()

    /* Confirm Password */
    // check tos
    const tosCheckbox = await optionPage.waitForSelector('#new-password-tos')
    await tosCheckbox.click()

    await loginButton.click()

    tosMessage = (await optionPage.content()).match('Please accept the Terms of Service')

    // expect no the TOS message
    expect(tosMessage).toBeNull()

    // expect error message
    let errorPasswordMessage = (await optionPage.content()).match('Password does not match')
    expect(errorPasswordMessage).not.toBeNull()

    // type confirm password
    await optionPage.type('input[id="confirm-password"]', 'blah_blah_blah')

    // click login button
    await loginButton.click()

    errorPasswordMessage = (await optionPage.content()).match('Password does not match')
    // expect error message
    expect(errorPasswordMessage).not.toBeNull()

    /* Create Password successfully */
    const input = await optionPage.$('#confirm-password')
    await input.click({ clickCount: 3 })
    await input.type('OpenKoi@123')

    // click login button
    await loginButton.click()

    // expect go to the step 2 -  Create Key
    const addAKeyPage = await optionPage.waitForSelector('[data-testid="AddAKey"]')
    expect(addAKeyPage).not.toBeNull()

    // click Import Key button
    let createKeyButton = await optionPage.waitForSelector('[data-testid="use-existing-key-div"]')
    await createKeyButton.click()

    // click Import ETH Key button
    let createEthKeyButton = await optionPage.waitForSelector('[data-testid="ethereum-key"]')
    await createEthKeyButton.click()

    for (let i = 0; i < SECRET_PHRASES.TYPE_ETHEREUM.split(' ').length; i++) {
      const secretPhraseField = await optionPage.waitForSelector(
        `[data-testid="import-phrase-${i}"]`
      )
      await secretPhraseField.type(SECRET_PHRASES.TYPE_ETHEREUM.split(' ')[i])
    }

    // TODO DatH - expect Confirm button is enabled

    let confirmButton = await optionPage.waitForSelector('#confirm-button')
    let isDisabled = await confirmButton.evaluate((el) => el.disabled)

    expect(isDisabled).toBeFalsy()
    await confirmButton.click()

    // TODO DatH - next step
    let goToHomeButton = await optionPage.waitForSelector('#go-to-home-button')
    let openFaucetButton = await optionPage.$('#open-faucet-button')
    let openCreateNFTPageButton = await optionPage.$('#create-nft-page-button')

    expect(openFaucetButton).toBeNull()
    expect(openCreateNFTPageButton).toBeNull()

    await goToHomeButton.click()
  }, 30000)

  // TODO DatH - e2e test: import exist wallet

  /* TODO Test 2 cases: IMPORT exist wallets - CREATE new wallets */

  // TODO - Test back button each step(s)
  // TODO - Test input secret phrase(s)  (Confirm button - input field(s) - error messages)

  // TODO - add delay 500ms for demo

  it('remove ethereum wallet', async () => {
    const profilePictureNavBar = await optionPage.waitForSelector(
      `[data-testid="profile-picture-navbar"]`
    )
    await profilePictureNavBar.click()

    const walletSettingButton = await optionPage.waitForSelector(
      `[data-testid="wallet-dropdown-light"]`
    )
    await walletSettingButton.click()

    const accountCards = await optionPage.$('[data-testid="account-card-setting-page"]')
    const accountAddressField = await accountCards.$('[data-testid="account-card-address"]')
    const accountAddress = await accountAddressField.evaluate((el) => el.textContent)

    const dropdownButton = await optionPage.waitForSelector(
      `[data-testid="account-card-drop-down-${accountAddress}"]`
    )
    await dropdownButton.click()

    const removeAccountButton = await optionPage.waitForSelector(
      `[data-testid="account-card-remove-account-${accountAddress}"]`
    )
    await removeAccountButton.click()

    const confirmRemoveAccountButton = await optionPage.waitForSelector(
      `[data-testid="confirm-remove-account-button"]`
    )
    await confirmRemoveAccountButton.click()
  }, 10000)

  it('test create new ethereum wallet', async () => {
    await Automation.createPasswordStep(optionPage)

    let createNewKeyButton = await optionPage.waitForSelector(
      '[data-testid="start-from-scratch-div"]'
    )
    await createNewKeyButton.click()

    let keyLogoButton = await optionPage.waitForSelector('[data-testid="ethereum-key"]')
    await keyLogoButton.click()

    // // TODO Remind me later
    // let remindMeLaterButton = await optionPage.waitForSelector('[data-testid="remind-me-button"]')
    // remindMeLaterButton.click()

    // let goToHomeButton = await optionPage.waitForSelector('#go-to-home-button')
    // await goToHomeButton.click()

    // await optionPage.waitForTimeout(10000000)

    // I'm ready
    let imReadyButton = await optionPage.waitForSelector('[data-testid="ready-button"]')
    await imReadyButton.click()

    // Reveal secret phrase
    let blurPhraseButton = await optionPage.waitForSelector('[data-testid="blur-phrase-button"]')
    await blurPhraseButton.click()

    // Save 12-word secret phrase
    for (let i = 0; i < 12; i++) {
      let currentPhrase = await optionPage.waitForSelector(`[data-testid="hidden-phrase-${i}"]`)
      let value = await currentPhrase.evaluate((el) => el.textContent)
      savePhrases.push(value)
    }

    let continueButton = await optionPage.waitForSelector('#continue-button')
    await continueButton.click()

    for (let i = 0; i < 12; i++) {
      let currentPhrase = await optionPage.waitForSelector(`[data-testid="input-phrase-${i}"]`)
      let nodeName = await currentPhrase.evaluate((el) => el.nodeName)
      if (nodeName === 'INPUT') {
        await currentPhrase.type(savePhrases[i])
      }
    }

    let confirmButton = await optionPage.waitForSelector('#continue-button')
    await confirmButton.click()

    let goToHomeButton = await optionPage.waitForSelector('#go-to-home-button')
    await goToHomeButton.click()

    // go to Setting page and detect the accout address
    const profilePictureNavBar = await optionPage.waitForSelector(
      `[data-testid="profile-picture-navbar"]`
    )
    await profilePictureNavBar.click()

    const walletSettingButton = await optionPage.waitForSelector(
      `[data-testid="wallet-dropdown-light"]`
    )
    await walletSettingButton.click()

    const accountCards = await optionPage.$('[data-testid="account-card-setting-page"]')
    const accountAddressField = await accountCards.$('[data-testid="account-card-address"]')
    importedAccountAddress = await accountAddressField.evaluate((el) => el.textContent)
  }, 30000)

  it('verify the account address', async () => {
    await Automation.removeKey(optionPage, importedAccountAddress)
    await Automation.importWallet(optionPage, TYPE.ETHEREUM, savePhrases.join(' '))

    // go to Setting page and detect the accout address
    const profilePictureNavBar = await optionPage.waitForSelector(
      `[data-testid="profile-picture-navbar"]`
    )
    await profilePictureNavBar.click()

    const walletSettingButton = await optionPage.waitForSelector(
      `[data-testid="wallet-dropdown-light"]`
    )
    await walletSettingButton.click()

    const accountCards = await optionPage.$('[data-testid="account-card-setting-page"]')
    const accountAddressField = await accountCards.$('[data-testid="account-card-address"]')
    const accountAddress = await accountAddressField.evaluate((el) => el.textContent)

    expect(accountAddress).toBe(importedAccountAddress)
  }, 30000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
