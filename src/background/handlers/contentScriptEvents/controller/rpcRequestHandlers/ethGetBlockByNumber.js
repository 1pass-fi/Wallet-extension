// import Web3 from 'web3'
import { ethers } from 'ethers'
import { get } from 'lodash'
import { getEthereumNetworkProvider } from 'services/initNetworkProvider'
import storage from 'services/storage'
import { clarifyEthereumProvider } from 'utils'


export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const providerUrl = await storage.setting.get.ethereumProvider()
    const web3 = await getEthereumNetworkProvider(providerUrl)

    let blockNumber = get(params, '[0]')

    if (blockNumber === 'latest') {
      blockNumber = await web3.getBlockNumber()
    }

    const blockData = await web3.getBlock(blockNumber)

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
