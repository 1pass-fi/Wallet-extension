import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'

describe('Finnie Provider - SOL', () => {
  let context, testDappPage, optionPage, walletAddress

  beforeAll(async () => {
    context = await bootstrap()
    optionPage = context.optionPage
    testDappPage = await context.launchTestDappPage()
    await Automation.importWallet(optionPage, TYPE.SOLANA)
    walletAddress = '9cGCJvVacp5V6xjeshprS3KDN3e5VwEUszHmxxaZuHmJ'
  }, 50000)

  afterAll(async () => {
    await context.closePages()
    return true
  })

  describe('Solana provider', () => {
    it('should call solana methods successfully', async () => {
      await testDappPage.bringToFront()

      /* Query check code injection button */
      const codeInjectedButton = await testDappPage.$(`[data-testid="code-injected-button"]`)
      await codeInjectedButton.click()

      /* Query code injection result */
      let codeInjectedResult = await testDappPage.$(`[data-testid="code-injected-result"]`)
      codeInjectedResult = await codeInjectedResult.evaluate((el) => el.textContent)

      /* Expect finnie provider has been injected successfully */
      expect(codeInjectedResult).toEqual('true')

      /* Query connect solana button */
      const connectSolanaButton = await testDappPage.$(`[data-testid="connect-solana-button"]`)
      await connectSolanaButton.click()

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

      /* Query solana connect result */
      let connectSolanaResult = await testDappPage.waitForSelector(
        `[data-testid="connect-solana-result"]:not(:empty)`
      )
      connectSolanaResult = await connectSolanaResult.evaluate((el) => el.textContent)

      /* Expect to receive correct wallet address */
      expect(connectSolanaResult).toEqual(walletAddress)

      /* Switch to Devnet */
      await extPage.close()
      extPage = await context.launchExtPage()
      await Automation.swapToNetwork(extPage, 'DEVNET')
      extPage.close()

      /* Sign transaction */
      await testDappPage.bringToFront()
      const signTransactionSolanaButton = await testDappPage.$(
        `[data-testid="sign-transaction-solana"]`
      )
      await signTransactionSolanaButton.click()
      await testDappPage.waitForTimeout(5000)
      extPage = await context.launchExtPage()
      const signButton = await extPage.$(`[data-testid="sign-button"]`)
      await signButton.click()

      /* Expect sign result to be correct wallet address */
      await testDappPage.bringToFront()
      let signSolanaResult = await testDappPage.waitForSelector(
        `[data-testid="sign-solana-result"]:not(:empty)`
      )
      signSolanaResult = await signSolanaResult.evaluate((el) => el.textContent)
      expect(signSolanaResult).toEqual(walletAddress)

      /* Query Disconnect button */
      const disconnectSolanaButton = await testDappPage.$(
        `[data-testid="disconnect-solana-button"]`
      )
      await disconnectSolanaButton.click()
      await testDappPage.waitForTimeout(500)

      /* Query connect solana result */
      connectSolanaResult = await testDappPage.waitForSelector(
        `[data-testid="connect-solana-result"]`
      )
      connectSolanaResult = await connectSolanaResult.evaluate((el) => el.textContent)

      /* Expect to receive empty string after disconnect */
      expect(connectSolanaResult).toEqual('')
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

      /* Query connect Solana button */
      const connectSolanaButton = await testDappPage.$(`[data-testid="connect-solana-button"]`)
      await connectSolanaButton.click()

      await testDappPage.waitForTimeout(500)

      /* Open popup page */
      let extPage = await context.launchExtPage()

      /* Query Reject Wallet button */
      const rejectButton = await extPage.waitForSelector(`[data-testid="reject-wallet-button"]`)
      await rejectButton.click()

      /* Query connect Solana result */
      let connectSolanaResult = await testDappPage.waitForSelector(
        `[data-testid="connect-solana-result"]:not(:empty)`
      )
      connectSolanaResult = await connectSolanaResult.evaluate((el) => el.textContent)
      expect(connectSolanaResult).toEqual('User rejected')
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

      /* Query connect Solana button */
      const connectSolanaButton = await testDappPage.$(`[data-testid="connect-solana-button"]`)
      await connectSolanaButton.click()

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

      /* Query connect Solana result */
      let connectSolanaResult = await testDappPage.waitForSelector(
        `[data-testid="connect-solana-result"]:not(:empty)`
      )
      connectSolanaResult = await connectSolanaResult.evaluate((el) => el.textContent)
      expect(connectSolanaResult).toEqual('User rejected')
    }, 50000)
  })
})
