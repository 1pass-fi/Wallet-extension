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
    await Automation.importWallet(optionPage, TYPE.ETHEREUM)
    await Automation.importWallet(
      optionPage,
      TYPE.ETHEREUM,
      ALTERNATIVE_SECRET_PHRASES.TYPE_ETHEREUM,
      false
    )

    /* Launch extension page after importing wallet */
    extPage = await context.launchExtPage()
  }, 500000)

  it('should successfully to send ETH token', async () => {
    await extPage.bringToFront()
    await Automation.swapToNetwork(extPage, 'Goerli TestNet')

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

    /* TRANSACTION CONFIRM MODAL */
    const senderConfirm = await extPage.waitForXPath(
      `//div[@data-testid="tx-confirm-sender"][contains(text(), "0x")]`
    )
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe(WALLET_ADDRESS.ETHEREUM_SENDER)

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe(WALLET_ADDRESS.ETHEREUM_RECIPIENT)

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
  }, 500000)

  it('should successfully to send custom token', async () => {
    await extPage.bringToFront()

    /* IMPORT CUSTOM TOKEN */
    const goToImportToken = await extPage.waitForSelector(`[data-testid="Tokens"]`)
    await goToImportToken.click()

    const importTokenButton = await extPage.$(`[data-testid="import-token-button"]`)
    await importTokenButton.click()

    const searchInputField = await extPage.waitForSelector(`input`)
    await searchInputField.type(CUSTOM_TOKEN_ADDRESS.ETH_UNI_TOKEN)

    const UNITokenOption = await extPage.waitForSelector(`[data-testid="UNI"]`)
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

    const tokenOption = await extPage.waitForSelector(`[data-testid="UNI"]`)
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
    await extPage.waitForXPath(`//div[@data-testid="tx-confirm-amount"][contains(., "UNI")]`)

    const senderConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-sender"]`)
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe(WALLET_ADDRESS.ETHEREUM_SENDER)

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe(WALLET_ADDRESS.ETHEREUM_RECIPIENT)

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('0.0001 UNI')

    const [sendButton] = await extPage.$x('//button[text()="Send"]')
    await sendButton.click()

    /* TRANSACTION RECEIPT */
    const okButton = await extPage.waitForSelector(`[data-testid="button-ok"]`)
    await okButton.click()
  }, 2000000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
