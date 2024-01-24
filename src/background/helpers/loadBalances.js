import { backgroundAccount } from 'services/account'

export default async (type) => {
  try {
    const accounts = await backgroundAccount.getAllAccounts(type)
    const promises = accounts.map(async (account) => {
      try {
        const { balance, koiBalance } = await account.method.getBalances()
        console.log(
          `Load ${type ? type : ''} balance for: `,
          await account.get.accountName(),
          balance
        )
        await account.set.balance(balance)
        await account.set.koiBalance(koiBalance)
      } catch (error) {
        console.error(
          `Error loading balance for account: ${await account.get.accountName()}: `,
          error
        )
        throw error // Rethrow error to make sure Promise.allSettled captures the rejection
      }
    })

    const results = await Promise.allSettled(promises)
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Promise at index ${index} failed with reason: `, result.reason)
      }
    })
  } catch (error) {
    console.error('Error fetching accounts: ', error.message)
  }
}
