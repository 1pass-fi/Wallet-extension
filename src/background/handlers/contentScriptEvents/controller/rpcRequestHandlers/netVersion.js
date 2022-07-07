import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
// import Web3 from 'web3'
import { ethers } from 'ethers'

import { clarifyEthereumProvider } from 'utils'

export default async (payload, tab, next) => {
  try {
    let networkId = ''

    const provider = await storage.setting.get.ethereumProvider()
    const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

    const network = ethers.providers.getNetwork(ethNetwork)
    const web3 = new ethers.providers.InfuraProvider(network, apiKey)

    networkId = await web3.eth.net.getId()

    next({ data: networkId })
  } catch (err) {
    next({ error: err.message })
  }
}
