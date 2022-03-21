import Web3 from 'web3'
import { get } from 'lodash'
import { v4 as uuid } from 'uuid'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

// Constants
import { REQUEST, OS, WINDOW_SIZE } from 'constants/koiConstants'

// Utils
import { createWindow } from 'utils/extension'



export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const { favicon, origin } = tab
    
    const rawTx = {
      from: '0xb076413401172CBB73C082107514De3376E4FF6c',
      to: '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb',
      value: '0x0',
      gas: 0,
      type: '0x0'
    }

    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
    console.log('defaultEthereumAddress', defaultEthereumAddress)

    const credential = await backgroundAccount.getCredentialByAddress(defaultEthereumAddress)
    console.log('credential', credential)

    const key = credential.key

    /* Show popup for signing transaction */
    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight
    const os = window.localStorage.getItem(OS)
    let windowData = {
      url: chrome.extension.getURL('/popup.html'),
      focused: true,
      type: 'popup',
    }
    if (os == 'win') {
      windowData = {
        ...windowData,
        height: WINDOW_SIZE.WIN_HEIGHT,
        width: WINDOW_SIZE.WIN_WIDTH,
        left: Math.round((screenWidth - WINDOW_SIZE.WIN_WIDTH) / 2),
        top: Math.round((screenHeight - WINDOW_SIZE.WIN_HEIGHT) / 2)
      }
    } else {
      windowData = {
        ...windowData,
        height: WINDOW_SIZE.MAC_HEIGHT,
        width: WINDOW_SIZE.MAC_WIDTH,
        left: Math.round((screenWidth - WINDOW_SIZE.MAC_WIDTH) / 2),
        top: Math.round((screenHeight - WINDOW_SIZE.MAC_HEIGHT) / 2)
      }
    }
    
    const requestId = uuid()
    const requestPayload = {
      origin,
      favicon,
      requestId,
      isEthereum: true,
      params,
    }


    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(
          async function(popupMessage, sender, sendResponse) {
            if (popupMessage.requestId === requestId) {
              const approved = popupMessage.approved
              if (approved) {
                try {
                  /* Send ETH transaction */
                  const provider = await storage.setting.get.ethereumProvider()
                  console.log('provider', provider)

                  const web3 = new Web3(provider)
                  const estimateGas = await web3.eth.estimateGas(rawTx)
                  rawTx.gas = estimateGas
              
                  const signTx = await web3.eth.accounts.signTransaction(rawTx, key)
                  const receipt = await web3.eth.sendSignedTransaction(signTx.rawTransaction)
                  next({ data: receipt })

                  chrome.runtime.sendMessage({requestId, finished: true})
                  return true
                } catch (err) {
                  console.error(err.message)
                } 
              } else {
                next({ error: { code: 4001, data: 'User rejected request' } })
              }
            }
          }
        )

        await storage.generic.set.pendingRequest({
          type: REQUEST.TRANSACTION,
          data: requestPayload
        })
      },
      afterClose: async () => {
        chrome.browserAction.setBadgeText({ text: '' })
        next({ error: 'User cancelled the login.' })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: err.message })
  }
}
