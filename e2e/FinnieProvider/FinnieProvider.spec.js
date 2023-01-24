import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'

const sleep = (time = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

describe('Finnie Provider', () => {
  let context, testDappPage, optionPage
  
  beforeEach(async () => {
    context = await bootstrap()
    optionPage = context.optionPage
    testDappPage = await context.launchTestDappPage()

    await Automation.importWallet(optionPage, TYPE.SOLANA)
  }, 50000)

  afterEach(async () => {
    await context.closePages()
    return true
  })

  describe('Solana provider', () => {
    it ('should call solana methods successfully', async () => {
      const walletAddress = '9cGCJvVacp5V6xjeshprS3KDN3e5VwEUszHmxxaZuHmJ'
      testDappPage.bringToFront()

      /* Query check code injection button */
      const codeInjectedButton = await testDappPage.$(`[data-testid="code-injected-button"]`)
      await codeInjectedButton.click()
  
      /* Query code injection result */
      let codeInjectedResult = await testDappPage.$(`[data-testid="code-injected-result"]`)
      codeInjectedResult = await codeInjectedResult.evaluate(el => el.textContent)
  
      /* Expect finnie provider has been injected successfully */
      expect(codeInjectedResult).toEqual('true')
  
      /* Query connect solana button */
      const connectSolanaButton = await testDappPage.$(`[data-testid="connect-solana-button"]`)
      await connectSolanaButton.click()
  
      testDappPage.bringToFront()
      await sleep()
  
      /* Open popup page */
      let extPage = await context.launchExtPage()

      /* Query Select Wallet button */
      const selectWalletButton = await extPage.$(`[data-testid="select-wallet-button"]`)
      await selectWalletButton.click()
  
      /* Query Connect button */
      const connectButton = await extPage.$(`[data-testid="connect-button"]`)
      await connectButton.click()
      sleep(1000)
  
      /* Focus dapp */
      testDappPage.bringToFront()
      await sleep()
  
      /* Query solana connect result */
      let connectSolanaResult = await testDappPage.waitForSelector(`[data-testid="connect-solana-result"]`)
      connectSolanaResult = await connectSolanaResult.evaluate(el => el.textContent)
  
      /* Expect to receive correct wallet address */
      expect(connectSolanaResult).toEqual(walletAddress)

      /* Switch to Devnet */
      await extPage.close()
      extPage = await context.launchExtPage()
      await Automation.swapToNetwork(extPage, 'DEVNET')
      extPage.close()

      /* Sign transaction */
      await testDappPage.bringToFront()
      const signTransactionSolanaButton = await testDappPage.$(`[data-testid="sign-transaction-solana"]`)
      await sleep(1000)
      await signTransactionSolanaButton.click()
      await sleep(5000)
      extPage = await context.launchExtPage()
      const signButton = await extPage.$(`[data-testid="sign-button"]`)
      await signButton.click()
      await sleep(1000)
      extPage.close()

      /* Expect sign result to be correct wallet address */
      await testDappPage.bringToFront()
      let signSolanaResult = await testDappPage.$(`[data-testid="sign-solana-result"]`)
      signSolanaResult = await signSolanaResult.evaluate(el => el.textContent)
      expect(signSolanaResult).toEqual(walletAddress)

      /* Query Disconnect button */
      const disconnectSolanaButton = await testDappPage.$(`[data-testid="disconnect-solana-button"]`)
      await disconnectSolanaButton.click()
      await sleep()
  
      /* Query connect solana result */
      connectSolanaResult = await testDappPage.waitForSelector(`[data-testid="connect-solana-result"]`)
      connectSolanaResult = await connectSolanaResult.evaluate(el => el.textContent)
  
      /* Expect to receive empty string after disconnect */
      expect(connectSolanaResult).toEqual('')
    }, 50000)
  })
})
