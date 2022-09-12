import { TYPE } from 'constants/accountConstants'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { includes, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
// Services
import storage from 'services/storage'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (_, tab, next) => {
  try {
    const { hadPermission, origin } = tab

    if (!hadPermission) {
      next({ data: false })
    }

    // check if there is an imported solana account
    const totalSolanaAccount = await backgroundAccount.count(TYPE.SOLANA)
    if (!totalSolanaAccount) {
      return next({ error: { code: 4001, data: 'No imported Solana account' } })
    }

    const activatedSolanaAccountAddress = await storage.setting.get.activatedSolanaAccountAddress()

    let siteConnectedAddresses = await storage.setting.get.siteConnectedAddresses()

    const isConnected = siteConnectedAddresses[origin]?.solana?.includes(
      activatedSolanaAccountAddress
    )

    next({ data: isConnected })
  } catch (err) {
    next({ error: err.message })
  }
}
