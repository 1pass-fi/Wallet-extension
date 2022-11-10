import { v4 as uuid } from 'uuid'

export default (payload, tab, next) => {
  try {
    const { hadPermission, activatedAddress, origin } = tab

    let permissions = []

    if (hadPermission) {
      permissions = [{
        caveats: [{
          type: 'restrictReturnedAccounts',
          value: [activatedAddress]
        }],
        date: Date.now(),
        id: uuid(),
        invoker: origin,
        parentCapability: 'eth_accounts'
      }]
    }
    next({ data: permissions })
  } catch (err) {
    next({ error: err.message })
  }
}
