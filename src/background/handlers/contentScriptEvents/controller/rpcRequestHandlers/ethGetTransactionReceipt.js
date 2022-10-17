// import Web3 from 'web3'
import { ethers } from 'ethers'
import { get } from 'lodash'
import storage from 'services/storage'
import { clarifyEthereumProvider } from 'utils'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')

    const provider = await storage.setting.get.ethereumProvider()

    const transactionHash = params[0]
    const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

    const network = ethers.providers.getNetwork(ethNetwork)
    const web3 = new ethers.providers.InfuraProvider(network, apiKey)

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
