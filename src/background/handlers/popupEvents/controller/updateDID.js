// Services
import { backgroundAccount } from 'services/account'
import helpers from 'background/helpers'

import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { didData, txId, newKID } = payload.data

    const address = await storage.setting.get.activatedAccountAddress()
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    const transactionId = await helpers.did.updateDID(didData, txId, account)

    if (newKID) {
      const reactAppId = await helpers.did.getDID(null, txId)
      const kidCreated = await helpers.did.koiiMe.mapKoiiMe({ txId: reactAppId, kID: didData.kID })

      if (!kidCreated) throw new Error('Map KoiiMe error')
    }

    next({ data: transactionId, status: 200 })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Create DID error', status: 500 })
  }
}
