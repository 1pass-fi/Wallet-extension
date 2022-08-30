// Services
// Constants
import { TYPE } from 'constants/accountConstants'
import { backgroundAccount } from 'services/account'

export default async () => {
  try {
    const accounts = await backgroundAccount.getAllAccounts(TYPE.ARWEAVE)
    accounts.forEach(account => account.method.updateNftStates())
  } catch (err) {
    console.log('Update NFTs error: ', err.message)
  }
}
