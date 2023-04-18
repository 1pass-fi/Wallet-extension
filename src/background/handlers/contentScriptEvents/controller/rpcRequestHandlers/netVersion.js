import get from 'lodash/get'
import { getEthereumNetworkProvider } from 'services/initNetworkProvider'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const providerUrl = await storage.setting.get.ethereumProvider()
    const web3 = await getEthereumNetworkProvider(providerUrl)

    const networkId = get((await web3.getNetwork()), 'chainId')

    next({ data: networkId })
  } catch (err) {
    next({ error: err.message })
  }
}
