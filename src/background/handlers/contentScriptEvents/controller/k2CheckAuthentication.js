import { TYPE } from 'constants/accountConstants'
import { backgroundAccount } from 'services/account'

export default async (_, tab, next) => {
  try {
    const { hadPermission } = tab

    console.log('hadPermission', hadPermission)

    if (!hadPermission) {
      return next({ data: false })
    }

    // check if there is an imported k2 account
    const k2AccountCount = await backgroundAccount.count(TYPE.K2)
    if (!k2AccountCount) {
      return next({ error: { code: 4001, data: 'No imported K2 account' } })
    }

    next({ data: true })
  } catch (err) {
    next({ error: err.message })
  }
}
