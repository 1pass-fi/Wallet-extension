import { useState, useEffect } from 'react'
import storage from 'services/storage'
import Web3 from 'web3'

import ERC20_ABI from 'abi/ERC20.json'

const useGetTokenMetaData = ({ contractAddress }) => {
  const [tokenSymbol, setTokenSymbol] = useState(null)
  const [tokenDecimals, setTokenDecimals] = useState(null)
  const [tokenName, setTokenName] = useState(null)

  useEffect(() => {
    const loadTokenData = async () => {
      try {
        const provider = await storage.setting.get.ethereumProvider()
        const web3 = new Web3(provider)
        const tokenContract = new web3.eth.Contract(ERC20_ABI, contractAddress)

        const decimals = await tokenContract.methods.decimals().call()
        const symbol = await tokenContract.methods.symbol().call()
        const name = await tokenContract.methods.name().call()

        setTokenDecimals(decimals)
        setTokenSymbol(symbol)
        setTokenName(name)
      } catch (err) {
        console.error(err.message)
      }
    }

    if (contractAddress) loadTokenData()
  }, [contractAddress])

  return { tokenSymbol, tokenDecimals, tokenName }
}

export default useGetTokenMetaData
