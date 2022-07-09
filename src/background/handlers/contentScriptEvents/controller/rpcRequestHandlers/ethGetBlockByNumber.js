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
      // blockNumber = await web3.eth.getBlockNumber()
      blockNumber = await web3.getBlockNumber()
    }
    // const blockData = await web3.eth.getBlock(params[0])
    const blockData = await web3.getBlock(params[0])
    // blockData.difficulty = web3.utils.toHex(blockData.difficulty)
    blockData.difficulty = ethers.utils.hexlify(blockData.difficulty)
    // blockData.gasLimit = web3.utils.toHex(blockData.gasLimit)
    blockData.gasLimit = ethers.utils.hexlify(blockData.gasLimit)
    // blockData.gasUsed = web3.utils.toHex(blockData.gasUsed)
    blockData.gasUsed = ethers.utils.hexlify(blockData.gasUsed)
    // blockData.number = web3.utils.toHex(blockData.number)
    blockData.number = ethers.utils.hexlify(blockData.number)
    // blockData.size = web3.utils.toHex(blockData.size)
    blockData.size = ethers.utils.hexlify(blockData.size)
    // blockData.timestamp = web3.utils.toHex(blockData.timestamp)
    blockData.timestamp = ethers.utils.hexlify(blockData.timestamp)

    next({ data: blockData })
  } catch (err) {
    next({ error: err.message })
  }
}
