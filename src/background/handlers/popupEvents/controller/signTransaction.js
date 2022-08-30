// Services
import cache from 'background/cache'
import helpers from 'background/helpers'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

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
        next({ data: 'Invalid data input', status: 400 })
        return
      }

      tx.data = transactionData
      transaction = await helpers.cloneTransaction(tx)
      await account.method.signTx(transaction)

      next({ data: transaction, status: 200 })
    } else {
      /* 
        Sign transaction rejected
      */
      chrome.browserAction.setBadgeText({ text: '' })
      next({ data: 'Transaction rejected', status: 403 })
    }  
  } catch (err) {
    console.error(err.message)
    next({ data: 'Sign transaction error', status: 500 })
  }
}
