import { get } from 'lodash'
import { getEthereumNetworkProvider } from 'services/getNetworkProvider'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const transactionHash = get(params, '[0]')

    const providerUrl = await storage.setting.get.ethereumProvider()
    const web3 = await getEthereumNetworkProvider(providerUrl)

    const transaction = await web3.getTransaction(transactionHash)
    console.log('transaction', transaction)

    next({ data: transaction })
  } catch (err) {
    next({ error: err.message })
  }
}
