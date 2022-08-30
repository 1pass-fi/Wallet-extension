import { isEmpty } from 'lodash'
// Services
import { backgroundAccount } from 'services/account'


export default async (_, next) => {
  try {
    const locked = isEmpty(backgroundAccount.importedAccount)
    next({ data: locked })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Get lock state error' })
  }
}
