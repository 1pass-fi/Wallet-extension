// import Web3 from 'web3'
// Constants
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { ethers } from 'ethers'
import { get, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
import { getEthereumNetworkProvider } from 'services/initNetworkProvider'
import storage from 'services/storage'
import ethereumUtils from 'utils/ethereumUtils'
// Utils
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const { favicon, origin, hadPermission, hasPendingRequest, connectedAddresses } = tab

    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    if (hasPendingRequest) {
      next({ error: { code: 4001, data: 'Request pending' } })
      return
    }

    /* Show popup for signing transaction */
    // Avoid error when os getPlatformInfo and display is undefined
    let screen, os
    try {
      os = (await chrome.runtime.getPlatformInfo()).os
    } catch (error) {
      os = 'mac'
    }

    try {
      screen = (await chrome.system.display.getInfo())[0].bounds
    } catch (error) {
      screen = { width: 100, height: 100 }
    }

    const screenWidth = screen.width
    const screenHeight = screen.height

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
                const credential = await backgroundAccount.getCredentialByAddress(
                  ethers.utils.getAddress(connectedAddresses[0])
                )
                const providerUrl = await storage.setting.get.ethereumProvider()

                let { ethersProvider, wallet } = ethereumUtils.initEthersProvider(
                  providerUrl,
                  credential.key
                )
                ethersProvider = await getEthereumNetworkProvider(providerUrl)

                const signer = wallet.connect(ethersProvider)

                // init transaction payload
                let transactionPayload = params[0]
                delete transactionPayload.gas

                const maxPriorityFeePerGas =
                  get(popupMessage, 'maxPriorityFeePerGas') ||
                  ethers.utils.parseUnits('2.5', 'gwei')
                const maxFeePerGas =
                  get(popupMessage, 'maxFeePerGas') ||
                  (await ethereumUtils.calculateMaxFeePerGas(providerUrl, '2.5'))

                const nonce = await ethersProvider.getTransactionCount(
                  connectedAddresses[0],
                  'pending'
                )

                const gasLimit = await signer.estimateGas(transactionPayload)

                const type = 2 // 0: legacy; 2: eip1559

                const chainId = (await ethersProvider.getNetwork()).chainId

                transactionPayload = {
                  ...transactionPayload,
                  type,
                  maxPriorityFeePerGas,
                  maxFeePerGas,
                  nonce,
                  gasLimit,
                  chainId
                }

                console.log('transactionPayload', transactionPayload)

                const rawTransaction = await signer.signTransaction(transactionPayload)
                const signedTransaction = ethers.utils.parseTransaction(rawTransaction)
                const txHash = get(signedTransaction, 'hash')

                await (await ethersProvider.sendTransaction(rawTransaction)).wait()
                next({ data: txHash })
                chrome.runtime.sendMessage({ requestId, finished: true })
                sendResponse({data: { requestId, finished: true }})
              } catch (err) {
                console.error('Send eth error:', err.message)
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
