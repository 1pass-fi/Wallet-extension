import { useEffect,useState } from 'react'
import ERC20_ABI from 'abi/ERC20.json'
// import Web3 from 'web3'
import { ethers } from 'ethers'
import storage from 'services/storage'
import { clarifyEthereumProvider } from 'utils'

const useGetTokenMetaData = ({ contractAddress }) => {
  const [tokenSymbol, setTokenSymbol] = useState(null)
  const [tokenDecimals, setTokenDecimals] = useState(null)
  const [tokenName, setTokenName] = useState(null)

  useEffect(() => {
    const loadTokenData = async () => {
      try {
        console.log('contractAddress:', contractAddress)
        const provider = await storage.setting.get.ethereumProvider()
        const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

        const network = ethers.providers.getNetwork(ethNetwork)
        const web3 = new ethers.providers.InfuraProvider(network, apiKey)

        // const tokenContract = new web3.eth.Contract(ERC20_ABI, contractAddress)
        const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, web3)

        // const decimals = await tokenContract.methods.decimals().call()
        // const symbol = await tokenContract.methods.symbol().call()
        // const name = await tokenContract.methods.name().call()
        const decimals = await tokenContract.decimals()
        const symbol = await tokenContract.symbol()
        const name = await tokenContract.name()

        setTokenDecimals(decimals?.toString())
        setTokenSymbol(symbol)
        setTokenName(name)
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
