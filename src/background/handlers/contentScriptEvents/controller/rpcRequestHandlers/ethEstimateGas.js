import { get } from 'lodash'
import { getEthereumNetworkProvider } from 'services/initNetworkProvider'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const rawTx = get(params, '[0]')

    const providerUrl = await storage.setting.get.ethereumProvider()
    const web3 = await getEthereumNetworkProvider(providerUrl)

    const estimatedGas = await web3.estimateGas(rawTx)
    console.log('estimatedGas', estimatedGas)

    next({ data: estimatedGas })
  } catch (err) {
    next({ error: err.message })
  }
}
