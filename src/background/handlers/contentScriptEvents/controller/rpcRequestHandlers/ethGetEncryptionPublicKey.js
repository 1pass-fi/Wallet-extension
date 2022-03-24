import { stripHexPrefix } from 'ethereumjs-util'
import { getEncryptionPublicKey } from '@metamask/eth-sig-util'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const { hadPermission } = tab
    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
    const credential = await backgroundAccount.getCredentialByAddress(defaultEthereumAddress)

    const privateKey = stripHexPrefix(credential.key)

    const publicKey = getEncryptionPublicKey(privateKey)

    next({ data: publicKey })
  } catch (err) {
    next({ error: err.message })
  }
}
