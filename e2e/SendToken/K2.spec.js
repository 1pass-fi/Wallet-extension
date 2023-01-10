import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import { ALTERNATIVE_SECRET_PHRASES } from '../utils/testConstants'

// TODO - add delay 500ms for demo

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

  it('should successfully to send K2 token', async () => {
    await extPage.bringToFront()

    const goToSendButton = await extPage.waitForSelector('a[role="button"]')
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector('[role="button"]')
    // console.log('tokenDropdown', tokenDropdown)
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="KOII"]`)
    await tokenOption.click()

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('0.0001')

    const recipientAddressInputField = await extPage.waitForSelector(
      `[data-testid="recipient-address"]`
    )
    await recipientAddressInputField.type('32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzxJ7')

    const sendTokensButton = await extPage.waitForSelector(`[data-testid="send-tokens-button"]`)
    await sendTokensButton.click()

    // TODO DatH - wait for TRANSACTION CONFIRM MODAL data
    await extPage.waitForTimeout(1000)

    /* TRANSACTION CONFIRM MODAL */
    const senderConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-sender"]`)
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe('32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzxJ7')

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe('32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzxJ7')

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('0.0001 KOII')

    const [sendButton] = await extPage.$x('//button[text()="Send"]')
    await sendButton.click()

    // /* TRANSACTION RECEIPT */
    await extPage.waitForTimeout(1000)
    const okButton = await extPage.waitForSelector('a[role="button"]')
    await okButton.click()

    await extPage.waitForTimeout(1000)
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

    // TODO DatH - wait for TRANSACTION CONFIRM MODAL data
    await extPage.waitForTimeout(10000)

    const goToSendButton = await extPage.waitForSelector('a[role="button"]')
    await goToSendButton.click()

    /* SEND TOKEN FORM */
    const tokenDropdown = await extPage.waitForSelector('[role="button"]')
    // console.log('tokenDropdown', tokenDropdown)
    await tokenDropdown.click()

    const tokenOption = await extPage.waitForSelector(`[data-testid="WIBU"]`)
    await tokenOption.click()
    await extPage.waitForTimeout(1000)

    const amountInputField = await extPage.waitForSelector(`[data-testid="input-send-amount"]`)
    await amountInputField.type('0.0001')

    const recipientAddressInputField = await extPage.waitForSelector(
      `[data-testid="recipient-address"]`
    )
    await recipientAddressInputField.type('32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzxJ7')

    const sendTokensButton = await extPage.waitForSelector(`[data-testid="send-tokens-button"]`)
    await sendTokensButton.click()

    // TODO DatH - wait for TRANSACTION CONFIRM MODAL data
    await extPage.waitForTimeout(5000)

    /* TRANSACTION CONFIRM MODAL */
    const senderConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-sender"]`)
    const sender = await senderConfirm.evaluate((el) => el.textContent)

    expect(sender).toBe('32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzxJ7')

    const recipientConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-recipient"]`)
    const recipient = await recipientConfirm.evaluate((el) => el.textContent)
    expect(recipient).toBe('32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzxJ7')

    const amountConfirm = await extPage.waitForSelector(`[data-testid="tx-confirm-amount"]`)
    const amount = await amountConfirm.evaluate((el) => el.textContent)
    expect(amount).toBe('0.0001 WIBU')

    const [sendButton] = await extPage.$x('//button[text()="Send"]')
    await sendButton.click()

    // /* TRANSACTION RECEIPT */
    await extPage.waitForTimeout(1000)
    const okButton = await extPage.waitForSelector('a[role="button"]')
    await okButton.click()

    await extPage.waitForTimeout(1000)
  }, 500000)

  afterAll(async () => {
    await context.closePages()
    return true
  })
})
