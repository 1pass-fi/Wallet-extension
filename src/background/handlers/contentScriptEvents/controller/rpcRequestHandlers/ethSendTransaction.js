import Web3 from 'web3'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    console.log('=== TEST SEND ETH TRANSACTION ===')
    // TODO: ThuanN

    const rawTx = {
      from: '0xb076413401172CBB73C082107514De3376E4FF6c',
      to: '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb',
      value: '0x0',
      gas: 0,
      type: '0x0'
    }

    const account = await backgroundAccount.getAccount({ address: rawTx.from })

    const provider = await storage.setting.get.ethereumProvider()

    const web3 = new Web3(provider)

    const estimateGas = await web3.eth.estimateGas(rawTx)
    rawTx.gas = estimateGas

    const signTx = await web3.eth.accounts.signTransaction(rawTx, account.mockedGetKey())
    const receipt = await web3.eth.sendSignedTransaction(signTx.rawTransaction)

    next({ data: receipt })
  } catch (err) {
    next({ error: err.message })
  }
}
