import { backgroundAccount } from 'services/account'

export default async (payload, tab, next) => {
  try {
    const { hadPermission, activatedAddress } = tab

    let networkId = ''

    if (hadPermission) {
      const credentials = await backgroundAccount.getCredentialByAddress(activatedAddress)
      const account = await backgroundAccount.getAccount(credentials)

      networkId = await account.method.getNetworkId()
    }

    next({ data: networkId })
  } catch (err) {
    next({ error: err.message })
  }
}
