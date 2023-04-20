import get from 'lodash/get'
import { getEthereumNetworkProvider } from 'services/getNetworkProvider'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const providerUrl = await storage.setting.get.ethereumProvider()
    const rpcProvider = await getEthereumNetworkProvider(providerUrl)

    const response = await rpcProvider.send('eth_call', params)
    next({ data: response })
  } catch (error) {
    next({ error: error.message })
  }
}
