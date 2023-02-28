import { TYPE } from '../../src/constants/accountConstants'
import { bootstrap } from '../bootstrap'
import Automation from '../utils/automation'
import { ALTERNATIVE_SECRET_PHRASES } from '../utils/testConstants'

describe('Finnie Provider - ETH', () => {
  let context, testDappPage, optionPage, walletAddress

  beforeEach(async () => {
    context = await bootstrap()
    optionPage = context.optionPage
    testDappPage = await context.launchTestDappPage()
    await Automation.importWallet(optionPage, TYPE.ETHEREUM)
    walletAddress = '0xb979707D767230Df79840B39703D86F99C6d84D2'
  }, 50000)

  afterEach(async () => {
    await context.closePages()
    return true
  })

  describe('Ethereum provider', () => {
    it('should call ethereum methods successfully', async () => {
      await testDappPage.bringToFront()

      /* Query check code injection button */
      const codeInjectedButton = await testDappPage.$(`[data-testid="code-injected-button"]`)
      await codeInjectedButton.click()

      /* Query code injection result */
      let codeInjectedResult = await testDappPage.$(`[data-testid="code-injected-result"]`)
      codeInjectedResult = await codeInjectedResult.evaluate((el) => el.textContent)

      /* Expect finnie provider has been injected successfully */
      expect(codeInjectedResult).toEqual('true')

      /* Query connect ethereum button */
      const connectEthereumButton = await testDappPage.$(`[data-testid="connect-ethereum-button"]`)
      await connectEthereumButton.click()
      await testDappPage.waitForTimeout(500)

      /* Open popup page */
      let extPage = await context.launchExtPage()

      /* Query Select Wallet button */
      const selectWalletButton = await extPage.$(`[data-testid="select-wallet-button"]`)
      await selectWalletButton.click()

      /* Query Connect button */
      const connectButton = await extPage.$(`[data-testid="connect-button"]`)
      await connectButton.click()

      /* Focus dapp */
      await testDappPage.bringToFront()

      /* Query ethereum connect result */
      let connectEthereumResult = await testDappPage.waitForSelector(
        `[data-testid="connect-ethereum-result"]:not(:empty)`
      )
      connectEthereumResult = await connectEthereumResult.evaluate((el) => el.textContent)

      /* Expect to receive correct wallet address */
      expect(connectEthereumResult).toEqual(walletAddress)

      /* Switch to Goerli */
      await extPage.close()
      extPage = await context.launchExtPage()
      await Automation.swapToNetwork(extPage, 'Goerli TestNet')
      extPage.close()

      /* Sign transaction */
      await testDappPage.bringToFront()
      const signTransactionEthereumButton = await testDappPage.waitForSelector(
        `[data-testid="sign-transaction-ethereum"]:not(:empty)`
      )
      await signTransactionEthereumButton.click()
      await testDappPage.waitForTimeout(5000)
      extPage = await context.launchExtPage()
      const signButton = await extPage.$(`[data-testid="tx-confirm-send-button"]`)
      await signButton.click()

      /* Expect sign result to be a transaction hash */
      await testDappPage.bringToFront()
      let signEthereumResult = await testDappPage.waitForSelector(
        `[data-testid="sign-ethereum-result"]:not(:empty)`,
        { timeout: 100000 }
      )
      signEthereumResult = await signEthereumResult.evaluate((el) => el.textContent)
      expect(signEthereumResult.length).toEqual(66)
    }, 500000)

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

      /* Query connect Ethereum button */
      const connectEthereumButton = await testDappPage.$(`[data-testid="connect-ethereum-button"]`)
      await connectEthereumButton.click()

      await testDappPage.waitForTimeout(500)

      /* Open popup page */
      let extPage = await context.launchExtPage()

      /* Query Reject Wallet button */
      const rejectButton = await extPage.waitForSelector(`[data-testid="reject-wallet-button"]`)
      await rejectButton.click()

      /* Query connect Ethereum result */
      let connectEthereumResult = await testDappPage.waitForSelector(
        `[data-testid="connect-ethereum-result"]:not(:empty)`
      )
      connectEthereumResult = await connectEthereumResult.evaluate((el) => el.textContent)
      expect(connectEthereumResult).toEqual('User rejected')
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

      /* Query connect Ethereum button */
      const connectEthereumButton = await testDappPage.$(`[data-testid="connect-ethereum-button"]`)
      await connectEthereumButton.click()

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

      /* Query connect Ethereum result */
      let connectEthereumResult = await testDappPage.waitForSelector(
        `[data-testid="connect-ethereum-result"]:not(:empty)`
      )
      connectEthereumResult = await connectEthereumResult.evaluate((el) => el.textContent)
      expect(connectEthereumResult).toEqual('User rejected')
    }, 50000)
  })
})
