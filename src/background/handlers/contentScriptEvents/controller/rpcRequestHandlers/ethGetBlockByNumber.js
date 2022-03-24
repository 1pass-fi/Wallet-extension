import Web3 from 'web3'
import { get } from 'lodash'

import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const provider = await storage.setting.get.ethereumProvider()

    const web3 = new Web3(provider)

    let blockNumber = params[0]
    if (blockNumber === 'latest') {
      blockNumber = await web3.eth.getBlockNumber()
    }
    const blockData = await web3.eth.getBlock(params[0])
    blockData.difficulty = web3.utils.toHex(blockData.difficulty)
    blockData.gasLimit = web3.utils.toHex(blockData.gasLimit)
    blockData.gasUsed = web3.utils.toHex(blockData.gasUsed)
    blockData.number = web3.utils.toHex(blockData.number)
    blockData.size = web3.utils.toHex(blockData.size)
    blockData.timestamp = web3.utils.toHex(blockData.timestamp)

    next({ data: blockData })
  } catch (err) {
    next({ error: err.message })
  }
}
