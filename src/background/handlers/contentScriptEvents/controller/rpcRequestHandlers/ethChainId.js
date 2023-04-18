import { getEthereumNetworkProvider } from 'services/initNetworkProvider'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const providerUrl = await storage.setting.get.ethereumProvider()
    const web3 = await getEthereumNetworkProvider(providerUrl)
    const { chainId } = await web3.getNetwork()
    
    next({ data: '0x' + chainId })
  } catch (err) {
    next({ error: err.message })
  }
}
