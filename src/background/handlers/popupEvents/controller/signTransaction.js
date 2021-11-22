// Services
import storage from 'services/storage'
import { backgroundAccount } from 'services/account'

// Constants
import { MESSAGES, PORTS } from 'constants/koiConstants'

import { createTransactionId, ports } from 'background'


export default async (payload, next) => {
  try {
    let { tx, confirm, origin } = payload.data
    let transaction = null

    const siteAddressDict = await storage.setting.get.siteAddressDictionary()
    const address = siteAddressDict[origin]
    if (!address) confirm = false

    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    if (confirm) {
      chrome.browserAction.setBadgeText({ text: '' })
      const transactionData = await storage.generic.get.transactionData()
      tx.data = transactionData
      transaction = await account.method.signTransaction(tx)

      next()

      ports[PORTS.CONTENT_SCRIPT].postMessage({
        type: MESSAGES.CREATE_TRANSACTION_SUCCESS,
        id: createTransactionId[createTransactionId.length - 1],
        data: transaction
      })
      ports[PORTS.CONTENT_SCRIPT].postMessage({
        type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
        id: createTransactionId[createTransactionId.length - 1],
        data: { status: 200, data: transaction }
      })
      createTransactionId.length = 0
    } else {
      chrome.browserAction.setBadgeText({ text: '' })

      next()

      ports[PORTS.CONTENT_SCRIPT].postMessage({
        type: MESSAGES.CREATE_TRANSACTION_ERROR,
        id: createTransactionId[createTransactionId.length - 1],
        data: { message: 'Transaction rejected.' }
      })
      ports[PORTS.CONTENT_SCRIPT].postMessage({
        type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
        id: createTransactionId[createTransactionId.length - 1],
        data: { status: 403, data: 'Transaction rejected.' }
      })
      createTransactionId.length = 0
    }  
  } catch (err) {
    console.error(err.message)
    next({ error: 'Sign transaction error' })
  }
}
