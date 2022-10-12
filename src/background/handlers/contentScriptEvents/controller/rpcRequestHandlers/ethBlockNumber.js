// import Web3 from 'web3'
import { ethers } from 'ethers'
import storage from 'services/storage'
import { clarifyEthereumProvider } from 'utils'

export default async (payload, tab, next) => {
  try {
    const provider = await storage.setting.get.ethereumProvider()

    const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

    const network = ethers.providers.getNetwork(ethNetwork)
    const web3 = new ethers.providers.InfuraProvider(network, apiKey)

    // const blockNumber = await web3.eth.getBlockNumber()
    const blockNumber = await web3.getBlockNumber()
    console.log('blockNumber', blockNumber)

    next({ data: blockNumber })
  } catch (err) {
    next({ error: err.message })
  }
}
