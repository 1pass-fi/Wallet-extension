import { get } from 'lodash'

import { ecsign, stripHexPrefix } from 'ethereumjs-util'
import { concatSig } from '@metamask/eth-sig-util'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const { hadPermission } = tab
    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    const params = get(payload, 'data.params')
    const message = stripHexPrefix(params[1])

    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
    const credential = await backgroundAccount.getCredentialByAddress(defaultEthereumAddress)

    const key = credential.key.split('x')[1]

    const msgSig = ecsign(Buffer.from(message, 'hex'), Buffer.from(key, 'hex'))

    const rawMsgSig = concatSig(msgSig.v, msgSig.r, msgSig.s)

    console.log('========', rawMsgSig)

    next({ data: rawMsgSig })
  } catch (err) {
    next({ error: err.message })
  }
}
