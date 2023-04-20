import { getEthereumNetworkProvider } from 'services/getNetworkProvider'
import storage from 'services/storage'

export default async (_, __, next) => {
  try {
    const providerUrl = await storage.setting.get.ethereumProvider()
    const web3 = await getEthereumNetworkProvider(providerUrl)

    const blockNumber = await web3.getBlockNumber()
    next({ data: blockNumber })
  } catch (err) {
    next({ error: err.message })
  }
}
