import Web3 from 'web3'
import { get } from 'lodash'

import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')

    const provider = await storage.setting.get.ethereumProvider()

    const transactionHash = params[0]
    const web3 = new Web3(provider)
    const transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash)

    transactionReceipt.blockNumber = web3.utils.toHex(transactionReceipt.blockNumber)
    transactionReceipt.cumulativeGasUsed = web3.utils.toHex(transactionReceipt.cumulativeGasUsed)
    transactionReceipt.gasUsed = web3.utils.toHex(transactionReceipt.gasUsed)
    transactionReceipt.status = web3.utils.toHex(transactionReceipt.status)
    transactionReceipt.transactionIndex = web3.utils.toHex(transactionReceipt.transactionIndex)
    
    console.log('transactionReceipt', transactionReceipt)
    
    next({ data: transactionReceipt })
  } catch (err) {
    next({ error: err.message })
  }
}
