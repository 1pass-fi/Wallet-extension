import passworder from 'browser-passworder'

// Services
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { password, address } = payload.data
    let key
    const encryptedKey = await backgroundAccount.getEncryptedKey(address)
    if (!encryptedKey) throw new Error('Unable to find keyfile.')
    try {
      key = await passworder.decrypt(password, encryptedKey)
    } catch (err) {
      next({ error: err.message })
      return
    }

    next({ data: {key} })
  } catch (err) {
    console.log(error.message)
    next({ error: 'Get key error' })
  }
}
