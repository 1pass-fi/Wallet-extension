// import Web3 from 'web3'
import { ethers } from 'ethers'

import { clarifyEthereumProvider } from 'utils'

import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const provider = await storage.setting.get.ethereumProvider()
    const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

    const network = ethers.providers.getNetwork(ethNetwork)
    const web3 = new ethers.providers.InfuraProvider(network, apiKey)

    const chainId = await web3.eth.getChainId()

    next({ data: '0x' + chainId })
  } catch (err) {
    next({ error: err.message })
  }
}
