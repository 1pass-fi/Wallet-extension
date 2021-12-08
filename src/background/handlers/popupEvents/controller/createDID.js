// Services
import { backgroundAccount } from 'services/account'
import helpers from 'background/helpers'

import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { didData } = payload.data

    const address = await storage.setting.get.activatedAccountAddress()
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    const [id, contractId] = await helpers.did.createDID(didData, account)

    await account.method.registerData(contractId)

    next({ data: {id, contractId} })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Create DID error' })
  }
}
