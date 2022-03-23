import Web3 from 'web3'
import { get } from 'lodash'

import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')

    const provider = await storage.setting.get.ethereumProvider()

    const rawTx = params[0]
    const web3 = new Web3(provider)
    const estimatedGas = await web3.eth.estimateGas(rawTx)

    console.log('estimatedGas', estimatedGas)
    
    next({ data: estimatedGas })
  } catch (err) {
    next({ error: err.message })
  }
}
