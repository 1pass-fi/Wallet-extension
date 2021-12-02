import { backgroundAccount } from 'services/account'


export default async (_, tab, next) => {
  try {
    const { hadPermission, activatedAddress } = tab

    if (hadPermission) {
      const credentials = await backgroundAccount.getCredentialByAddress(activatedAddress)
      const { key } = credentials 

      next({ data: key.n })
    } else {
      next({ error: 'The site does not have the required permissions for this action' })
    }
  } catch (err) {
    console.error(err.message)
    next({ error: 'Get public key error' })
  }
}
