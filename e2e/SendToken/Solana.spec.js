import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import {
  ALTERNATIVE_SECRET_PHRASES,
  CUSTOM_TOKEN_ADDRESS,
  WALLET_ADDRESS
} from '../utils/testConstants'

describe('Send token via Ethereum network', () => {
  let context, optionPage, extPage

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage

    /* Import Ethereum wallet for transaction testing */
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

  it.skip('should successfully to send SOL token', async () => {
    await extPage.bringToFront()
    await Automation.swapToNetwork(extPage, 'DEVNET')

    const goToSendButton = await extPage.waitForSelector(`[data-testid="icon-send-tokens"]`)
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector(`[data-testid="token-dropdown"]`)
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="SOL"]`)
    await tokenOption.click()

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('0.0001')

    const recipientDropdown = await extPage.$(`[data-testid="recipient-open-dropdown"]`)
    await recipientDropdown.click()

    const recipientOption = await extPage.waitForSelector(`[data-testid="Account#2"]`)
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
    const okButton = await extPage.waitForSelector('a[role="button"]')
    await okButton.click()
  }, 500000)

  it('should successfully to send custom token', async () => {
    await extPage.bringToFront()
    await Automation.swapToNetwork(extPage, 'DEVNET')

    /* IMPORT CUSTOM TOKEN */
    const goToImportToken = await extPage.waitForSelector(`[data-testid="Tokens"]`)
    await goToImportToken.click()

    const importTokenButton = await extPage.$(`[data-testid="import-token-button"]`)
    await importTokenButton.click()

    const searchInputField = await extPage.waitForSelector(`input`)
    await extPage.waitForTimeout(3000)

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

    const recipientOption = await extPage.waitForSelector(`[data-testid="Account#2"]`)
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
    const okButton = await extPage.waitForSelector('a[role="button"]')
    await okButton.click()
  }, 500000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
