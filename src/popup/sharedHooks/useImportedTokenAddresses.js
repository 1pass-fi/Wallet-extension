import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { get, isEmpty } from 'lodash'

import storage from 'services/storage'
import { TYPE } from 'constants/accountConstants'

import ERC20_ABI from 'abi/ERC20.json'

const useImportedTokenAddresses = ({ userAddress, currentProviderAddress, displayingAccount }) => {
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

  useEffect(() => {
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

      setImportedTokenAddresses(tokenAddresses)
    }

    if (!isEmpty(displayingAccount) && displayingAccount.type === TYPE.SOLANA) {
      loadSolanaAddresses()
    } else if (userAddress) loadEthAddresses()
  }, [userAddress, currentProviderAddress, displayingAccount])

  return { importedTokenAddresses }
}

export default useImportedTokenAddresses
