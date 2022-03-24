import Web3 from 'web3'
import { get } from 'lodash'

import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')

    const provider = await storage.setting.get.ethereumProvider()

    const transactionHash = params[0]
    const web3 = new Web3(provider)
    const transaction = await web3.eth.getTransaction(transactionHash)

    console.log('transaction', transaction)
    
    next({ data: transaction })
  } catch (err) {
    next({ error: err.message })
  }
}