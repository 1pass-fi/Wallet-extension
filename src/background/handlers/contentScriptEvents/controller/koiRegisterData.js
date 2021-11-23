import { backgroundAccount } from 'services/account'


export default async (payload, tab, next) => {
  try {
    const { activatedAddress, hadPermission } = tab

    if (!hadPermission) {
      next({ data: { status: 400, data: 'Do not have permissions.' } })
    }

    const { txId } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(activatedAddress)
    const account = await backgroundAccount.getAccount(credentials)
    
    const resTx = await account.method.registerData(txId)

    next({ data: { status: 200, data: resTx } })
  } catch (err) {
    console.error(err.message)
    next({ data: { status: 500, data: 'Reigster data error' } })
  }
}
