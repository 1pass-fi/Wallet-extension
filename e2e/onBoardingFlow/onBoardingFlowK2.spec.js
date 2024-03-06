import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import { ALTERNATIVE_SECRET_PHRASES, SECRET_PHRASES } from '../utils/testConstants'

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
  }, 100000)

  it('Import new wallet(s)', async () => {
    await optionPage.bringToFront()

    const tosCheckbox = await optionPage.waitForSelector(`[data-testid="new-password-tos"]`)
    const passwordInput = await optionPage.$(`[placeholder="New Password"]`)
    const confirmPasswordInput = await optionPage.$(`[placeholder="Confirm Password"]`)
    const [loginButton] = await optionPage.$x(`//button[contains(text(), "Log In")]`)
    const errorPasswordMessage = await optionPage.$(`[data-testid="error-new-password"]`)
    const errorPasswordConfirmMessage = await optionPage.$(`[data-testid="error-confirm-password"]`)

    const showPassword = await optionPage.$(`[data-testid="show-new-password"]`)
    const showConfirmPassword = await optionPage.$(`[data-testid="show-confirm-password"]`)
    const tosMessageField = await optionPage.$(`[data-testid="tos-error-message"]`)

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
    const tosHyperlink = await optionPage.$('[data-testid="tos-link"]')
    await tosHyperlink.click()

    await optionPage.waitForTimeout(5000)

    const currentPages = await browser.pages()
    const tosPage = currentPages[currentPages.length - 1]
    const tosUrl = await tosPage?.url()

    // expect the TOS link correctly
    expect(tosUrl).toBe('https://www.koii.network/Koii_TOU_Oct_24_2023.pdf')
    await tosPage?.close()
    await optionPage.bringToFront()

    await optionPage.waitForTimeout(1000)

    await loginButton.click()

    // expect go to the step 2 -  Create/Import Key
    // const addAKeyPage = await optionPage.waitForSelector('[data-testid="AddAKey"]')
    const addAKeyPage = await optionPage.waitForXPath('//div[contains(text(), "Do you already")]')
    expect(addAKeyPage).not.toBeNull()

    // click Import Key button
    const [createKeyButton] = await optionPage.$x('//div[contains(text(), "Use my existing key.")]')
    await createKeyButton.click()

    // click Import K2 Key button
    const createK2KeyButton = await optionPage.waitForSelector('[data-testid="k2-key"]')
    await createK2KeyButton.click()

    const secretPhrase = SECRET_PHRASES.K2.split(' ')
    const [confirmButton] = await optionPage.$x('//button[contains(text(), "Confirm")]')
    const importPhraseError = await optionPage.$('[data-testid="import-phrase-error"]')

    // expect confirm button to be disabled
    let isDisabled = await confirmButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeTruthy()

    /* Type invalid secret phrase*/
    // At least 1 phrase is blank
    for (let i = 0; i < secretPhrase.length; i++) {
      const secretPhraseField = await optionPage.$(`[data-testid="import-phrase-${i}"]`)
      await secretPhraseField.type(i == 0 ? '' : secretPhrase[i])
    }
    // expect confirm button to be disabled
    isDisabled = await confirmButton.evaluate((el) => el.disabled)
    expect(isDisabled).toBeTruthy()

    // At least 1 phrase is not in bip-39 wordlist
    const firstPhraseField = await optionPage.$(`[data-testid="import-phrase-0"]`)
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

    const goToHomeButton = await optionPage.waitForXPath(
      `//button[contains(text(), "Go to Homepage")]`
    )
    const [openFaucetButton] = await optionPage.$x(`//button[contains(text(), "Get Free KOII")]`)
    const [openCreateNFTPageButton] = await optionPage.$x(
      `//button[contains(text(), "Create an NFT")]`
    )

    expect(openFaucetButton).toBeUndefined()
    expect(openCreateNFTPageButton).toBeUndefined()

    await goToHomeButton.click()
  }, 200000)

  it('remove k2 wallet', async () => {
    await Automation.goToImportWalletPage(optionPage)

    // Check login with wrong password
    const inputPasswordField = await optionPage.waitForSelector(`[placeholder="Password"]`)
    const [loginButton] = await optionPage.$x('//button[contains(text(), "Log In")]')

    await inputPasswordField.type('OpenKoi@1234')
    await loginButton.click()

    const errorPasswordField = await optionPage.waitForXPath(
      `//div[contains(text(), "${ERROR_MESSAGE.INCORRECT}")]`
    )
    expect(errorPasswordField).not.toBeNull()

    await inputPasswordField.click({ clickCount: 3 })
    await inputPasswordField.type('OpenKoi@123')
    await loginButton.click()

    await Automation.importKeyStep(optionPage, TYPE.K2, ALTERNATIVE_SECRET_PHRASES.K2, false)

    await Automation.goToWalletSettingPage(optionPage)

    let accountCards = await optionPage.$$('[data-testid="account-card-setting-page"]')
    expect(accountCards).toHaveLength(2)

    // Remove the first accoun
    let accountCardRemove = accountCards[0]
    let accountAddressField = await accountCardRemove.$('[data-testid="account-card-address"]')
    let accountAddress = await accountAddressField.evaluate((el) => el.textContent)

    let dropdownButton = await optionPage.$(
      `[data-testid="account-card-drop-down-${accountAddress}"]`
    )
    await dropdownButton.click()

    let removeAccountButton = await optionPage.$(
      `[data-testid="account-card-remove-account-${accountAddress}"]`
    )
    await removeAccountButton.click()

    let confirmRemoveAccountButton = await optionPage.waitForXPath(
      `//button[contains(text(), "Remove Account")]`
    )
    await confirmRemoveAccountButton.click()

    await optionPage.waitForFunction(
      () => document.querySelectorAll(`[data-testid="account-card-setting-page"]`).length < 2
    )

    accountCards = await optionPage.$$('[data-testid="account-card-setting-page"]')
    expect(accountCards).toHaveLength(1)

    // Remove the second account
    accountCardRemove = accountCards[0]
    accountAddressField = await accountCardRemove.$('[data-testid="account-card-address"]')
    accountAddress = await accountAddressField.evaluate((el) => el.textContent)

    dropdownButton = await optionPage.$(`[data-testid="account-card-drop-down-${accountAddress}"]`)
    await dropdownButton.click()

    removeAccountButton = await optionPage.$(
      `[data-testid="account-card-remove-account-${accountAddress}"]`
    )
    await removeAccountButton.click()

    confirmRemoveAccountButton = await optionPage.waitForXPath(
      `//button[contains(text(), "Remove Account")]`
    )
    await confirmRemoveAccountButton.click()

    expect(
      await optionPage.waitForXPath(`//div[contains(text(), "Welcome to the Finnie Wallet")]`)
    ).not.toBeNull()
  }, 150000)

  it('test create new k2 wallet', async () => {
    await Automation.createPasswordStep(optionPage)

    const createNewKeyButton = await optionPage.waitForXPath(
      `//div[contains(text(), "Start from scratch.")]`
    )
    await createNewKeyButton.click()

    const keyLogoButton = await optionPage.waitForSelector('[data-testid="k2-key"]')
    await keyLogoButton.click()

    // I'm ready
    const imReadyButton = await optionPage.waitForXPath(`//button[contains(text(), "I'm ready!")]`)
    await imReadyButton.click()

    // Reveal secret phrase
    const blurPhraseButton = await optionPage.waitForSelector('[data-testid="blur-phrase-button"]')
    expect(blurPhraseButton).not.toBeNull()
    await blurPhraseButton.click()

    // Save 12-word secret phrase
    for (let i = 0; i < 12; i++) {
      const currentPhrase = await optionPage.$(`[data-testid="hidden-phrase-${i}"]`)
      const value = await currentPhrase.evaluate((el) => el.textContent)
      savePhrases.push(value)
    }

    const [continueButton] = await optionPage.$x(`//button[contains(text(), "Continue")]`)
    await continueButton.click()

    /* Input 12 phrases wrongly */
    const confirmButton = await optionPage.waitForXPath(
      `//button[contains(text(), "Confirm Phrase")]`
    )
    await confirmButton.click()

    const inputPhraseError = await optionPage.$(`[data-testid="input-phrase-error"]`)
    let inputPhraseErrorText = await inputPhraseError.evaluate((el) => el.textContent)
    expect(inputPhraseErrorText).toBe(ERROR_MESSAGE.INVALID_SECRET_PHRASE)

    const inputIndices = []
    for (let i = 0; i < 12; i++) {
      const currentPhrase = await optionPage.$(`[data-testid="input-phrase-${i}"]`)
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
    const firstInputPhrase = await optionPage.$(`[data-testid="input-phrase-${inputIndices[0]}"]`)
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

    const goToHomeButton = await optionPage.waitForXPath(
      `//button[contains(text(), "Go to Homepage")]`
    )
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
    await Automation.importWallet(optionPage, TYPE.K2, savePhrases.join(' '))

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

    // click Import K2 Key button
    let createK2KeyButton = await optionPage.waitForSelector('[data-testid="k2-key"]')
    await createK2KeyButton.click()

    for (let i = 0; i < savePhrases.length; i++) {
      const secretPhraseField = await optionPage.waitForSelector(
        `[data-testid="import-phrase-${i}"]`
      )
      await secretPhraseField.type(savePhrases[i])
    }

    let [confirmButton] = await optionPage.$x(`//button[contains(text(), "Confirm")]`)
    await confirmButton.click()

    // expect the error message ACCOUNT_EXISTED
    let errorMessageField = await optionPage.waitForSelector(`[data-testid="message-gallery"]`)
    const errorMessage = await errorMessageField.evaluate((el) => el.textContent)
    expect(errorMessage).toBe(ERROR_MESSAGE.ACCOUNT_EXISTED)
  }, 150000)

  it('reveal secret phrase', async () => {
    let backButton = await optionPage.waitForSelector(`[name="back-button"]`)
    await backButton.click()

    await optionPage.waitForXPath(`//div[contains(text(), "Import your Key")]`)
    backButton = await optionPage.$(`[name="back-button"]`)
    await backButton.click()

    const accountCards = await optionPage.waitForSelector(
      '[data-testid="account-card-setting-page"]'
    )
    const accountAddressField = await accountCards.$('[data-testid="account-card-address"]')
    const accountAddress = await accountAddressField.evaluate((el) => el.textContent)

    const dropdownButton = await optionPage.$(
      `[data-testid="account-card-drop-down-${accountAddress}"]`
    )
    await dropdownButton.click()

    const revealPhraseButton = await optionPage.$(
      `[data-testid="account-card-reveal-secret-phrase-${accountAddress}"]`
    )
    await revealPhraseButton.click()

    const inputPasswordField = await optionPage.waitForSelector(`[name="finnie password"]`)
    let inputPasswordType = await inputPasswordField.evaluate((el) => el.type)
    expect(inputPasswordType).toBe('password')

    const showPasswordButton = await optionPage.$(`[name="show password button"]`)
    await showPasswordButton.click()

    inputPasswordType = await inputPasswordField.evaluate((el) => el.type)
    expect(inputPasswordType).toBe('text')

    await inputPasswordField.type('OpenKoi@1234')
    const inputPasswordValue = await inputPasswordField.evaluate((el) => el.value)
    expect(inputPasswordValue).toBe('OpenKoi@1234')

    const [doneButton] = await optionPage.$x(`//button[contains(text(), "Done")]`)
    await doneButton.click()

    const passwordErrorField = await optionPage.waitForSelector(
      `[data-testid="reveal-secret-phrase-password-error"]`
    )
    const passwordErrorText = await passwordErrorField.evaluate((el) => el.textContent)
    expect(passwordErrorText).toBe(ERROR_MESSAGE.INCORRECT)

    await inputPasswordField.click({ clickCount: 3 })
    await inputPasswordField.type('OpenKoi@123')
    await doneButton.click()

    // Show secret phrase
    const showedSecretPhrase = []
    for (let i = 0; i < 12; i++) {
      const currentPhrase = await optionPage.waitForSelector(`[data-testid="secret-phrase-${i}"]`)
      const phraseValue = await currentPhrase.evaluate((el) => el.textContent)
      showedSecretPhrase.push(phraseValue)
    }

    expect(showedSecretPhrase).toStrictEqual(savePhrases)
  }, 150000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
