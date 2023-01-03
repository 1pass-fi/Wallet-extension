import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import { ALTERNATIVE_SECRET_PHRASES } from '../utils/testConstants'

describe('Send token via Ethereum network', () => {
  let context, optionPage, extPage

  beforeAll(async () => {
    /* Launch option page */
    context = await bootstrap()
    optionPage = context.optionPage

    /* Import Ethereum wallet for transaction testing */
    await Automation.importWallet(optionPage, TYPE.ETHEREUM)
    await Automation.importWallet(optionPage, TYPE.ETHEREUM, ALTERNATIVE_SECRET_PHRASES.TYPE_ETHEREUM, false)

    /* Launch extension page after importing wallet */
    extPage = await context.launchExtPage()
  }, 40000)

  it('should successfully to send ETH token', async () => {
    await extPage.bringToFront()

    await Automation.swapToNetwork(extPage, 'Goerli TestNet')

    extPage?.close()
    extPage = await context.launchExtPage()

    const reloadBalanceButton = await extPage.waitForSelector(
      `[data-testid="reload-balance-popup-button"]`
    )
    await reloadBalanceButton.click()

    // TODO DatH - wait for balance !== 0
    await extPage.waitForTimeout(3000)

    const goToSendButton = await extPage.waitForSelector(`[data-testid="icon-send-tokens"]`)
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector(`[data-testid="token-dropdown"]`)
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="ETH"]`)
    await tokenOption.click()

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('0.0001')

    const recipientDropdown = await extPage.$(`[data-testid="recipient-open-dropdown"]`)
    await recipientDropdown.click()

    const recipientOption = await extPage.waitForSelector(`[data-testid="Account#2"]`)
    await recipientOption.click()

    const sendTokensButton = await extPage.waitForSelector(`[data-testid="send-tokens-button"]`)
    await sendTokensButton.click()

    // TODO DatH - wait for TRANSACTION CONFIRM MODAL data
    await extPage.waitForTimeout(1000)

    /* TRANSACTION CONFIRM MODAL */
    const senderConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-sender"]`)
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe('0x66083923D61D765f5FC51a612f17d64564358716')

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe('0x9850Da0a1A2635625d3696E0474D855484aA0994')

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('0.0001 ETH')

    const sendConfirmButton = await extPage.waitForSelector(
      `[data-testid="tx-confirm-send-button"]`
    )

    await sendConfirmButton.click()

    /* TRANSACTION RECEIPT */
    const okButton = await extPage.waitForSelector(`[data-testid="button-ok"]`)
    await okButton.click()
    await extPage.waitForTimeout(1000)
  }, 50000)

  it.skip('should successfully to send custom token', async () => {
    await extPage.bringToFront()

    /* IMPORT CUSTOM TOKEN */
    const goToImportToken = await extPage.waitForSelector(`[data-testid="Tokens"]`)
    await goToImportToken.click()

    const importTokenButton = await extPage.waitForSelector(`[data-testid="import-token-button"]`)
    await importTokenButton.click()

    const searchInputField = await extPage.waitForSelector(
      `[data-testid="search-custom-token-input'"]`
    )
    const UNI_TOKEN_CONTRACT_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
    await searchInputField.type(UNI_TOKEN_CONTRACT_ADDRESS)

    const UNITokenOption = await extPage.waitForSelector(`[data-testid="UNI"]`)
    await UNITokenOption.click()

    const goToSendButton = await extPage.waitForSelector(`[data-testid="icon-send-tokens"]`)
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector(`[data-testid="token-dropdown"]`)
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="UNI"]`)
    await tokenOption.click()

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('0.0001')

    const recipientDropdown = await extPage.$(`[data-testid="recipient-open-dropdown"]`)
    await recipientDropdown.click()

    const recipientOption = await extPage.waitForSelector(`[data-testid="Account #2"]`)
    await recipientOption.click()

    const sendTokensButton = await extPage.waitForSelector(`[data-testid="send-tokens-button"]`)
    await sendTokensButton.click()

    /* TRANSACTION CONFIRM MODAL */
    const senderConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-sender"]`)
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe('0x66083923D61D765f5FC51a612f17d64564358716')

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe('0x9850Da0a1A2635625d3696E0474D855484aA0994')

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    expect(amountConfirm).toBe('0.0001 UNI')

    const sendConfirmButton = await extPage.waitForSelector(
      `[data-testid="tx-confirm-send-button"]`
    )
    await sendConfirmButton.click()

    /* TRANSACTION RECEIPT */
    const okButton = await extPage.waitForSelector(`[data-testid="button-ok"]`)
    await okButton.click()
  })

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
