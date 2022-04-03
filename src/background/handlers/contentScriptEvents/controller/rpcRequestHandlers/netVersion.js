import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import Web3 from 'web3'

export default async (payload, tab, next) => {
  try {
    let networkId = ''

    const provider = await storage.setting.get.ethereumProvider()
    const web3 = new Web3(provider)

    networkId = await web3.eth.net.getId()

    next({ data: networkId })
  } catch (err) {
    next({ error: err.message })
  }
}
