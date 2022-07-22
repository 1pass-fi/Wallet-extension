// Services
import { backgroundAccount } from 'services/account'


export default async (type) => {
  try {
    const accounts = await backgroundAccount.getAllAccounts(type) // !type will return accounts of all types.
    await Promise.all(accounts.map(async account => {
      let { balance, koiBalance } = await account.method.getBalances()
      console.log(`Load ${type ? type : ''} balance for: `, await account.get.accountName(), balance)
      await account.set.balance(balance)
      await account.set.koiBalance(koiBalance)
    }))
  } catch (error) {
    console.error('Load balances error: ', error.message)
  }
}
