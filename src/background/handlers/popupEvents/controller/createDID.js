// Services
import { backgroundAccount } from 'services/account'
import helpers from 'background/helpers'

import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { didData, activatedAddress } = payload.data

    let address
    if (activatedAddress) address = activatedAddress
    else address = await storage.setting.get.activatedAccountAddress()

    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    const [id, contractId] = await helpers.did.createDID(didData, account)
    
    await account.method.registerData(contractId)

    const kIDCreated = await helpers.did.koiiMe.mapKoiiMe({ txId: id, kID: didData.kID })
    if (!kIDCreated) {
      next({ error: 'Map koiime error', status: 400 })
      return
    }

    next({ data: {id, contractId}, status: 200 })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Create DID error', status: 500 })
  }
}
