import { get } from 'lodash'

import { stripHexPrefix } from 'ethereumjs-util'
import { personalSign } from '@metamask/eth-sig-util'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const { hadPermission } = tab
    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    const params = get(payload, 'data.params')
    const message = params[0]

    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
    const credential = await backgroundAccount.getCredentialByAddress(defaultEthereumAddress)

    const key = stripHexPrefix(credential.key)

    const msgSig = personalSign({ privateKey: Buffer.from(key, 'hex'), data: message })

    next({ data: msgSig })
  } catch (err) {
    next({ error: err.message })
  }
}
