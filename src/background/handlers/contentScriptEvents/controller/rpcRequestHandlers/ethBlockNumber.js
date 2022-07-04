// import Web3 from 'web3'
const Web3 = () => ({})

import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const provider = await storage.setting.get.ethereumProvider()

    const web3 = new Web3(provider)
    const blockNumber = await web3.eth.getBlockNumber()

    console.log('blockNumber', blockNumber)
    
    next({ data: blockNumber })
  } catch (err) {
    next({ error: err.message })
  }
}
