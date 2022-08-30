import { useEffect,useState } from 'react'
import { TokenListProvider } from '@solana/spl-token-registry'
import ERC20_ABI from 'abi/ERC20.json'
import { TYPE } from 'constants/accountConstants'
import { SOL_NETWORK_PROVIDER } from 'constants/koiConstants'
import { get, isEmpty } from 'lodash'
import { popupAccount } from 'services/account'
import storage from 'services/storage'
import hardcodeSolanaTokens from 'solanaTokens/solanaTokens'
import Web3 from 'web3'

const useImportedTokenAddresses = ({ userAddress, currentProviderAddress }) => {
  const [importedTokenAddresses, setImportedTokenAddresses] = useState([])

  const checkValidToken = async (tokenAddress) => {
    try {
      const provider = await storage.setting.get.ethereumProvider()
      const web3 = new Web3(provider)
      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
      await tokenContract.methods.name().call()

      return true
    } catch (err) {
      return false
    }
  }

  const checkValidSolanaToken = async (tokenAddress) => {
    try {
      const clusterSlug = await storage.setting.get.solanaProvider()

      let chainId
      switch(clusterSlug) {
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

      let _hardcodeSolanaTokens = hardcodeSolanaTokens.filter(token => token.chainId === chainId)

      const tokenlistContainer = await new TokenListProvider().resolve()
      let tokenList = tokenlistContainer.filterByClusterSlug(clusterSlug).getList()
      tokenList =[...tokenList, ..._hardcodeSolanaTokens]

      const result = tokenList.find(
        ({ address }) => address?.toLowerCase() === tokenAddress?.toLowerCase()
      )
      return !isEmpty(result)
    } catch (err) {
      return false
    }
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

      setImportedTokenAddresses(validTokenAddresses)
    } else {
      setImportedTokenAddresses([])
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

      setImportedTokenAddresses(validTokenAddresses)
    } else {
      setImportedTokenAddresses([])
    }
  }

  useEffect(() => {
    const loadImportedTokenAddresses = async () => {
      const account = await popupAccount.getAccount({ address: userAddress })
      const accountData = await account.get.metadata()

      if (!isEmpty(accountData) && accountData.type === TYPE.SOLANA) loadSolanaAddresses() 
      else loadEthAddresses()
    }

    if (!isEmpty(userAddress)) loadImportedTokenAddresses()
  }, [userAddress, currentProviderAddress])

  return { importedTokenAddresses }
}

export default useImportedTokenAddresses
