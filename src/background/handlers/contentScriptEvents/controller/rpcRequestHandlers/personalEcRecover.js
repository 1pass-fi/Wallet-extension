import { get } from 'lodash'
import { recoverPersonalSignature } from '@metamask/eth-sig-util'

export default async (payload, tab, next) => {
  try {
    const { hadPermission } = tab
    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    const params = get(payload, 'data.params')

    const recoverAddress = recoverPersonalSignature({ data: params[0], signature: params[1] })

    next({ data: recoverAddress })
  } catch (err) {
    next({ error: err.message })
  }
}
