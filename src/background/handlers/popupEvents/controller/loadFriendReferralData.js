// Constants
import { TYPE } from 'constants/accountConstants'
import { isString } from 'lodash'
// Services
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { address } = payload.data
    let accounts = []
    if (isString(address)) {
      const credential = await backgroundAccount.getCredentialByAddress(address)
      const account = await backgroundAccount.getAccount(credential)
      accounts = [...accounts, account]
    } else {
      accounts = await backgroundAccount.getAllAccounts(TYPE.ARWEAVE)
    }
    await Promise.all(accounts.map(async account => {
      const code = await account.method.getAffiliateCode()
      const spent = await account.method.checkAffiliateInviteSpent()
      const totalReward = await account.method.getTotalRewardKoi()

      await account.set.affiliateCode(code)
      await account.set.inviteSpent(spent)
      await account.set.totalReward(totalReward)
    }))

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
