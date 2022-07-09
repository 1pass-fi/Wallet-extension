// import Web3 from 'web3'
import { ethers } from 'ethers'

import { clarifyEthereumProvider } from 'utils'

import { get } from 'lodash'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')

    const provider = await storage.setting.get.ethereumProvider()

    const rawTx = params[0]
    const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

    const network = ethers.providers.getNetwork(ethNetwork)
    const web3 = new ethers.providers.InfuraProvider(network, apiKey)

    // const estimatedGas = await web3.eth.estimateGas(rawTx)
    const estimatedGas = await web3.estimateGas(rawTx)

    console.log('estimatedGas', estimatedGas)

    next({ data: estimatedGas })
  } catch (err) {
    next({ error: err.message })
  }
}
