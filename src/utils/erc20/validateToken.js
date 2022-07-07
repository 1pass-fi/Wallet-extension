// import Web3 from 'web3'
import { ethers } from 'ethers'

import { clarifyEthereumProvider } from 'utils'

const validateToken = async (tokenAddress) => {
  try {
    const provider = await storage.setting.get.ethereumProvider()
    const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

    const network = ethers.providers.getNetwork(ethNetwork)
    const web3 = new ethers.providers.InfuraProvider(network, apiKey)

    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
    await tokenContract.methods.name().call()

    return true
  } catch (err) {
    return false
  }
}

export default validateToken
