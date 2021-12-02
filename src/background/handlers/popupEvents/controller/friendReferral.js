// Services
import storage from 'services/storage'
import { backgroundAccount } from 'services/account'

// Constants
import { FRIEND_REFERRAL_ENDPOINTS } from 'constants/koiConstants'


export default async (payload, next) => {
  try {
    const { endpoints, friendCode } = payload.data
    const defaultAddress = await storage.setting.get.activatedAccountAddress()
    const credentials = await backgroundAccount.getCredentialByAddress(defaultAddress)
    const account = await backgroundAccount.getAccount(credentials)
    let result
    switch (endpoints) {
      case FRIEND_REFERRAL_ENDPOINTS.GET_AFFILIATE_CODE: {
        result = await account.method.getAffiliateCode()
        break
      }

      case FRIEND_REFERRAL_ENDPOINTS.GET_TOTAL_REWARD: {
        result = await account.method.getTotalRewardKoi()
        break
      }

      case FRIEND_REFERRAL_ENDPOINTS.CHECK_AFFILIATE_INVITE_SPENT: {
        result = await account.method.checkAffiliateInviteSpent()
        break
      }

      case FRIEND_REFERRAL_ENDPOINTS.CLAIM_REWARD: {
        result = await account.method.claimReward()
        break
      }

      case FRIEND_REFERRAL_ENDPOINTS.SUBMIT_CODE: {
        result = await account.method.submitInviteCode(friendCode)
      }
    }

    next({ data: result })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Get friend referral error' })
  }
}
