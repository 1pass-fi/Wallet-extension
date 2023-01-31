import { useEffect, useState } from 'react'
import { TokenListProvider } from '@solana/spl-token-registry'
import ERC20_ABI from 'abi/ERC20.json'
import { TYPE } from 'constants/accountConstants'
import { SOL_NETWORK_PROVIDER } from 'constants/koiConstants'
import { ethers } from 'ethers'
import { get, isEmpty } from 'lodash'
import { popupAccount } from 'services/account'
import storage from 'services/storage'
import hardcodeSolanaTokens from 'solanaTokens/solanaTokens'
import { clarifyEthereumProvider } from 'utils'
import Web3 from 'web3'

const useImportedTokenAddresses = ({ userAddress, currentProviderAddress }) => {
  const [importedTokenAddresses, setImportedTokenAddresses] = useState([])

  const checkValidToken = async (tokenAddress) => {
    try {
      const provider = await storage.setting.get.ethereumProvider()
      const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)
      const network = ethers.providers.getNetwork(ethNetwork)

      const web3 = new ethers.providers.InfuraProvider(network, apiKey)
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, web3)
      const name = await tokenContract.name()
      return true
    } catch (err) {
      console.log('checkValidToken error: ', err)
      return false
    }
  }

  const checkValidSolanaToken = async (tokenAddress) => {
    try {
      const clusterSlug = await storage.setting.get.solanaProvider()

      let chainId
      switch (clusterSlug) {
        case SOL_NETWORK_PROVIDER.MAINNET:
          chainId = 101
          break
        case SOL_NETWORK_PROVIDER.TESTNET:
          chainId = 102
          break
        case SOL_NETWORK_PROVIDER.DEVNET:
          chainId = 103
          break
      }

      let _hardcodeSolanaTokens = hardcodeSolanaTokens.filter((token) => token.chainId === chainId)

      const tokenlistContainer = await new TokenListProvider().resolve()
      let tokenList = tokenlistContainer.filterByClusterSlug(clusterSlug).getList()
      tokenList = [...tokenList, ..._hardcodeSolanaTokens]

      const result = tokenList.find(
        ({ address }) => address?.toLowerCase() === tokenAddress?.toLowerCase()
      )
      return !isEmpty(result)
    } catch (err) {
      return false
    }
  }

  const checkValidK2Token = async (tokenAddress) => {
    // TODO DatH - LongP
    return true
  }

  const loadEthAddresses = async () => {
    const importedErc20Tokens = await storage.setting.get.importedErc20Tokens()
    const tokenAddresses = Object.keys(importedErc20Tokens).reduce((result, key) => {
      if (importedErc20Tokens[key].includes(userAddress)) {
        result.push(key)
      }
      return result
    }, [])

    if (!isEmpty(tokenAddresses)) {
      let validTokenAddresses = (
        await Promise.all(
          tokenAddresses.map(async (tokenAddress) => {
            const valid = await checkValidToken(tokenAddress)
            if (valid) return tokenAddress
            return null
          })
        )
      ).filter((tokenAddress) => !!tokenAddress)

      return validTokenAddresses
    } else {
      return []
    }
  }

  const loadSolanaAddresses = async () => {
    const importedSolanaCustomTokens = await storage.setting.get.importedSolanaCustomTokens()
    const tokenAddresses = Object.keys(importedSolanaCustomTokens).filter((key) =>
      importedSolanaCustomTokens[key].includes(userAddress)
    )

    if (!isEmpty(tokenAddresses)) {
      let validTokenAddresses = (
        await Promise.all(
          tokenAddresses.map(async (tokenAddress) => {
            const valid = await checkValidSolanaToken(tokenAddress)
            if (valid) return tokenAddress
            return null
          })
        )
      ).filter((tokenAddress) => !!tokenAddress)

      return validTokenAddresses
    } else {
      return []
    }
  }

  const loadK2Addresses = async () => {
    const importedK2CustomTokens = await storage.setting.get.importedK2CustomTokens()
    const tokenAddresses = Object.keys(importedK2CustomTokens).filter((key) =>
      importedK2CustomTokens[key].includes(userAddress)
    )

    if (!isEmpty(tokenAddresses)) {
      let validTokenAddresses = (
        await Promise.all(
          tokenAddresses.map(async (tokenAddress) => {
            const valid = await checkValidK2Token(tokenAddress)
            if (valid) return tokenAddress
            return null
          })
        )
      ).filter((tokenAddress) => !!tokenAddress)

      return validTokenAddresses
    } else {
      return []
    }
  }

  useEffect(() => {
    const loadImportedTokenAddresses = async () => {
      setImportedTokenAddresses([])
      let result = []
      const account = await popupAccount.getAccount({ address: userAddress })
      const accountData = await account.get.metadata()

      if (!isEmpty(accountData)) {
        if (accountData.type === TYPE.K2) {
          result = await loadK2Addresses()
        }
        if (accountData.type === TYPE.SOLANA) {
          result = await loadSolanaAddresses()
        }
        if (accountData.type === TYPE.ETHEREUM) {
          result = await loadEthAddresses()
        }
        setImportedTokenAddresses(result)
      }
    }

    if (!isEmpty(userAddress)) loadImportedTokenAddresses()
  }, [userAddress, currentProviderAddress])

  return { importedTokenAddresses }
}

export default useImportedTokenAddresses
