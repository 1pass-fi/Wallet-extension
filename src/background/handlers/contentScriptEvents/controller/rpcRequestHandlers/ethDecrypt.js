import { get } from 'lodash'

import { stripHexPrefix } from 'ethereumjs-util'
import { decrypt } from '@metamask/eth-sig-util'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const { hadPermission } = tab
    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    const params = get(payload, 'data.params')
    const encryptedDataHex = params[0]

    const stripped = stripHexPrefix(encryptedDataHex)
    const buff = Buffer.from(stripped, 'hex')
    const encryptedData = JSON.parse(buff.toString('utf8'))

    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
    const credential = await backgroundAccount.getCredentialByAddress(defaultEthereumAddress)

    const privateKey = stripHexPrefix(credential.key)

    const decryptedMessage = decrypt({ privateKey, encryptedData })

    next({ data: decryptedMessage })
  } catch (err) {
    next({ error: err.message })
  }
}
