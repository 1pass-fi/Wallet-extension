import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { get, isEmpty } from 'lodash'

import storage from 'services/storage'

import ERC20_ABI from 'abi/ERC20.json'

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

  useEffect(() => {
    const loadAddresses = async () => {
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
      }
    }

    if (userAddress) loadAddresses()
  }, [userAddress, currentProviderAddress])

  return { importedTokenAddresses }
}

export default useImportedTokenAddresses
