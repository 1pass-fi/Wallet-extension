import { backgroundAccount } from 'services/account'


export default async (_, tab, next) => {
  try {
    const { hadPermission, activatedAddress } = tab

    if (hadPermission) {
      const credentials = await backgroundAccount.getCredentialByAddress(activatedAddress)
      const account = await backgroundAccount.getAccount(credentials)
      const metadata = await account.get.metadata()

      const payload = { [metadata.address]: metadata.accountName }
      next({ data: payload })
    } else {
      next({ error: 'The site does not have the required permissions for this action' })
    }
  } catch (err) {
    console.error(err.message)
    next({ error: 'Get wallet names error' })
  }
}
