// import Web3 from 'web3'
import { ethers } from 'ethers'
import { clarifyEthereumProvider } from 'utils'

const validateToken = async (tokenAddress) => {
  try {
    const provider = await storage.setting.get.ethereumProvider()
    const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

    const network = ethers.providers.getNetwork(ethNetwork)
    const web3 = new ethers.providers.InfuraProvider(network, apiKey)

    // const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, web3)
    // await tokenContract.methods.name().call()
    const name = await tokenContract.name()

    return true
  } catch (err) {
    return false
  }
}

export default validateToken
