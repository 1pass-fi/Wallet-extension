import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'

const ERROR_MESSAGE = {
  INCORRECT_PASSWORD: `Password is incorrect`,
  NOT_MATCHING: `Passwords don’t match`,
  NOT_MEET_REQUIREMENT: `Password must have at least 8 characters, 1 number, 1 uppercase, 1 lowercase and 1 symbol (e.g. !@#$%).`
}

describe('ExtensionManagement', () => {
  let optionPage, extPage, browser, context

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage
    browser = context.browser
  }, 50000)

  it('should render the get started screen when there is no account', async () => {
    expect(
      await optionPage.$x(`//*[contains(text(), "Create a password to secure Finnie.")]`)
    ).toHaveLength(1)

    expect(
      await optionPage.$x(`//*[contains(text(), "Welcome to the Finnie Wallet")]`)
    ).toHaveLength(1)

    extPage = await context.launchExtPage()
    await extPage.bringToFront()

    expect(await extPage.$x(`//*[contains(text(), "Import with a seed phrase")]`)).toHaveLength(1)

    expect(await extPage.$x(`//*[contains(text(), "Get a new wallet")]`)).toHaveLength(1)

    await extPage.close()
  })

  it('should lock finnie and display lock screen', async () => {
    await Automation.importWallet(optionPage, TYPE.ETHEREUM)

    extPage = await context.launchExtPage()
    await extPage.bringToFront()

    const lockWalletButton = await extPage.waitForXPath(`//*[contains(text(), "LOCK")]`)
    await lockWalletButton.click()

    await extPage.reload({ waitUntil: 'networkidle0' })
    expect(await extPage.waitForXPath(`//button[contains(text(), "Unlock")]`)).not.toBeNull()

    await optionPage.reload({ waitUntil: 'networkidle0' })
    await optionPage.bringToFront()
    expect(await optionPage.waitForXPath(`//*[contains(text(), "Unlock Finnie")]`)).not.toBeNull()
  }, 100000)

  it('should successfully unlock finnie with password created in the onboarding flow', async () => {
    await extPage.bringToFront()

    const [inputPassword] = await extPage.$x(`//input`)
    await inputPassword.type(`Openkoi@123`)

    const [unlockWalletButton] = await extPage.$x(`//button[contains(text(), "Unlock")]`)
    await unlockWalletButton.click()

    let popupError = await extPage.waitForSelector(`[data-testid="popup-error"]`, { visible: true })
    let popupErrorMessage = await popupError.evaluate((el) => el.textContent)

    expect(popupErrorMessage).toBe('Incorrect password')
    expect(await extPage.waitForXPath(`//*[contains(text(), "Password is incorrect")]`))

    await extPage.waitForSelector(`[data-testid="popup-error"]`, { hidden: true })

    await inputPassword.click({ clickCount: 3 })
    await inputPassword.type(`OpenKoi@123`)

    await unlockWalletButton.click()

    await extPage.waitForXPath(`//*[contains(text(), "LOCK")]`)
    expect(await extPage.url()).toContain(`popup.html#/tokens`)
    expect(await optionPage.waitForXPath(`//*[contains(text(), "GALLERY")]`)).not.toBeNull()
  }, 200000)

  it('change the wallet password', async () => {
    await optionPage.bringToFront()
    await Automation.goToSecuritySettingPage(optionPage)

    const updatePasswordButton = await optionPage.waitForXPath(
      `//button[contains(text(), "Update Password")]`
    )
    await updatePasswordButton.click()

    const currentPassword = await optionPage.waitForXPath(`//input[@name="current-password"]`)
    const [newPassword] = await optionPage.$x(`//input[@name="change-new-password"]`)
    const [confirmNewPassword] = await optionPage.$x(`//input[@name="change-confirm-password"]`)
    const [saveChangesButton] = await optionPage.$x(`//button[contains(text(), "Save Changes")]`)

    /* Incorrect current password */
    await currentPassword.type('Openkoi@123')
    await newPassword.type('OpenKoi@1234')
    await confirmNewPassword.type('OpenKoi@1234')
    await saveChangesButton.click()

    expect(
      await optionPage.waitForXPath(`//*[contains(text(), "${ERROR_MESSAGE.INCORRECT_PASSWORD}")]`)
    ).not.toBeNull()

    /* Password does not match */
    await currentPassword.click({ clickCount: 3 })
    await currentPassword.type('OpenKoi@123')
    await confirmNewPassword.click({ clickCount: 3 })
    await confirmNewPassword.type('Openkoi@1234')
    await saveChangesButton.click()

    expect(
      await optionPage.waitForXPath(`//*[contains(text(), "${ERROR_MESSAGE.NOT_MATCHING}")]`)
    ).not.toBeNull()

    /* Password contains invalid character */
    await newPassword.click({ clickCount: 3 })
    await newPassword.type('OpenKoi¥@1234')
    await confirmNewPassword.click({ clickCount: 3 })
    await confirmNewPassword.type('OpenKoi¥@1234')
    await saveChangesButton.click()

    expect(
      await optionPage.waitForXPath(
        `//*[contains(text(), "${ERROR_MESSAGE.NOT_MEET_REQUIREMENT}")]`
      )
    ).not.toBeNull()

    /* Password does not contain lowercase character */
    await newPassword.click({ clickCount: 3 })
    await newPassword.type('OPENKOI@1234')
    await confirmNewPassword.click({ clickCount: 3 })
    await confirmNewPassword.type('OPENKOI@1234')
    await saveChangesButton.click()

    expect(
      await optionPage.waitForXPath(
        `//*[contains(text(), "${ERROR_MESSAGE.NOT_MEET_REQUIREMENT}")]`
      )
    ).not.toBeNull()

    /* Password does not contain uppercase character */
    await newPassword.click({ clickCount: 3 })
    await newPassword.type('openkoi@1234')
    await confirmNewPassword.click({ clickCount: 3 })
    await confirmNewPassword.type('openkoi@1234')
    await saveChangesButton.click()

    expect(
      await optionPage.$x(`//*[contains(text(), "${ERROR_MESSAGE.NOT_MEET_REQUIREMENT}")]`)
    ).toHaveLength(1)

    /* Password does not contain numeric character */
    await newPassword.click({ clickCount: 3 })
    await newPassword.type('OpenKoi@')
    await confirmNewPassword.click({ clickCount: 3 })
    await confirmNewPassword.type('OpenKoi@')
    await saveChangesButton.click()

    expect(
      await optionPage.waitForXPath(
        `//*[contains(text(), "${ERROR_MESSAGE.NOT_MEET_REQUIREMENT}")]`
      )
    ).not.toBeNull()

    /* Password does not contain special character */
    await newPassword.click({ clickCount: 3 })
    await newPassword.type('OpenKoi123')
    await confirmNewPassword.click({ clickCount: 3 })
    await confirmNewPassword.type('OpenKoi123')
    await saveChangesButton.click()

    expect(
      await optionPage.waitForXPath(
        `//*[contains(text(), "${ERROR_MESSAGE.NOT_MEET_REQUIREMENT}")]`
      )
    ).not.toBeNull()

    /* Password length is less than 8 */
    await newPassword.click({ clickCount: 3 })
    await newPassword.type('OpKo@1')
    await confirmNewPassword.click({ clickCount: 3 })
    await confirmNewPassword.type('OpKo@1')
    await saveChangesButton.click()

    expect(
      await optionPage.waitForXPath(
        `//*[contains(text(), "${ERROR_MESSAGE.NOT_MEET_REQUIREMENT}")]`
      )
    ).not.toBeNull()

    /* Successfully change the password */
    await newPassword.click({ clickCount: 3 })
    await newPassword.type('OpenKoi@1234')
    await confirmNewPassword.click({ clickCount: 3 })
    await confirmNewPassword.type('OpenKoi@1234')
    await saveChangesButton.click()

    const gotItButton = await optionPage.waitForXPath(`//button[contains(text(), "Got It")]`)
    await gotItButton.click()
  }, 250000)

  it('should successfully unlock finnie with the new password', async () => {
    extPage = await context.launchExtPage()
    await extPage.bringToFront()

    const lockWalletButton = await extPage.waitForXPath(`//*[contains(text(), "LOCK")]`)
    await lockWalletButton.click()

    await extPage.reload({ waitUntil: 'networkidle0' })

    const inputPassword = await extPage.waitForXPath(`//input`)
    const [unlockWalletButton] = await extPage.$x(`//button[contains(text(), "Unlock")]`)

    await inputPassword.type(`OpenKoi@123`)
    await unlockWalletButton.click()

    let popupError = await extPage.waitForSelector(`[data-testid="popup-error"]`, {
      visible: true
    })
    let popupErrorMessage = await popupError.evaluate((el) => el.textContent)

    expect(popupErrorMessage).toBe('Incorrect password')
    expect(await extPage.waitForXPath(`//*[contains(text(), "Password is incorrect")]`))

    await extPage.waitForSelector(`[data-testid="popup-error"]`, { hidden: true })

    await inputPassword.click({ clickCount: 3 })
    await inputPassword.type(`OpenKoi@1234`)

    await unlockWalletButton.click()

    await extPage.waitForXPath(`//*[contains(text(), "LOCK")]`)
    expect(await extPage.url()).toContain(`popup.html#/tokens`)
  }, 200000)

  afterAll(async () => {
    await context.closePages()
  })
})
