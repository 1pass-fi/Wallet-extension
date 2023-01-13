import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import { SECRET_PHRASES } from '../utils/testConstants'

const ERROR_MESSAGE = {
  NOT_MATCHING: 'Password does not match',
  NOT_MEET_REQUIREMENT:
    'Secure passwords have at least 8 characters and include uppercase & lowercase letters, numbers, and special characters (e.g. !@#$%).',
  INCORRECT: 'Incorrect password',
  TERM_OF_SERVICE_UNCHECKED: 'Please accept the Terms of Service',
  INVALID_SECRET_PHRASE: 'Invalid Secret Phrase',
  ACCOUNT_EXISTED: 'This account has already been imported.'
}

describe('e2e test', () => {
  let browser, context, optionPage, savePhrases, importedAccountAddress

  beforeAll(async () => {
    savePhrases = []
    context = await bootstrap()
    browser = context.browser
    optionPage = context.optionPage
    return true
  }, 100000)

  it('Import new wallet(s)', async () => {
    await optionPage.bringToFront()

    const tosCheckbox = await optionPage.waitForSelector('#new-password-tos')
    const passwordInput = await optionPage.waitForSelector('#new-password')
    const confirmPasswordInput = await optionPage.waitForSelector('#confirm-password')
    const loginButton = await optionPage.waitForSelector('#log-in-button')
    const errorPasswordMessage = await optionPage.waitForSelector(
      `[data-testid="error-new-password"]`
    )
    const errorPasswordConfirmMessage = await optionPage.waitForSelector(
      `[data-testid="error-confirm-password"]`
    )
    const showPassword = await optionPage.waitForSelector(`[data-testid="show-new-password"]`)
    const showConfirmPassword = await optionPage.waitForSelector(
      `[data-testid="show-confirm-password"]`
    )
    const tosMessageField = await optionPage.waitForSelector(`[data-testid="tos-error-message"]`)

    // Show password and hidden password
    await showPassword.click()
    await showConfirmPassword.click()

    let passwordInputType = await passwordInput.evaluate((el) => el.type)
    expect(passwordInputType).toBe('text')
    let confirmPasswordInputType = await passwordInput.evaluate((el) => el.type)
    expect(confirmPasswordInputType).toBe('text')

    let tosErrorMessage, messagePasswordError
    /* Unchecked the Terms of Services */
    // type password and confirm password
    await passwordInput.type('OpenKoi@123')
    await confirmPasswordInput.type('OpenKoi@123')
    await loginButton.click()

    // expect the error message when unchecking the terms of service
    tosErrorMessage = await tosMessageField.evaluate((el) => el.textContent)
    expect(tosErrorMessage).toBe(ERROR_MESSAGE.TERM_OF_SERVICE_UNCHECKED)

    /* Password does not meet the requirement */
    // check the Terms of Services
    await tosCheckbox.click()

    // type password and confirm password (do not contains lowercase)
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('OpenKoi¥@123')
    await confirmPasswordInput.click({ clickCount: 3 })
    await confirmPasswordInput.type('OpenKoi¥@123')
    await loginButton.click()

    // expect the password does not meet the requirement
    messagePasswordError = await errorPasswordMessage.evaluate((el) => el.textContent)
    expect(messagePasswordError).toBe(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)

    // type password and confirm password (do not contains lowercase)
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('OPENKOI@123')
    await confirmPasswordInput.click({ clickCount: 3 })
    await confirmPasswordInput.type('OPENKOI@123')
    await loginButton.click()

    // expect the password does not meet the requirement
    messagePasswordError = await errorPasswordMessage.evaluate((el) => el.textContent)
    expect(messagePasswordError).toBe(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)

    // type password and confirm password (do not contains uppercase)
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('openkoi@123')
    await confirmPasswordInput.click({ clickCount: 3 })
    await confirmPasswordInput.type('openkoi@123')
    await loginButton.click()

    // expect the password does not meet the requirement
    messagePasswordError = await errorPasswordMessage.evaluate((el) => el.textContent)
    expect(messagePasswordError).toBe(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)

    // type password and confirm password (do not contains number)
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('OpenKoi@')
    await confirmPasswordInput.click({ clickCount: 3 })
    await confirmPasswordInput.type('OpenKoi@')
    await loginButton.click()

    // expect the password does not meet the requirement
    messagePasswordError = await errorPasswordMessage.evaluate((el) => el.textContent)
    expect(messagePasswordError).toBe(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)

    // type password and confirm password (do not contains special character)
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('OpenKoi123')
    await confirmPasswordInput.click({ clickCount: 3 })
    await confirmPasswordInput.type('OpenKoi123')
    await loginButton.click()

    // expect the password does not meet the requirement
    messagePasswordError = await errorPasswordMessage.evaluate((el) => el.textContent)
    expect(messagePasswordError).toBe(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)

    // type password and confirm password (less than 8 characters)
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('OpKo@1')
    await confirmPasswordInput.click({ clickCount: 3 })
    await confirmPasswordInput.type('OpKo@1')
    await loginButton.click()

    // expect the password does not meet the requirement
    messagePasswordError = await errorPasswordMessage.evaluate((el) => el.textContent)
    expect(messagePasswordError).toBe(ERROR_MESSAGE.NOT_MEET_REQUIREMENT)

    // type password and confirm password (do not match)
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('OpenKoi@123')
    await confirmPasswordInput.click({ clickCount: 3 })
    await confirmPasswordInput.type('Openkoi@123')
    await loginButton.click()

    // expect the confirm password does not match
    messagePasswordError = await errorPasswordConfirmMessage.evaluate((el) => el.textContent)
    expect(messagePasswordError).toBe(ERROR_MESSAGE.NOT_MATCHING)

    // type password and confirm password correctly
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('OpenKoi@123')
    await confirmPasswordInput.click({ clickCount: 3 })
    await confirmPasswordInput.type('OpenKoi@123')

    // verify TOS hyperlink
    const tosHyperlink = await optionPage.waitForSelector('[data-testid="tos-link"]')
    await tosHyperlink.click()

    await optionPage.waitForTimeout(2000)

    const currentPages = await browser.pages()
    const tosPage = currentPages[currentPages.length - 1]
    const tosUrl = await tosPage?.url()

    // expect the TOS link correctly
    expect(tosUrl).toBe('https://www.koii.network/TOU_June_22_2021.pdf')
    await tosPage?.close()
    await optionPage.bringToFront()

    await optionPage.waitForTimeout(1000)

    await loginButton.click()

    // expect go to the step 2 -  Create/Import Key
    const addAKeyPage = await optionPage.waitForSelector('[data-testid="AddAKey"]')
    expect(addAKeyPage).not.toBeNull()

    // click Import Key button
    const createKeyButton = await optionPage.waitForSelector('[data-testid="use-existing-key-div"]')
    await createKeyButton.click()

    // click Import ETH Key button
    const createEthKeyButton = await optionPage.waitForSelector('[data-testid="ethereum-key"]')
    await createEthKeyButton.click()

    const secretPhrase = SECRET_PHRASES.TYPE_ETHEREUM.split(' ')
    const confirmButton = await optionPage.waitForSelector('#confirm-button')
    const importPhraseError = await optionPage.waitForSelector(
      '[data-testid="import-phrase-error"]'
    )

    // expect confirm button to be disabled
    let isDisabled = await confirmButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeTruthy()

    /* Type invalid secret phrase*/
    // At least 1 phrase is blank
    for (let i = 0; i < secretPhrase.length; i++) {
      const secretPhraseField = await optionPage.waitForSelector(
        `[data-testid="import-phrase-${i}"]`
      )
      await secretPhraseField.type(i == 0 ? '' : secretPhrase[i])
    }
    // expect confirm button to be disabled
    isDisabled = await confirmButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeTruthy()

    // At least 1 phrase is not in bip-39 wordlist
    const firstPhraseField = await optionPage.waitForSelector(`[data-testid="import-phrase-0"]`)
    let firstPhraseFieldValue
    await firstPhraseField.click({ clickCount: 3 })
    await firstPhraseField.type('abc')

    // expect confirm button to be disabled
    isDisabled = await confirmButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeTruthy()

    // All the word is in bip-39 wordlist but fail to validate
    await firstPhraseField.click({ clickCount: 3 })
    await firstPhraseField.type('tired')
    await confirmButton.click()

    let importPhraseErrorMessage = await importPhraseError.evaluate((el) => el.textContent)
    // expect invalid secret phrase
    expect(importPhraseErrorMessage).toBe(ERROR_MESSAGE.INVALID_SECRET_PHRASE)

    /* Type secret phrase with the leading spaces */
    await firstPhraseField.click({ clickCount: 3 })
    await firstPhraseField.type('    tired')
    firstPhraseFieldValue = await firstPhraseField.evaluate((el) => el.value)
    expect(firstPhraseFieldValue).toBe('tired')

    /* Type secret phrase with the middle spaces */
    await firstPhraseField.click({ clickCount: 3 })
    await firstPhraseField.type('ti   red')
    firstPhraseFieldValue = await firstPhraseField.evaluate((el) => el.value)
    expect(firstPhraseFieldValue).toBe('tired')

    /* Type secret phrase with the trailing spaces */
    await firstPhraseField.click({ clickCount: 3 })
    await firstPhraseField.type('tired    ')
    firstPhraseFieldValue = await firstPhraseField.evaluate((el) => el.value)
    expect(firstPhraseFieldValue).toBe('tired')

    /* Type valid secret phrase*/
    await firstPhraseField.click({ clickCount: 3 })
    await firstPhraseField.type(secretPhrase[0])

    // expect confirm button to be enabled
    isDisabled = await confirmButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeFalsy()

    await confirmButton.click()

    const goToHomeButton = await optionPage.waitForSelector('#go-to-home-button')
    const openFaucetButton = await optionPage.$('#open-faucet-button')
    const openCreateNFTPageButton = await optionPage.$('#create-nft-page-button')

    expect(openFaucetButton).toBeNull()
    expect(openCreateNFTPageButton).toBeNull()

    await goToHomeButton.click()
  }, 200000)

  // TODO - Test back button each step(s)

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
  }, 50000)

  it('test create new ethereum wallet', async () => {
    await Automation.createPasswordStep(optionPage)

    const createNewKeyButton = await optionPage.waitForSelector(
      '[data-testid="start-from-scratch-div"]'
    )
    await createNewKeyButton.click()

    const keyLogoButton = await optionPage.waitForSelector('[data-testid="ethereum-key"]')
    await keyLogoButton.click()

    // I'm ready
    const imReadyButton = await optionPage.waitForSelector('[data-testid="ready-button"]')
    await imReadyButton.click()

    // Reveal secret phrase
    const blurPhraseButton = await optionPage.waitForSelector('[data-testid="blur-phrase-button"]')
    expect(blurPhraseButton).not.toBeNull()
    await blurPhraseButton.click()

    // Save 12-word secret phrase
    for (let i = 0; i < 12; i++) {
      const currentPhrase = await optionPage.waitForSelector(`[data-testid="hidden-phrase-${i}"]`)
      const value = await currentPhrase.evaluate((el) => el.textContent)
      savePhrases.push(value)
    }

    const continueButton = await optionPage.waitForSelector('#continue-button')
    await continueButton.click()

    /* Input 12 phrases wrongly */
    const confirmButton = await optionPage.waitForSelector('#continue-button')
    await confirmButton.click()

    const inputPhraseError = await optionPage.waitForSelector(`[data-testid="input-phrase-error"]`)
    let inputPhraseErrorText = await inputPhraseError.evaluate((el) => el.textContent)
    expect(inputPhraseErrorText).toBe(ERROR_MESSAGE.INVALID_SECRET_PHRASE)

    const inputIndices = []
    for (let i = 0; i < 12; i++) {
      const currentPhrase = await optionPage.waitForSelector(`[data-testid="input-phrase-${i}"]`)
      const nodeName = await currentPhrase.evaluate((el) => el.nodeName)
      if (nodeName === 'INPUT') {
        inputIndices.push(i)
        await currentPhrase.type('####')
      }
    }

    await confirmButton.click()
    inputPhraseErrorText = await inputPhraseError.evaluate((el) => el.textContent)
    expect(inputPhraseErrorText).toBe(ERROR_MESSAGE.INVALID_SECRET_PHRASE)

    /* Input the phrase with spaces */
    const firstInputPhrase = await optionPage.waitForSelector(
      `[data-testid="input-phrase-${inputIndices[0]}"]`
    )
    let firstInputPhraseValue
    // Leading spaces
    await firstInputPhrase.click({ clickCount: 3 })
    await firstInputPhrase.type('    tired')
    firstInputPhraseValue = await firstInputPhrase.evaluate((el) => el.value)
    expect(firstInputPhraseValue).toBe('tired')

    // Middle spaces
    await firstInputPhrase.click({ clickCount: 3 })
    await firstInputPhrase.type('ti    red')
    firstInputPhraseValue = await firstInputPhrase.evaluate((el) => el.value)
    expect(firstInputPhraseValue).toBe('tired')

    // Trailing spaces
    await firstInputPhrase.click({ clickCount: 3 })
    await firstInputPhrase.type('tired    ')
    firstInputPhraseValue = await firstInputPhrase.evaluate((el) => el.value)
    expect(firstInputPhraseValue).toBe('tired')

    /* Input 12 phrases correctly */
    for (let i = 0; i < 12; i++) {
      const currentPhrase = await optionPage.waitForSelector(`[data-testid="input-phrase-${i}"]`)
      const nodeName = await currentPhrase.evaluate((el) => el.nodeName)
      if (nodeName === 'INPUT') {
        await currentPhrase.click({ clickCount: 3 })
        await currentPhrase.type(savePhrases[i])
      }
    }

    await confirmButton.click()

    const goToHomeButton = await optionPage.waitForSelector('#go-to-home-button')
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
  }, 150000)

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
  }, 150000)

  it('import exist wallet', async () => {
    await Automation.goToImportWalletPage(optionPage)
    await Automation.createPasswordStep(optionPage, false)

    // click Import Key button
    let createKeyButton = await optionPage.waitForSelector('[data-testid="use-existing-key-div"]')
    await createKeyButton.click()

    // click Import ETH Key button
    let createEthKeyButton = await optionPage.waitForSelector('[data-testid="ethereum-key"]')
    await createEthKeyButton.click()

    for (let i = 0; i < savePhrases.length; i++) {
      const secretPhraseField = await optionPage.waitForSelector(
        `[data-testid="import-phrase-${i}"]`
      )
      await secretPhraseField.type(savePhrases[i])
    }

    let confirmButton = await optionPage.waitForSelector('#confirm-button')
    await confirmButton.click()

    // expect the error message ACCOUNT_EXISTED
    let errorMessageField = await optionPage.waitForSelector(`[data-testid="message-gallery"]`)
    const errorMessage = await errorMessageField.evaluate((el) => el.textContent)
    expect(errorMessage).toBe(ERROR_MESSAGE.ACCOUNT_EXISTED)
  }, 150000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
