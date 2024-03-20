import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import {
  ALTERNATIVE_SECRET_PHRASES,
  CUSTOM_TOKEN_ADDRESS,
  WALLET_ADDRESS
} from '../utils/testConstants'

const ERROR_MESSAGE = {
  INVALID_RECIPIENT_ADDRESS: 'Invalid recipient address',
  NOT_ENOUGH_TOKENS: 'Not enough tokens'
}

describe('Send token via Solana network', () => {
  let context, optionPage, extPage

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage

    /* Import Solana wallet for transaction testing */
    await Automation.importWallet(optionPage, TYPE.SOLANA)
    await Automation.importWallet(
      optionPage,
      TYPE.SOLANA,
      ALTERNATIVE_SECRET_PHRASES.TYPE_SOLANA,
      false
    )

    /* Launch extension page after importing wallet */
    extPage = await context.launchExtPage()
  }, 500000)

  it('should fail to send the SOL token', async () => {
    await extPage.bringToFront()
    await Automation.swapToNetwork(extPage, 'DEVNET')

    const goToSendButton = await extPage.waitForSelector('a[role="button"]')
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector(`[data-testid="token-dropdown"]`)
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="SOL"]`)
    await tokenOption.click()

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('999999') // 999999 SOL

    const recipientAddressInputField = await extPage.waitForSelector(
      `[data-testid="recipient-address"]`
    )

    /* Wrongly type the SOL address */
    await recipientAddressInputField.type('9cGCJvVacp5V6xjeshprS3KDN3e5VwEUszHmxxaZuH')

    let sendTokensButton = await extPage.waitForXPath(`//button[contains(text(), "Send Tokens")]`)
    await sendTokensButton.click()

    let popupError = await extPage.waitForSelector(`[data-testid="popup-error"]`)
    let popupErrorMessage = await popupError.evaluate((el) => el.textContent)

    expect(popupErrorMessage).toBe(ERROR_MESSAGE.INVALID_RECIPIENT_ADDRESS)

    await recipientAddressInputField.click({ clickCount: 3 })
    await recipientAddressInputField.type(WALLET_ADDRESS.SOLANA_RECIPIENT)

    await sendTokensButton.click()

    /* CONFIRMATION MODAL */
    await extPage.waitForXPath(`//div[@data-testid="tx-confirm-fee"][contains(., "SOL")]`)

    const senderConfirm = await extPage.waitForSelector(
      `[data-testid="tx-confirm-sender"]:not(:empty)`
    )
    const sender = await senderConfirm.evaluate((el) => el.textContent)
    expect(sender).toBe(WALLET_ADDRESS.SOLANA_SENDER)

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe(WALLET_ADDRESS.SOLANA_RECIPIENT)

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('999999 SOL')

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

  it('should successfully to send SOL token', async () => {
    /* SEND TOKEN FORM */
    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.click({ clickCount: 3 })
    await amountInputField.type('0.0001')

    const recipientDropdown = await extPage.$(`[data-testid="recipient-open-dropdown"]`)
    await recipientDropdown.click()

    const recipientOption = await extPage.waitForSelector(`[data-testid="NODE ACCOUNT 2"]`)
    await recipientOption.click()

    const sendTokensButton = await extPage.waitForSelector(`[data-testid="send-tokens-button"]`)
    await sendTokensButton.click()

    /* TRANSACTION CONFIRM MODAL */
    const senderConfirm = await extPage.waitForSelector(
      `[data-testid="tx-confirm-sender"]:not(:empty)`
    )
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe(WALLET_ADDRESS.SOLANA_SENDER)

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe(WALLET_ADDRESS.SOLANA_RECIPIENT)

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('0.0001 SOL')

    const [sendButton] = await extPage.$x('//button[text()="Send"]')
    await sendButton.click()

    /* TRANSACTION RECEIPT */
    const okButton = await extPage.waitForSelector('a[role="button"]', { timeout: 300000 })
    await okButton.click()
  }, 500000)
  
  // Usually fails to send custom token due to the network timeout
  it.skip('should successfully to send custom token', async () => {
    await extPage.bringToFront()

    /* IMPORT CUSTOM TOKEN */
    const goToImportToken = await extPage.waitForSelector(`[data-testid="Tokens"]`)
    await goToImportToken.click()

    const importTokenButton = await extPage.$(`[data-testid="import-token-button"]`)
    await importTokenButton.click()

    const searchInputField = await extPage.waitForSelector(`input`)
    await extPage.waitForTimeout(5000)

    await searchInputField.type(CUSTOM_TOKEN_ADDRESS.SOL_USDC_TOKEN)

    const UNITokenOption = await extPage.waitForSelector(`[data-testid="USDC"]`)
    await UNITokenOption.click()

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

    const goToSendButton = await extPage.waitForSelector(`[data-testid="icon-send-tokens"]`)
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector(`[data-testid="token-dropdown"]`)
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="USDC"]`)
    await tokenOption.click()

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('0.0001')

    const recipientDropdown = await extPage.$(`[data-testid="recipient-open-dropdown"]`)
    await recipientDropdown.click()

    const recipientOption = await extPage.waitForSelector(`[data-testid="NODE ACCOUNT 2"]`)
    await recipientOption.click()

    const sendTokensButton = await extPage.waitForSelector(`[data-testid="send-tokens-button"]`)
    await sendTokensButton.click()

    /* TRANSACTION CONFIRM MODAL */
    await extPage.waitForXPath(`//div[@data-testid="tx-confirm-amount"][contains(., "USDC")]`)

    const senderConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-sender"]`)
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe(WALLET_ADDRESS.SOLANA_SENDER)

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe(WALLET_ADDRESS.SOLANA_RECIPIENT)

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('0.0001 USDC')

    const [sendButton] = await extPage.$x('//button[text()="Send"]')
    await sendButton.click()

    /* TRANSACTION RECEIPT */
    const okButton = await extPage.waitForSelector('a[role="button"]', { timeout: 300000 })
    await okButton.click()
  }, 500000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
