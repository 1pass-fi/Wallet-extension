import useImportedTokenAddresses from 'popup/sharedHooks/useImportedTokenAddresses'
import { popupAccount } from 'services/account'
import renderCustomHook from 'testUtils/renderCustomHook'
import getTokenData from 'utils/getTokenData'
import { getK2CustomTokensData, getSolanaCustomTokensData } from 'utils/getTokenData'

import useTokenList from './useTokenList'

const ethereumToken = {
  logo: 'img/erc20/ETH.svg',
  balance: 1e18, // 1 ETH
  price: 2000,
  name: 'Ether',
  symbol: 'ETH',
  decimal: 18
}

const solanaToken = {
  logo: 'img/v2/solana-logo.svg',
  balance: 1e9,
  price: 40,
  name: 'Solana',
  symbol: 'SOL',
  decimal: 9
}

const arweaveToken = {
  logo: 'img/erc20/AR.svg',
  balance: 1e12,
  price: 40,
  name: 'Arweave',
  symbol: 'AR',
  decimal: 12
}

const koiiToken = {
  logo: 'img/erc20/KOII.svg',
  balance: 1,
  price: 0,
  name: 'Koii',
  symbol: 'KOII',
  decimal: 0,
  contractAddress: 'QA7AIFVx1KBBmzC7WUNhJbDsHlSJArUT0jWrhZMZPS8'
}

const k2Token = {
  logo: 'img/v2/k2-logos/finnie-k2-logo.svg',
  balance: 1e9,
  price: 0,
  name: 'Koii',
  symbol: 'KOII',
  decimal: 9
}

const customToken1 = {
  logo: '/path',
  balance: 1,
  price: 10,
  name: 'ABC',
  symbol: 'ABC',
  decimal: 6,
  contractAddress: 'tokenAddress1'
}

const customToken2 = {
  logo: '/path',
  balance: 1,
  price: 10,
  name: 'ABC',
  symbol: 'ABC',
  decimal: 6,
  contractAddress: 'tokenAddress2'
}

jest.mock('services/account')
jest.mock('services/storage')
jest.mock('popup/sharedHooks/useImportedTokenAddresses')
jest.mock('utils')
jest.mock('utils/getTokenData')

describe('useTokenList testsuite', () => {
  /* ETHEREUM*/
  describe('load Ethereum tokenList, selectedToken correctly', () => {
    beforeEach(() => {
      useImportedTokenAddresses.mockReturnValue({ importedTokenAddresses: [] })
      getTokenData.mockImplementation(async () => ({
        logo: 'logo',
        balance: 'balance',
        price: 'price',
        name: 'name',
        symbol: 'symbol',
        decimal: 'decimal',
        contractAddress: 'contractAddress'
      }))
      const mockAccountGetMetadata = jest.fn().mockImplementation(async () => ({
        address: 'example_address',
        balance: 1,
        koiBalance: 'koi_balance',
        accountName: 'example_accountName',
        type: 'example_type',
        provider: 'example_provider',
        seedPhrase: 'example_seedphrase',
        affiliateCode: 'example_affiliateCode',
        inviteSpent: 'example_inviteSpent',
        totalReward: 'example_totalReward',
        didData: 'example_didData',
        totalAssets: '10'
      }))

      popupAccount.getAccount.mockReturnValue({ get: { metadata: mockAccountGetMetadata } })
    })
    it('should return only ethereum token', async () => {
      let result = await renderCustomHook(useTokenList, {
        selectedNetwork: 'TYPE_ETHEREUM',
        selectedAccount: {
          account_name: 'account_name',
          address: 'example_address',
          balance: 1,
          koi_balance: 'koi_balance',
          seed_phrase: 'seed_phrase',
          type: 'TYPE_ETHEREUM'
        }
      })
      const { tokenList, selectedToken } = result.current
      expect(tokenList).toEqual([ethereumToken])
      expect(selectedToken).toEqual(ethereumToken)
    })

    it('should return ethereum and custom tokens', async () => {
      useImportedTokenAddresses.mockReturnValue({
        importedTokenAddresses: ['tokenAddress1', 'tokenAddress2']
      })
      getTokenData.mockImplementation(async (tokenAddress, userAddress) => ({
        logo: '/path',
        balance: 1,
        price: 10,
        name: 'ABC',
        symbol: 'ABC',
        decimal: 6,
        contractAddress: tokenAddress
      }))

      let result = await renderCustomHook(useTokenList, {
        selectedNetwork: 'TYPE_ETHEREUM',
        selectedAccount: {
          account_name: 'account_name',
          address: 'example_address',
          balance: '10',
          koi_balance: 'koi_balance',
          seed_phrase: 'seed_phrase',
          type: 'TYPE_ETHEREUM'
        }
      })

      const { tokenList, selectedToken } = result.current
      expect(tokenList).toEqual([ethereumToken, customToken1, customToken2])
      expect(selectedToken).toEqual(ethereumToken)
    })
  })

  /* ARWEAVE*/
  describe('load Arweave tokenList, selectedToken correctly', () => {
    beforeEach(() => {
      useImportedTokenAddresses.mockReturnValue({ importedTokenAddresses: [] })
      getTokenData.mockImplementation(async () => ({
        logo: 'logo',
        balance: 'balance',
        price: 'price',
        name: 'name',
        symbol: 'symbol',
        decimal: 'decimal',
        contractAddress: 'contractAddress'
      }))
      const mockAccountGetMetadata = jest.fn().mockImplementation(async () => ({
        address: 'example_address',
        balance: 1,
        koiBalance: 1,
        accountName: 'example_accountName',
        type: 'example_type',
        provider: 'example_provider',
        seedPhrase: 'example_seedphrase',
        affiliateCode: 'example_affiliateCode',
        inviteSpent: 'example_inviteSpent',
        totalReward: 'example_totalReward',
        didData: 'example_didData',
        totalAssets: '10'
      }))

      popupAccount.getAccount.mockReturnValue({ get: { metadata: mockAccountGetMetadata } })
    })
    it('should return both arweave and koii_1 token', async () => {
      let result = await renderCustomHook(useTokenList, {
        selectedNetwork: 'TYPE_ARWEAVE',
        selectedAccount: {
          account_name: 'account_name',
          address: 'example_address',
          balance: 1,
          koi_balance: 1,
          seed_phrase: 'seed_phrase',
          type: 'TYPE_ARWEAVE'
        }
      })
      const { tokenList, selectedToken } = result.current
      expect(tokenList).toEqual([arweaveToken, koiiToken])
      expect(selectedToken).toEqual(koiiToken)
    })
  })

  /* SOLANA */
  describe('load Solana tokenList, selectedToken correctly', () => {
    beforeEach(() => {
      useImportedTokenAddresses.mockReturnValue({ importedTokenAddresses: [] })
      getTokenData.mockImplementation(async () => ({
        logo: 'logo',
        balance: 'balance',
        price: 'price',
        name: 'name',
        symbol: 'symbol',
        decimal: 'decimal',
        contractAddress: 'contractAddress'
      }))
      const mockAccountGetMetadata = jest.fn().mockImplementation(async () => ({
        address: 'example_address',
        balance: 1e9,
        koiBalance: 'koi_balance',
        accountName: 'example_accountName',
        type: 'example_type',
        provider: 'example_provider',
        seedPhrase: 'example_seedphrase',
        affiliateCode: 'example_affiliateCode',
        inviteSpent: 'example_inviteSpent',
        totalReward: 'example_totalReward',
        didData: 'example_didData',
        totalAssets: '10'
      }))

      popupAccount.getAccount.mockReturnValue({ get: { metadata: mockAccountGetMetadata } })
    })
    it('should return only solana token', async () => {
      let result = await renderCustomHook(useTokenList, {
        selectedNetwork: 'TYPE_SOLANA',
        selectedAccount: {
          account_name: 'account_name',
          address: 'example_address',
          balance: '10',
          koi_balance: 'koi_balance',
          seed_phrase: 'seed_phrase',
          type: 'TYPE_SOLANA'
        }
      })
      const { tokenList, selectedToken } = result.current
      expect(tokenList).toEqual([solanaToken])
      expect(selectedToken).toEqual(solanaToken)
    })

    it('should return solana and custom tokens', async () => {
      useImportedTokenAddresses.mockReturnValue({
        importedTokenAddresses: ['tokenAddress1', 'tokenAddress2']
      })
      getSolanaCustomTokensData.mockImplementation(async (tokenAddress, userAddress) => ({
        logo: '/path',
        balance: 1,
        price: 10,
        name: 'ABC',
        symbol: 'ABC',
        decimal: 6,
        contractAddress: tokenAddress
      }))

      let result = await renderCustomHook(useTokenList, {
        selectedNetwork: 'TYPE_SOLANA',
        selectedAccount: {
          account_name: 'account_name',
          address: 'example_address',
          balance: 1,
          koi_balance: 'koi_balance',
          seed_phrase: 'seed_phrase',
          type: 'TYPE_SOLANA'
        }
      })

      const { tokenList, selectedToken } = result.current
      expect(tokenList).toEqual([solanaToken, customToken1, customToken2])
      expect(selectedToken).toEqual(solanaToken)
    })
  })

  /* K2 */
  describe('load Solana tokenList, selectedToken correctly', () => {
    beforeEach(() => {
      useImportedTokenAddresses.mockReturnValue({ importedTokenAddresses: [] })
      getTokenData.mockImplementation(async () => ({
        logo: 'logo',
        balance: 'balance',
        price: 'price',
        name: 'name',
        symbol: 'symbol',
        decimal: 'decimal',
        contractAddress: 'contractAddress'
      }))
      const mockAccountGetMetadata = jest.fn().mockImplementation(async () => ({
        address: 'example_address',
        balance: 1e9,
        koiBalance: 'koi_balance',
        accountName: 'example_accountName',
        type: 'example_type',
        provider: 'example_provider',
        seedPhrase: 'example_seedphrase',
        affiliateCode: 'example_affiliateCode',
        inviteSpent: 'example_inviteSpent',
        totalReward: 'example_totalReward',
        didData: 'example_didData',
        totalAssets: '10'
      }))

      popupAccount.getAccount.mockReturnValue({ get: { metadata: mockAccountGetMetadata } })
    })
    it('should return only solana token', async () => {
      let result = await renderCustomHook(useTokenList, {
        selectedNetwork: 'K2',
        selectedAccount: {
          account_name: 'account_name',
          address: 'example_address',
          balance: '10',
          koi_balance: 'koi_balance',
          seed_phrase: 'seed_phrase',
          type: 'K2'
        }
      })
      const { tokenList, selectedToken } = result.current
      expect(tokenList).toEqual([k2Token])
      expect(selectedToken).toEqual(k2Token)
    })

    it('should return solana and custom tokens', async () => {
      useImportedTokenAddresses.mockReturnValue({
        importedTokenAddresses: ['tokenAddress1', 'tokenAddress2']
      })
      getK2CustomTokensData.mockImplementation(async (tokenAddress, userAddress) => ({
        logo: '/path',
        balance: 1,
        price: 10,
        name: 'ABC',
        symbol: 'ABC',
        decimal: 6,
        contractAddress: tokenAddress
      }))

      let result = await renderCustomHook(useTokenList, {
        selectedNetwork: 'K2',
        selectedAccount: {
          account_name: 'account_name',
          address: 'example_address',
          balance: 1,
          koi_balance: 'koi_balance',
          seed_phrase: 'seed_phrase',
          type: 'K2'
        }
      })

      const { tokenList, selectedToken } = result.current
      expect(tokenList).toEqual([k2Token, customToken1, customToken2])
      expect(selectedToken).toEqual(k2Token)
    })
  })
})
