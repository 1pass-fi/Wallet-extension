import { isString } from 'lodash'
// Services
import { backgroundAccount } from 'services/account'


export default async (payload, tab, next) => {
  try {
    const { hadPermission, activatedAddress } = tab
    const { txId } = payload.data

    if (hadPermission) {
      if (!isString(txId)) {
        next({ data: { status: 400, data: 'Invalid txId' } })
      } else {
        const credentials = await backgroundAccount.getCredentialByAddress(activatedAddress)
        const account = await backgroundAccount.getAccount(credentials)
        
        const header = await account.method.signPort(txId)
        next({ data: { status: 200, data: header } })
      }
    } else {
      next({ data: { status: 400, data: 'Do not have permissions.' } })
    }
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Sign port error' } })
  }
}
