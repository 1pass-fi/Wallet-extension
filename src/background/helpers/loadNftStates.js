// Services
import { backgroundAccount } from 'services/account'

// Constants
import { TYPE } from 'constants/accountConstants'

export default async () => {
  try {
    const accounts = await backgroundAccount.getAllAccounts(TYPE.ARWEAVE)
    accounts.forEach(account => account.method.updateNftStates())
  } catch (err) {
    console.log('Update NFTs error: ', err.message)
  }
}
