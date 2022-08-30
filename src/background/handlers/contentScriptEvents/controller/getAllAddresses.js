// Constants
import { TYPE } from 'constants/accountConstants'
import { isEmpty } from 'lodash'
// Services
import { backgroundAccount } from 'services/account'


export default async (_, tab, next) => {
  try {
    const { hadPermission } = tab

    const accounts = await backgroundAccount.getAllAccounts(TYPE.ARWEAVE)
    const addresses = await Promise.all(accounts.map(async account => await account.get.address()))

    if (hadPermission) {
      if (!isEmpty(addresses)) {
        next({ data: addresses })
      } else {
        next({ error: 'The site does not have the required permissions for this action' })
      }
    } else {
      next({ error: 'The site does not have the required permissions for this action' })
    }
  } catch (err) {
    console.error(err.message)
    next({ error: 'Get all addresses error' })
  }
}
