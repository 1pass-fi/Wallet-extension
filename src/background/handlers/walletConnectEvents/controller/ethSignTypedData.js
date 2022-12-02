import { getInternalError, getSdkError } from '@walletconnect/utils'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { ethers } from 'ethers'
import { get, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import ethereumUtils from 'utils/ethereumUtils'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, next) => {
  try {
    const params = get(payload, 'params')

    const data = JSON.parse(params[1])

    /* Show popup */
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
    const requestData = {
      requestId,
      isEthereum: true,
      requestPayload: data
    }

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(async function (popupMessage, sender, sendResponse) {
          if (popupMessage.requestId === requestId) {
            const approved = popupMessage.approved
            if (approved) {
              try {
                const credential = await backgroundAccount.getCredentialByAddress(ethers.utils.getAddress(params[0]))

                // Prepare data for _signTypedData function
                const types = get(data, 'types')
                // https://github.com/ethers-io/ethers.js/issues/687
                delete types.EIP712Domain
                const domain = get(data, 'domain')
                const message = get(data, 'message')

                const provider = await storage.setting.get.ethereumProvider()
                const { ethersProvider, wallet } = ethereumUtils.initEthersProvider(
                  provider,
                  credential.key
                )

                const signer = wallet.connect(ethersProvider)
                const msgSig = await signer._signTypedData(domain, types, message)

                const verifiedAddress = ethers.utils.verifyTypedData(domain, types, message, msgSig)

                if (verifiedAddress === credential.address) {
                  next({ data: msgSig })
                } else {
                  next({ error: getInternalError('NO_MATCHING_KEY') })
                }

                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {
                console.error('ETH sign error:', err.message)
                chrome.runtime.sendMessage({ requestId, finished: true })
                next({ error: { code: 4001, message: err.message } })
              }
            } else {
              next({ error: getSdkError('USER_REJECTED_METHODS') })
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.SIGN_TYPED_DATA_V4,
          data: requestData
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
