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

    // const transaction = await web3.eth.getTransaction(transactionHash)
    const transaction = await web3.getTransaction(transactionHash)

    console.log('transaction', transaction)

    next({ data: transaction })
  } catch (err) {
    next({ error: err.message })
  }
}
