// Services
import { backgroundAccount } from 'services/account'


export default async (_payload, next) => {
  try {
    const { kidInfo, address, payload } = _payload.data
    const { syncWallet } = kidInfo

    let allAccounts
    if (syncWallet) {
      allAccounts = await backgroundAccount.getAllAccounts()
    } else {
      const credentials = await backgroundAccount.getCredentialByAddress(address)
      const account = await backgroundAccount.getAccount(credentials)
      allAccounts = [account]
    }
    await Promise.all(allAccounts.map(async account => {
      await account.method.createOrUpdateKID(kidInfo, payload)
    }))

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Create or Update DID error' })
  }
}
