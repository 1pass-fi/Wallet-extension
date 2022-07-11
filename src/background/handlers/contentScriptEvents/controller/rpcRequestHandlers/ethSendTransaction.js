// import Web3 from 'web3'
import { ethers } from 'ethers'

import { clarifyEthereumProvider } from 'utils'

// Constants
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { get, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
// Utils
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const { favicon, origin, hadPermission, hasPendingRequest } = tab

    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    if (hasPendingRequest) {
      next({ error: { code: 4001, data: 'Request pending' } })
      return
    }

    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()

    const credential = await backgroundAccount.getCredentialByAddress(defaultEthereumAddress)

    const key = credential.key

    /* Show popup for signing transaction */
    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight
    const os = window.localStorage.getItem(OS)
    let windowData = {
      url: chrome.runtime.getURL('/popup.html'),
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
      origin,
      favicon,
      requestId,
      isEthereum: true,
      network: 'ETHEREUM',
      transactionPayload: {
        ...params[0]
      }
    }

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.action.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(async function (popupMessage, sender, sendResponse) {
          if (popupMessage.requestId === requestId) {
            const approved = popupMessage.approved
            if (approved) {
              var pendingRequest = await storage.generic.get.pendingRequest()
              if (isEmpty(pendingRequest)) {
                next({ error: { code: 4001, data: 'Request has been removed' } })
                chrome.runtime.sendMessage({
                  requestId,
                  error: 'Request has been removed'
                })
                return
              }
              try {
                /* Send ETH transaction */
                const provider = await storage.setting.get.ethereumProvider()

                const rawTx = params[0]

                console.log('rawTx', rawTx)

                const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

                const network = ethers.providers.getNetwork(ethNetwork)
                const web3 = new ethers.providers.InfuraProvider(network, apiKey)

                // const estimateGas = await web3.eth.estimateGas(rawTx)
                const estimateGas = await web3.estimateGas(rawTx)
                rawTx.gas = estimateGas
                
                // TODO - DatH Switch to ethers
                // const signTx = await web3.eth.accounts.signTransaction(rawTx, key)
                // const receipt = await web3.eth.sendSignedTransaction(signTx.rawTransaction)
                const signer = new ethers.Wallet(key, web3)
                const signTx = await signer.signTransaction(rawTx)
                const receipt = await web3.sendTransaction(signTx)

                console.log('receipt', receipt)

                next({ data: receipt.transactionHash })
                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {
                console.error('Send eth error:', err.message)
                chrome.runtime.sendMessage({ requestId, finished: true })
                next({ error: { code: 4001, data: err.message } })
              }
            } else {
              next({ error: { code: 4001, data: 'Request rejected' } })
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.ETH_TRANSACTION,
          data: requestPayload
        })
      },
      afterClose: async () => {
        chrome.action.setBadgeText({ text: '' })
        next({ error: { code: 4001, data: 'Request rejected' } })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: err.message })
  }
}
