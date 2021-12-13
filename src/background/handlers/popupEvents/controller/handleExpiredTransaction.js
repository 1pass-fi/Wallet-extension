import { find } from 'lodash'

// Services'
import { backgroundAccount } from 'services/account'

// Constants
import { MESSAGES } from 'constants/koiConstants'

import helpers from 'background/helpers'


export default async (payload, next) => {
  try {
    const { txId, address, wantToResend } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    const pendingTransactions = await account.get.pendingTransactions()
    const transaction = find(pendingTransactions, tx => tx.id === txId)

    if (!transaction) throw new Error('Transaction not found')
  
    if (wantToResend) {
      const newTransactionId = await helpers
        .pendingTransactionFactory
        .resendTransaction(account, transaction)

      next({ data: newTransactionId })
    } else {
      // remove transaction
      await helpers
        .pendingTransactionFactory
        .removeTransaction(account, transaction)

      helpers.sendMessageToPopupPorts({ type: MESSAGES.RELOAD_GALLERY })
      next()
    }
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
