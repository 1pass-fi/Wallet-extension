import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'

describe('Finnie Provider - K2', () => {
  let context, testDappPage, optionPage, walletAddress

  beforeAll(async () => {
    context = await bootstrap()
    optionPage = context.optionPage
    testDappPage = await context.launchTestDappPage()
    await Automation.importWallet(optionPage, TYPE.K2)
    walletAddress = '32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzxJ7'
  }, 50000)

  afterAll(async () => {
    await context.closePages()
    return true
  })

  describe('K2 provider', () => {
    it('should call k2 methods successfully', async () => {
      await testDappPage.bringToFront()

      /* Query check code injection button */
      const codeInjectedButton = await testDappPage.$(`[data-testid="code-injected-button"]`)
      await codeInjectedButton.click()

      /* Query code injection result */
      let codeInjectedResult = await testDappPage.$(`[data-testid="code-injected-result"]`)
      codeInjectedResult = await codeInjectedResult.evaluate((el) => el.textContent)

      /* Expect finnie provider has been injected successfully */
      expect(codeInjectedResult).toEqual('true')

      /* Query connect K2 button */
      const connectK2Button = await testDappPage.$(`[data-testid="connect-k2-button"]`)
      await connectK2Button.click()

      await testDappPage.waitForTimeout(500)

      /* Open popup page */
      let extPage = await context.launchExtPage()

      /* Query Select Wallet button */
      const selectWalletButton = await extPage.waitForSelector(
        `[data-testid="select-wallet-button"]`
      )
      await selectWalletButton.click()

      /* Query Connect button */
      const connectButton = await extPage.$(`[data-testid="connect-button"]`)
      await connectButton.click()

      /* Focus dapp */
      await testDappPage.bringToFront()

      /* Query k2 connect result */
      let connectK2Result = await testDappPage.waitForSelector(
        `[data-testid="connect-k2-result"]:not(:empty)`
      )
      connectK2Result = await connectK2Result.evaluate((el) => el.textContent)

      /* Expect to receive correct wallet address */
      expect(connectK2Result).toEqual(walletAddress)

      /* Sign transaction */
      await testDappPage.bringToFront()
      const signTransactionK2Button = await testDappPage.$(`[data-testid="sign-transaction-k2"]`)
      await signTransactionK2Button.click()
      await testDappPage.waitForTimeout(5000)
      extPage = await context.launchExtPage()
      const signButton = await extPage.$(`[data-testid="sign-button"]`)
      await signButton.click()

      /* Expect sign result to be correct wallet address */
      await testDappPage.bringToFront()
      let signK2Result = await testDappPage.waitForSelector(
        `[data-testid="sign-k2-result"]:not(:empty)`
      )
      signK2Result = await signK2Result.evaluate((el) => el.textContent)
      expect(signK2Result).toEqual(walletAddress)

      /* Query Disconnect button */
      const disconnectK2Button = await testDappPage.$(`[data-testid="disconnect-k2-button"]`)
      await disconnectK2Button.click()
      await testDappPage.waitForTimeout(500)

      /* Query connect K2 result */
      connectK2Result = await testDappPage.waitForSelector(`[data-testid="connect-k2-result"]`)
      connectK2Result = await connectK2Result.evaluate((el) => el.textContent)

      /* Expect to receive empty string after disconnect */
      expect(connectK2Result).toEqual('')
    }, 50000)

    it('should reject connect successfully', async () => {
      await testDappPage.bringToFront()

      /* Query check code injection button */
      const codeInjectedButton = await testDappPage.$(`[data-testid="code-injected-button"]`)
      await codeInjectedButton.click()

      /* Query code injection result */
      let codeInjectedResult = await testDappPage.$(`[data-testid="code-injected-result"]`)
      codeInjectedResult = await codeInjectedResult.evaluate((el) => el.textContent)

      /* Expect finnie provider has been injected successfully */
      expect(codeInjectedResult).toEqual('true')

      /* Query connect K2 button */
      const connectK2Button = await testDappPage.$(`[data-testid="connect-k2-button"]`)
      await connectK2Button.click()

      await testDappPage.waitForTimeout(500)

      /* Open popup page */
      let extPage = await context.launchExtPage()

      /* Query Reject Wallet button */
      const rejectButton = await extPage.waitForSelector(`[data-testid="reject-wallet-button"]`)
      await rejectButton.click()

      /* Query connect K2 result */
      let connectK2Result = await testDappPage.waitForSelector(
        `[data-testid="connect-k2-result"]:not(:empty)`
      )
      connectK2Result = await connectK2Result.evaluate((el) => el.textContent)
      expect(connectK2Result).toEqual('User rejected')
    }, 50000)

    it('should reject permission successfully', async () => {
      await testDappPage.bringToFront()

      /* Query check code injection button */
      const codeInjectedButton = await testDappPage.$(`[data-testid="code-injected-button"]`)
      await codeInjectedButton.click()

      /* Query code injection result */
      let codeInjectedResult = await testDappPage.$(`[data-testid="code-injected-result"]`)
      codeInjectedResult = await codeInjectedResult.evaluate((el) => el.textContent)

      /* Expect finnie provider has been injected successfully */
      expect(codeInjectedResult).toEqual('true')

      /* Query connect K2 button */
      const connectK2Button = await testDappPage.$(`[data-testid="connect-k2-button"]`)
      await connectK2Button.click()

      await testDappPage.waitForTimeout(500)

      /* Open popup page */
      let extPage = await context.launchExtPage()

      /* Query Select Wallet button */
      const selectWalletButton = await extPage.waitForSelector(
        `[data-testid="select-wallet-button"]`
      )
      await selectWalletButton.click()

      /* Query Select Wallet button */
      const rejectButton = await extPage.waitForSelector(`[data-testid="reject-connect-button"]`)
      await rejectButton.click()

      /* Query connect K2 result */
      let connectK2Result = await testDappPage.waitForSelector(
        `[data-testid="connect-k2-result"]:not(:empty)`
      )
      connectK2Result = await connectK2Result.evaluate((el) => el.textContent)
      expect(connectK2Result).toEqual('User rejected')
    }, 50000)
  })
})
