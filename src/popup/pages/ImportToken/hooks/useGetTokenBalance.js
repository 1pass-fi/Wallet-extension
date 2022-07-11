import { useEffect, useState } from 'react'
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token'
// import Web3 from 'web3'
import { ethers } from 'ethers'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import ERC20_ABI from 'abi/ERC20.json'
import { TYPE } from 'constants/accountConstants'
import storage from 'services/storage'
import { isEthereumAddress, isSolanaAddress } from 'utils'
import { getK2CustomTokensData, getSolanaCustomTokensData } from 'utils/getTokenData'
import Web3 from 'web3'

const useGetTokenBalance = ({ contractAddress, account }) => {
  const [tokenSymbol, setTokenSymbol] = useState(null)
  const [balance, setBalance] = useState(null)
  const [tokenDecimal, setTokenDecimal] = useState(null)

  useEffect(() => {
    const loadEthereumContract = async () => {
      try {
        const provider = await storage.setting.get.ethereumProvider()
        const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

        const network = ethers.providers.getNetwork(ethNetwork)
        const web3 = new ethers.providers.InfuraProvider(network, apiKey)

        // const tokenContract = new web3.eth.Contract(ERC20_ABI, contractAddress)
        const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, web3)

        // const symbol = await tokenContract.methods.symbol().call()
        // const balance = await tokenContract.methods.balanceOf(userAddress).call()
        // const decimal = await tokenContract.methods.decimals().call()
        const symbol = await tokenContract.symbol()
        const balance = await tokenContract.balanceOf(userAddress)
        const decimal = await tokenContract.decimals()

        setTokenSymbol(symbol)
        setBalance(balance)
        setTokenDecimal(decimal)
      } catch (err) {
        console.error(err.message)
      }
    }

    const loadSolanaContract = async () => {
      try {
        const { balance, symbol, decimal } = await getSolanaCustomTokensData(
          contractAddress,
          account.address
        )

        setTokenSymbol(symbol)
        setBalance(balance)
        setTokenDecimal(decimal)
      } catch (err) {
        console.error(err.message)
      }
    }

    const loadK2Contract = async () => {
      try {
        const { balance, symbol, decimal } = await getK2CustomTokensData(
          contractAddress,
          account.address
        )

        setTokenSymbol(symbol)
        setBalance(balance)
        setTokenDecimal(decimal)
      } catch (err) {
        console.error(err.message)
      }
    }

    if (contractAddress && account) {
      if (account.type === TYPE.K2) loadK2Contract()
      if (account.type === TYPE.SOLANA) loadSolanaContract()
      if (account.type === TYPE.ETHEREUM) loadEthereumContract()
    }
  }, [contractAddress, account])

  const TokenBalance = () => (
    <>
      {balance || '------'} {tokenSymbol || '------'}
    </>
  )

  return { TokenBalance, tokenSymbol, balance, tokenDecimal }
}

export default useGetTokenBalance
