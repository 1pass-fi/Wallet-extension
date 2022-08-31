// import Web3 from 'web3'
import { ethers } from 'ethers'

import { clarifyEthereumProvider } from 'utils'

import { get } from 'lodash'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const provider = await storage.setting.get.ethereumProvider()
    const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

    const network = ethers.providers.getNetwork(ethNetwork)
    const web3 = new ethers.providers.InfuraProvider(network, apiKey)

    let blockNumber = params[0]

    if (blockNumber === 'latest') {
      blockNumber = await web3.getBlockNumber()
    }

    const blockData = await web3.getBlock(params[0])

    blockData.difficulty = ethers.utils.hexlify(blockData.difficulty)
    blockData.gasLimit = ethers.utils.hexlify(blockData.gasLimit)
    blockData.gasUsed = ethers.utils.hexlify(blockData.gasUsed)
    blockData.number = ethers.utils.hexlify(blockData.number)

    // TODO ethers.getBlock doesn't output `size` field -> temporary comment out `size`
    // blockData.size = ethers.utils.hexlify(blockData.size)

    blockData.timestamp = ethers.utils.hexlify(blockData.timestamp)

    next({ data: blockData })
  } catch (err) {
    next({ error: err.message })
  }
}
