import { getInternalError, getSdkError } from '@walletconnect/utils'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { ethers } from 'ethers'
import { get, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import ethereumUtils from 'utils/ethereumUtils'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, metadata, next) => {
  try {
    console.log('eth send transaction')
    console.log('payload', payload)
    console.log('metadata', metadata)

    const params = get(payload, 'params')

    /* Show popup for signing transaction */
    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight
    const os = window.localStorage.getItem(OS)
    let windowData = {
      url: chrome.extension.getURL('/popup.html'),
      focused: true,
      type: 'popup'
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
      requestId,
      isEthereum: true,
      network: 'ETHEREUM',
      transactionPayload: {
        ...params[0]
      }
    }

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(async function (popupMessage, sender, sendResponse) {
          console.log('createWindow', { popupMessage, sender, sendResponse })
          if (popupMessage.requestId === requestId) {
            const approved = popupMessage.approved
            if (approved) {
              var pendingRequest = await storage.generic.get.pendingRequest()
              if (isEmpty(pendingRequest)) {
                next({ error: getInternalError('EXPIRED') })
                chrome.runtime.sendMessage({
                  requestId,
                  error: 'Request has been removed'
                })
                return
              }
              try {
                /* Send ETH transaction */
                const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
                const credential = await backgroundAccount.getCredentialByAddress(
                  defaultEthereumAddress
                )

                const provider = await storage.setting.get.ethereumProvider()
                const { ethersProvider, wallet } = ethereumUtils.initEthersProvider(
                  provider,
                  credential.key
                )

                const signer = wallet.connect(ethersProvider)
                const transactionPayload = params[0]

                const rawTransaction = await signer.signTransaction(transactionPayload)
                const signedTransaction = ethers.utils.parseTransaction(rawTransaction)
                const txHash = get(signedTransaction, 'hash')
                const sendingPromise = (await ethersProvider.sendTransaction(rawTransaction)).wait()

                next({ data: txHash })
                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {
                console.error('Send eth error:', err.message)
                chrome.runtime.sendMessage({ requestId, finished: true })
                next({ error: { code: 4001, message: err.message } })
              }
            } else {
              next({ error: getSdkError('USER_REJECTED_METHODS') })
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.ETH_TRANSACTION,
          data: requestPayload
        })
      },
      afterClose: async () => {
        chrome.browserAction.setBadgeText({ text: '' })
        next({ error: getSdkError('USER_REJECTED_METHODS') })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: { code: 4001, message: err.message } })
  }
}
