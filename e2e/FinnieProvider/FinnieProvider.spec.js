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
  }, 50000)
  
  afterEach(async () => {
    await context.closePages()
    return true
  })
  
  describe('Solana provider', () => {
    it ('should call solana methods successfully', async () => {
      await Automation.importWallet(optionPage, TYPE.SOLANA)
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

  describe('K2 provider', () => {
    it ('should call k2 methods successfully', async () => {
      await Automation.importWallet(optionPage, TYPE.K2)
      const walletAddress = '32Dz2b9UtGymREov4EzkBsn52E6UaXHRLeECwXxEzxJ7'
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
      const connectK2Button = await testDappPage.$(`[data-testid="connect-k2-button"]`)
      await connectK2Button.click()
  
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
  
      /* Query k2 connect result */
      let connectK2Result = await testDappPage.waitForSelector(`[data-testid="connect-k2-result"]`)
      connectK2Result = await connectK2Result.evaluate(el => el.textContent)
  
      /* Expect to receive correct wallet address */
      expect(connectK2Result).toEqual(walletAddress)

      /* Sign transaction */
      await testDappPage.bringToFront()
      const signTransactionK2Button = await testDappPage.$(`[data-testid="sign-transaction-k2"]`)
      await sleep(1000)
      await signTransactionK2Button.click()
      await sleep(5000)
      extPage = await context.launchExtPage()
      const signButton = await extPage.$(`[data-testid="sign-button"]`)
      await signButton.click()
      await sleep(1000)
      extPage.close()

      /* Expect sign result to be correct wallet address */
      await testDappPage.bringToFront()
      let signK2Result = await testDappPage.$(`[data-testid="sign-k2-result"]`)
      signK2Result = await signK2Result.evaluate(el => el.textContent)
      expect(signK2Result).toEqual(walletAddress)

      /* Query Disconnect button */
      const disconnectK2Button = await testDappPage.$(`[data-testid="disconnect-k2-button"]`)
      await disconnectK2Button.click()
      await sleep()
  
      /* Query connect solana result */
      connectK2Result = await testDappPage.waitForSelector(`[data-testid="connect-k2-result"]`)
      connectK2Result = await connectK2Result.evaluate(el => el.textContent)
  
      /* Expect to receive empty string after disconnect */
      expect(connectK2Result).toEqual('')
    }, 50000)
  })

  describe('Ethereum provider', () => {
    it ('should call ethereum methods successfully', async () => {
      await Automation.importWallet(optionPage, TYPE.ETHEREUM)
      const walletAddress = '0x66083923D61D765f5FC51a612f17d64564358716'
      testDappPage.bringToFront()

      /* Query check code injection button */
      const codeInjectedButton = await testDappPage.$(`[data-testid="code-injected-button"]`)
      await codeInjectedButton.click()
  
      /* Query code injection result */
      let codeInjectedResult = await testDappPage.$(`[data-testid="code-injected-result"]`)
      codeInjectedResult = await codeInjectedResult.evaluate(el => el.textContent)
  
      /* Expect finnie provider has been injected successfully */
      expect(codeInjectedResult).toEqual('true')
  
      /* Query connect ethereum button */
      const connectEthereumButton = await testDappPage.$(`[data-testid="connect-ethereum-button"]`)
      await connectEthereumButton.click()
  
      testDappPage.bringToFront()
      await sleep(2000)
  
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
  
      /* Query ethereum connect result */
      let connectEthereumResult = await testDappPage.waitForSelector(`[data-testid="connect-ethereum-result"]`)
      connectEthereumResult = await connectEthereumResult.evaluate(el => el.textContent)
  
      /* Expect to receive correct wallet address */
      expect(connectEthereumResult).toEqual(walletAddress)

      /* Switch to Goerli */
      await extPage.close()
      extPage = await context.launchExtPage()
      await Automation.swapToNetwork(extPage, 'Goerli TestNet')
      extPage.close()

      /* Sign transaction */
      await testDappPage.bringToFront()
      const signTransactionEthereumButton = await testDappPage.$(`[data-testid="sign-transaction-ethereum"]`)
      await sleep(1000)
      await signTransactionEthereumButton.click()
      await sleep(5000)
      extPage = await context.launchExtPage()
      const signButton = await extPage.$(`[data-testid="tx-confirm-send-button"]`)
      await signButton.click()
      await sleep(15000)
      extPage.close()

      /* Expect sign result to be a transactoin hash */
      await testDappPage.bringToFront()
      let signEthereumResult = await testDappPage.$(`[data-testid="sign-ethereum-result"]`)
      signEthereumResult = await signEthereumResult.evaluate(el => el.textContent)
      expect(signEthereumResult.length).toEqual(66)
    }, 50000)
  })
})
