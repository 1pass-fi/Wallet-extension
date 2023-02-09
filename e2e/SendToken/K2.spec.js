import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import { ALTERNATIVE_SECRET_PHRASES, WALLET_ADDRESS } from '../utils/testConstants'

const ERROR_MESSAGE = {
  INVALID_RECIPIENT_ADDRESS: 'Invalid recipient address',
  NOT_ENOUGH_TOKENS: 'Not enough tokens'
}

describe('Send token via K2 network', () => {
  let context, optionPage, extPage

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage

    /* Import K2 wallet for transaction testing */
    await Automation.importWallet(optionPage, TYPE.K2)
    // await Automation.importWallet(optionPage, TYPE.K2, ALTERNATIVE_SECRET_PHRASES.K2, false)

    /* Launch extension page after importing wallet */
    extPage = await context.launchExtPage()
  }, 500000)

  it('should fail to send the K2 token', async () => {
    await extPage.bringToFront()

    const goToSendButton = await extPage.waitForSelector('a[role="button"]')
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector('[role="button"]')
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="KOII"]`)
    await tokenOption.click()

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('999999') // 999999 KOII

    const recipientAddressInputField = await extPage.waitForSelector(
      `[data-testid="recipient-address"]`
    )

    /* Wrongly type the K2 address */
    await recipientAddressInputField.type('32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzx')

    let sendTokensButton = await extPage.waitForXPath(`//button[contains(text(), "Send Tokens")]`)
    await sendTokensButton.click()

    let popupError = await extPage.waitForSelector(`[data-testid="popup-error"]`)
    let popupErrorMessage = await popupError.evaluate((el) => el.textContent)

    expect(popupErrorMessage).toBe(ERROR_MESSAGE.INVALID_RECIPIENT_ADDRESS)

    await recipientAddressInputField.click({ clickCount: 3 })
    await recipientAddressInputField.type(WALLET_ADDRESS.K2_ADDRESS)

    await sendTokensButton.click()

    const senderConfirm = await extPage.waitForSelector(
      `[data-testid="tx-confirm-sender"]:not(:empty)`
    )

    /* CONFIRMATION MODAL */
    await extPage.waitForXPath(`//div[@data-testid="tx-confirm-fee"][contains(., "KOII")]`)
    const sender = await senderConfirm.evaluate((el) => el.textContent)
    expect(sender).toBe(WALLET_ADDRESS.K2_ADDRESS)

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe(WALLET_ADDRESS.K2_ADDRESS)

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('999999 KOII')

    const [sendButton] = await extPage.$x('//button[contains(text(), "Send")]')
    await sendButton.click()

    popupError = await extPage.waitForSelector(`[data-testid="popup-error"]`)
    popupErrorMessage = await popupError.evaluate((el) => el.textContent)
    expect(popupErrorMessage).toBe(ERROR_MESSAGE.NOT_ENOUGH_TOKENS)

    const [rejectButton] = await extPage.$x('//button[contains(text(), "Reject")]')
    await rejectButton.click()

    sendTokensButton = await extPage.waitForXPath(`//button[contains(text(), "Send Tokens")]`)
    expect(sendTokensButton).not.toBeNull()
  }, 500000)

  it('should successfully to send K2 token', async () => {
    /* SEND TOKEN FORM */
    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.click({ clickCount: 3 })
    await amountInputField.type('0.0001')

    const recipientAddressInputField = await extPage.waitForSelector(
      `[data-testid="recipient-address"]`
    )
    await recipientAddressInputField.click({ clickCount: 3 })
    await recipientAddressInputField.type(WALLET_ADDRESS.K2_ADDRESS)

    const sendTokensButton = await extPage.waitForSelector(`[data-testid="send-tokens-button"]`)
    await sendTokensButton.click()

    const senderConfirm = await extPage.waitForSelector(
      `[data-testid="tx-confirm-sender"]:not(:empty)`
    )

    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe(WALLET_ADDRESS.K2_ADDRESS)

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe(WALLET_ADDRESS.K2_ADDRESS)

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('0.0001 KOII')

    const [sendButton] = await extPage.$x('//button[text()="Send"]')
    await sendButton.click()

    // /* TRANSACTION RECEIPT */
    const okButton = await extPage.waitForSelector('a[role="button"]')
    await okButton.click()
  }, 500000)

  it('should successfully to send custom tokens', async () => {
    await extPage.bringToFront()

    /* IMPORT CUSTOM TOKEN */
    let goToImportToken = await extPage.waitForSelector(`[data-testid="Tokens"]`)
    await goToImportToken.click()

    let importTokenButton = await extPage.waitForSelector(`[data-testid="import-token-button"]`)
    await importTokenButton.click()

    let searchInputField = await extPage.waitForSelector(
      `[data-testid="search-custom-token-input"]`
    )

    await searchInputField.type('WI')

    const wibuTokenOption = await extPage.waitForSelector(`[data-testid="WIBU"]`)
    await wibuTokenOption.click()

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

    const goToSendButton = await extPage.waitForSelector('a[role="button"]')
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector('[role="button"]')
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="WIBU"]`)
    await tokenOption.click()

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('0.0001')

    const recipientAddressInputField = await extPage.waitForSelector(
      `[data-testid="recipient-address"]`
    )
    await recipientAddressInputField.type(WALLET_ADDRESS.K2_ADDRESS)

    const sendTokensButton = await extPage.waitForSelector(`[data-testid="send-tokens-button"]`)
    await sendTokensButton.click()

    /* TRANSACTION CONFIRM MODAL */
    await extPage.waitForXPath(`//div[@data-testid="tx-confirm-amount"][contains(., "WIBU")]`)

    const senderConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-sender"]`)
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe(WALLET_ADDRESS.K2_ADDRESS)

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe(WALLET_ADDRESS.K2_ADDRESS)

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('0.0001 WIBU')

    const [sendButton] = await extPage.$x('//button[text()="Send"]')
    await sendButton.click()

    // /* TRANSACTION RECEIPT */
    const okButton = await extPage.waitForSelector('a[role="button"]')
    await okButton.click()
  }, 500000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
