import { isEmpty } from 'lodash'

import { backgroundAccount } from 'services/account'

import { TYPE } from 'constants/accountConstants'

// Services
import storage from 'services/storage'
import { ChromeStorage } from 'services/storage/ChromeStorage'

export default async (payload, tab, next) => {
  try {
    const { hadPermission, activatedAddress, origin } = tab

    if (hadPermission) {
      /* Response with array of connected addresses */
      return next({ data: 'This site has been connected' })
    }

    /* 
      Show popup for signing transaction
      Wait for the response from popup  
    */
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log(sender.tab ?
          'from a content script:' + sender.tab.url :
          'from the extension')
        if (request.greeting === 'hello')
          sendResponse({farewell: 'goodbye'})
      }
    )
    const allAccounts = await backgroundAccount.getAllAccounts(TYPE.ETHEREUM)
    if (!isEmpty(allAccounts)) {
      const address = await allAccounts[0].get.address()
  
      let siteConnectedAddresses = await storage.setting.get.siteConnectedAddresses()

      if (!siteConnectedAddresses[origin]) {
        siteConnectedAddresses[origin] = { ethereum: [], arweave: [] }
      } 
      siteConnectedAddresses[origin]?.ethereum?.push(address)

      await storage.setting.set.siteConnectedAddresses(siteConnectedAddresses)
  
      next({ data: siteConnectedAddresses.ethereum })
    } else {
      throw new Error('No account')
    }
  } catch (err) {
    next({ error: err.message })
  }
}
