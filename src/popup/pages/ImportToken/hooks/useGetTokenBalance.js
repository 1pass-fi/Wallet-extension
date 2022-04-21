import { useEffect, useState } from 'react'
import storage from 'services/storage'
import Web3 from 'web3'

import ERC20_ABI from 'abi/ERC20.json'

const useGetTokenBalance = ({ contractAddress, userAddress }) => {
  const [tokenSymbol, setTokenSymbol] = useState(null)
  const [balance, setBalance] = useState(null)
  const [tokenDecimal, setTokenDecimal] = useState(null)

  useEffect(() => {
    const loadContract = async () => {
      try {
        const provider = await storage.setting.get.ethereumProvider()
        const web3 = new Web3(provider)
        const tokenContract = new web3.eth.Contract(ERC20_ABI, contractAddress)

        const symbol = await tokenContract.methods.symbol().call()
        const balance = await tokenContract.methods.balanceOf(userAddress).call()
        const decimal = await tokenContract.methods.decimals().call()

        setTokenSymbol(symbol)
        setBalance(balance)
        setTokenDecimal(decimal)
      } catch (err) {
        console.error(err.message)
      }
    }

    if (contractAddress && userAddress) loadContract()
  }, [contractAddress, userAddress])

  const TokenBalance = () => (
    <>
      {balance || '------'} {tokenSymbol || '------'}
    </>
  )

  return { TokenBalance, tokenSymbol, balance, tokenDecimal }
}

export default useGetTokenBalance
