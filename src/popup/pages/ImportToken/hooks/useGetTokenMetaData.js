import { useEffect,useState } from 'react'
import { TokenListProvider } from '@solana/spl-token-registry'
import { clusterApiUrl,Connection } from '@solana/web3.js'
import ERC20_ABI from 'abi/ERC20.json'
import { TYPE } from 'constants/accountConstants'
// import Web3 from 'web3'
import { ethers } from 'ethers'
import storage from 'services/storage'
import customTokens from 'solanaTokens/solanaTokens'
import { clarifyEthereumProvider } from 'utils'
import k2Contracts from 'utils/k2-contracts.json'


const useGetTokenMetaData = ({ contractAddress, displayingAccount }) => {
  const [tokenSymbol, setTokenSymbol] = useState(null)
  const [tokenDecimals, setTokenDecimals] = useState(null)
  const [tokenName, setTokenName] = useState(null)
  console.log('displayingAccount:', displayingAccount)
  useEffect(() => {
    const loadTokenData = async () => {
      try {
        if(displayingAccount.type === TYPE.ETHEREUM) {
          console.log('contractAddress:', contractAddress)
          const provider = await storage.setting.get.ethereumProvider()
          const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)
  
          const network = ethers.providers.getNetwork(ethNetwork)
          const web3 = new ethers.providers.InfuraProvider(network, apiKey)
  
          const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, web3)
  
          const decimals = await tokenContract.decimals()
          const symbol = await tokenContract.symbol()
          const name = await tokenContract.name()
  
          setTokenDecimals(decimals?.toString())
          setTokenSymbol(symbol)
          setTokenName(name)
        } else if (displayingAccount.type === TYPE.SOLANA) {
          console.log('contractAddress:', contractAddress)

          const clusterSlug = await storage.setting.get.solanaProvider()
          const tokenlistContainer = await new TokenListProvider().resolve()
          const tokenList = tokenlistContainer.filterByClusterSlug(clusterSlug).getList()
          console.log('tokenList:', tokenList)
          let foundToken = tokenList.find(token =>
            token.address && contractAddress &&
            token.address.toLowerCase() === contractAddress.toLowerCase()
          )
          console.log(foundToken)
          if(!foundToken) {
            foundToken = customTokens.find(token =>
              token.address && contractAddress &&
              token.address.toLowerCase() === contractAddress.toLowerCase()
            ) || {}
          }
          console.log(foundToken)
          const {name, decimals, symbol} = foundToken
          setTokenDecimals(decimals?.toString())
          setTokenSymbol(symbol)
          setTokenName(name)
        } else if (displayingAccount.type === TYPE.K2) {

          let foundToken = k2Contracts.find(token =>
            token.address && contractAddress &&
            token.address.toLowerCase() === contractAddress.toLowerCase()
          ) || {}

          const {  name, decimals, symbol } = foundToken
          setTokenDecimals(decimals?.toString())
          setTokenSymbol(symbol)
          setTokenName(name)
        }
      } catch (err) {
        setTokenDecimals(null)
        setTokenSymbol(null)
        setTokenName(null)
        console.error(err.message)
      }
    }

    if (contractAddress) loadTokenData()
  }, [contractAddress])

  return { tokenSymbol, tokenDecimals, tokenName }
}

export default useGetTokenMetaData
