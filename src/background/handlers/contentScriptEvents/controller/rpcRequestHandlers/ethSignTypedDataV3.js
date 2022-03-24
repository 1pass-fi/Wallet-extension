import { get } from 'lodash'

import { stripHexPrefix } from 'ethereumjs-util'
import { signTypedData } from '@metamask/eth-sig-util'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const { hadPermission } = tab
    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    const params = get(payload, 'data.params')
    const msgParams = params[1]

    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
    const credential = await backgroundAccount.getCredentialByAddress(defaultEthereumAddress)

    const key = stripHexPrefix(credential.key)

    const msgSig = signTypedData({
      privateKey: Buffer.from(key, 'hex'),
      data: JSON.parse(msgParams),
      version: 'V3'
    })

    next({ data: msgSig })
  } catch (err) {
    next({ error: err.message })
  }
}
