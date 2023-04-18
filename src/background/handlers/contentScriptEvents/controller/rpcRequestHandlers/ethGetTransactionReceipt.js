import { ethers } from 'ethers'
import { get } from 'lodash'
import { getEthereumNetworkProvider } from 'services/initNetworkProvider'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const transactionHash = get(params, '[0]')

    const providerUrl = await storage.setting.get.ethereumProvider()
    const web3 = await getEthereumNetworkProvider(providerUrl)

    const transactionReceipt = await web3.waitForTransaction(transactionHash)
    transactionReceipt.blockNumber = ethers.utils.hexlify(transactionReceipt.blockNumber)
    transactionReceipt.cumulativeGasUsed = ethers.utils.hexlify(transactionReceipt.cumulativeGasUsed)
    transactionReceipt.gasUsed = ethers.utils.hexlify(transactionReceipt.gasUsed)
    transactionReceipt.status = ethers.utils.hexlify(transactionReceipt.status)
    transactionReceipt.transactionIndex = ethers.utils.hexlify(transactionReceipt.transactionIndex)
    console.log('transactionReceipt', transactionReceipt)

    next({ data: transactionReceipt })
  } catch (err) {
    next({ error: err.message })
  }
}
