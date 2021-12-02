import { isString, isNumber } from 'lodash'

// Services
import { backgroundAccount } from 'services/account'


export default async (payload, tab, next) => {
  try {
    const { target, qty } = payload.data
    const { activatedAddress, hadPermission } = tab

    if (!hadPermission) {
      next({ data: { status: 400, data: 'Do not have permissions.' } })
      return
    }

    if (!isString(target) || !isNumber(qty)) {
      next({ data: { status: 400, data: 'Invalid input' } })
    } else {
      const credentials = await backgroundAccount.getCredentialByAddress(activatedAddress)
      const account = await backgroundAccount.getAccount(credentials)

      const txId = await account.method.transfer('KOI', target, qty)
      next({ data: { status: 200, data: txId } })
    }

  } catch (err) {
    console.error(err.message)
    next({ data: { status: 500, data: 'Send KOII error' } })
  }
}
