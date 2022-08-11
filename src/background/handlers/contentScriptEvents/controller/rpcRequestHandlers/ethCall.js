import { ethers } from 'ethers'
import get from 'lodash/get'

import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const provider = await storage.setting.get.ethereumProvider()

    const rpcProvider = new ethers.providers.JsonRpcProvider(provider)

    const response = await rpcProvider.send('eth_call', params)

    console.log('eth_call message: ', response)
    next({ data: response })
  } catch (error) {
    next({ error: err.message })
  }
}
