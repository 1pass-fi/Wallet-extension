import Web3 from 'web3'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const provider = await storage.setting.get.ethereumProvider()

    const web3 = new Web3(provider)
    const chainId = await web3.eth.getChainId()

    next({ data: '0x' + chainId })
  } catch (err) {
    next({ error: err.message })
  }
}
