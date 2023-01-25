import { BaseProvider, InfuraProvider, Provider } from '@ethersproject/providers'
import * as bip39 from 'bip39'
import { ETH_NETWORK_PROVIDER } from 'constants/koiConstants'
import { BigNumber, ethers, providers } from 'ethers'

import { EthereumTool } from '.'
/* CONSTANT FOR TESTING */
const SECRET_PHRASES = 'cluster cram fish penalty twelve evoke because wheel close income bag pupil'
const WALLET_ADDRESS = '0x66083923D61D765f5FC51a612f17d64564358716'
const WALLET_KEY = '0x0ea98b5b46f3b452171da0e3bd335f6280205d2cc48b89d042c67cd25e1a2b56'

describe('EthereumTool class', () => {
  beforeAll(() => {
    jest.spyOn(bip39, 'generateMnemonic').mockReturnValue(SECRET_PHRASES)
  })

  describe('clarifyEthereumProvider function', () => {
    it('should correctly return result when there is no error', () => {})
    it('should correctly return result when errors occured', () => {})
  })

  describe('createNewWallet function', () => {
    it('should correctly return wallet with appropriate address', () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.GOERLI)
      const secretPhrase = ethTool.createNewWallet()

      expect(secretPhrase).toBe(SECRET_PHRASES)
      expect(ethTool.address).toBe(WALLET_ADDRESS)
      expect(ethTool.key).toBe(WALLET_KEY)
    })
  })

  describe('importWallet function', () => {
    it('should correctly return the wallet when import with private key', () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.GOERLI)
      const wallet = ethTool.importWallet(WALLET_KEY, 'key')

      expect(ethTool.address).toBe(WALLET_ADDRESS)
      expect(ethTool.key).toBe(WALLET_KEY)

      expect(wallet.address).toBe(WALLET_ADDRESS)
      expect(wallet.privateKey).toBe(WALLET_KEY)
    })

    it('should correctly return the wallet when import with secret phrase', () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.GOERLI)
      const wallet = ethTool.importWallet(SECRET_PHRASES, 'seedphrase')

      expect(ethTool.address).toBe(WALLET_ADDRESS)
      expect(ethTool.key).toBe(WALLET_KEY)

      expect(wallet.address).toBe(WALLET_ADDRESS)
      expect(wallet.privateKey).toBe(WALLET_KEY)
    })
  })

  describe('transferEth function', () => {
    second
  })

  describe('getBalance function', () => {
    let ethTool
    it('should get correct balance type and value with Goerli network', async () => {
      ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.GOERLI)
      ethTool.importWallet(SECRET_PHRASES, 'seedphrase')
      const balance = await ethTool.getBalance()
      expect(balance instanceof BigNumber).toBeTruthy()
      expect(Number(ethers.utils.formatEther(balance))).toBeGreaterThan(0)
    })

    it('should get correct balance type and value with Mainnet network', async () => {
      ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.MAINNET)
      ethTool.importWallet(SECRET_PHRASES, 'seedphrase')
      const balance = await ethTool.getBalance()
      expect(balance instanceof BigNumber).toBeTruthy()
      expect(Number(ethers.utils.formatEther(balance))).toBe(0)
    })
  })

  describe('getTransactionStatus', () => {
    second
  })
})
