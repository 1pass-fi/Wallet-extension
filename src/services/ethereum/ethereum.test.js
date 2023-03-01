import * as bip39 from 'bip39'
import { ETH_NETWORK_PROVIDER } from 'constants/koiConstants'
import { ethers } from 'ethers'

import { EthereumTool } from '.'
/* CONSTANT FOR TESTING */
const SECRET_PHRASES = 'path zero antique girl wolf call thank powder like auto oppose faculty'
const WALLET_ADDRESS = '0xb979707D767230Df79840B39703D86F99C6d84D2'
const WALLET_KEY = '0xf7aeac55e1ba534e9fb04a39d6658f298fae4e19bef62194e82f7aef280a5280'

describe('EthereumTool class', () => {
  const mockedGetBalance = jest.fn().mockResolvedValue(42)
  const mockedGetTransactionReceipt = jest.fn().mockResolvedValue({})

  beforeAll(() => {
    jest.spyOn(bip39, 'generateMnemonic').mockReturnValue(SECRET_PHRASES)
    ethers.providers.InfuraProvider.prototype.getBalance = mockedGetBalance
    ethers.providers.InfuraProvider.prototype.getTransactionReceipt = mockedGetTransactionReceipt
  })

  describe('getter web3 function', () => {
    it('should correctly return result with goerli provider', async () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.GOERLI)
      const web3 = ethTool.web3()
      const { name, chainId } = await web3.getNetwork()

      expect(name).toBe('goerli')
      expect(chainId).toBe(5)
    })

    it('should correctly return result when mainnet provider', async () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.MAINNET)
      const web3 = ethTool.web3()
      const { name, chainId } = await web3.getNetwork()

      expect(name).toBe('homestead')
      expect(chainId).toBe(1)
    })
  })

  describe('getter current network function', () => {
    it('should correctly return result with goerli provider', () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.GOERLI)
      const provider = ethTool.getCurrentNetWork()

      expect(provider).toBe(ETH_NETWORK_PROVIDER.GOERLI)
    })

    it('should correctly return result when mainnet provider', () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.MAINNET)
      const provider = ethTool.getCurrentNetWork()

      expect(provider).toBe(ETH_NETWORK_PROVIDER.MAINNET)
    })
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

  describe('getBalance function', () => {
    it('should be called once with the correct parameter', async () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.GOERLI)
      ethTool.importWallet(SECRET_PHRASES, 'seedphrase')
      const balance = await ethTool.getBalance()

      expect(mockedGetBalance).toBeCalledTimes(1)
      expect(mockedGetBalance).toBeCalledWith(WALLET_ADDRESS)
    })
  })

  describe('getTransactionStatus function ', () => {
    it('should be called once with the correct parameter', async () => {
      const ethTool = new EthereumTool(ETH_NETWORK_PROVIDER.GOERLI)
      const txHash = '0x431dd7099dd206d79647eaf8680b026b51ecc1276f3c13b726d1ed86ff0775bf'
      const txReceipt = await ethTool.getTransactionStatus(txHash)

      expect(mockedGetTransactionReceipt).toBeCalledTimes(1)
      expect(mockedGetTransactionReceipt).toBeCalledWith(txHash)
    })
  })
})
