// Services
import storage from 'services/storage'
import { backgroundAccount } from 'services/account'

// Constants
import { MESSAGES, PORTS } from 'constants/koiConstants'

import cache from 'background/cache'
import helpers from 'background/helpers'

export default async (payload, next) => {
  try {
    let { tx, confirm, origin } = payload.data
    let transaction = null
    const contentScriptPort = cache.getContentScriptPort()

    /* Get permission */
    const siteAddressDict = await storage.setting.get.siteAddressDictionary()
    const address = siteAddressDict[origin]
    if (!address) confirm = false // no permission

    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    if (confirm) {
      /* 
        Sign transaction confirmed
      */
      chrome.browserAction.setBadgeText({ text: '' })
      const {data: transactionData, id} = await storage.generic.get.transactionData()

      if (id !== contentScriptPort.id) {
        next()

        contentScriptPort.port.postMessage({
          type: MESSAGES.CREATE_TRANSACTION_ERROR,
          data: 'Invalid data input',
          id: contentScriptPort.id
        })
        contentScriptPort.port.postMessage({
          type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
          data: { status: 400, data: 'Invalid data input' },
          id: contentScriptPort.id
        })
        return
      }

      tx.data = transactionData
      transaction = await helpers.cloneTransaction(tx)
      await account.method.signTx(transaction)

      next()

      contentScriptPort.port.postMessage({
        type: MESSAGES.CREATE_TRANSACTION_SUCCESS,
        data: transaction,
        id: contentScriptPort.id
      })
      contentScriptPort.port.postMessage({
        type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
        data: { status: 200, data: transaction },
        id: contentScriptPort.id
      })
    } else {
      /* 
        Sign transaction rejected
      */
      chrome.browserAction.setBadgeText({ text: '' })
      next()

      contentScriptPort.port.postMessage({
        type: MESSAGES.CREATE_TRANSACTION_ERROR,
        data: { message: 'Transaction rejected.'},
        id: contentScriptPort.id
      })
      contentScriptPort.port.postMessage({
        type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
        data: { status: 403, data: 'Transaction rejected.' },
        id: contentScriptPort.id
      })
    }  
  } catch (err) {
    console.error(err.message)
    next({ error: 'Sign transaction error' })

    contentScriptPort.port.postMessage({
      type: MESSAGES.CREATE_TRANSACTION_ERROR,
      data: { message: 'Sign transaction error'},
      id: contentScriptPort.id
    })
    contentScriptPort.port.postMessage({
      type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
      data: { status: 500, data: 'Sign transaction error' },
      id: contentScriptPort.id
    })
  }
}
