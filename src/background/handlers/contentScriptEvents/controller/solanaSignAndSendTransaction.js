import bs58, { decode } from 'bs58'
import { Transaction, sendAndConfirmTransaction, Message, Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import { decodeTransferInstructionUnchecked, getAccount } from '@solana/spl-token'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import { SolanaTool } from 'services/solana'

import { get, isEmpty } from 'lodash'
import { v4 as uuid } from 'uuid'

// Constants
import { REQUEST, OS, WINDOW_SIZE } from 'constants/koiConstants'

// Utils
import { createWindow } from 'utils/extension'

const getTransactionDataFromMessage = async (transactionMessage) => {
  try {
    console.log('transactionMessage', transactionMessage)
  
    const message = Message.from(bs58.decode(transactionMessage))
  
    const senderAddress = message.accountKeys[0].toString()
    const recipientAddress = message.accountKeys[1].toString()
  
    console.log('senderAddress', senderAddress)
    console.log('recipientAddress', recipientAddress)
  
    console.log('message', message)

    const transaction = Transaction.populate(message)
    const instruction = transaction.instructions[0]

    const decodeData = decodeTransferInstructionUnchecked(instruction)

    console.log('decodeData', decodeData)
    
    if (decodeData.data.instruction === 3) {
      console.log('1')
      const provider = await storage.setting.get.solanaProvider()
      const connection = new Connection(clusterApiUrl(provider), 'confirmed')
      console.log('2')
      const contractData = await getAccount(connection, new PublicKey(decodeData.keys.source.pubkey))

      console.log('contractData', contractData)

      const contractAddress = contractData.mint.toString()

      return {
        from: decodeData.keys.source.pubkey.toString(),
        to: decodeData.keys.destination.pubkey.toString(),
        value: Number(decodeData.data.amount),
        contractAddress
      }
    } else {
      console.log('value', Number(decodeData.data.amount) / 16777216)
      return {
        from: decodeData.keys.owner.pubkey.toString(),
        to: decodeData.keys.destination.pubkey.toString(),
        value: Number(decodeData.data.amount) / 16777216,
      }
    }

  
  } catch (err) {
    console.error(err)
  }
}

export default async (payload, tab, next) => {
  try {
    const params = get(payload, 'data.params')
    const { favicon, origin, hadPermission, hasPendingRequest } = tab

    if (!hadPermission) {
      return next({error: { code: 4100,  data: 'No permissions' }})
    }

    if (hasPendingRequest) {
      next({ error: { code: 4001, data: 'Request pending' } })
      return
    }
    
    const defaultSolanaAddress = await storage.setting.get.activatedSolanaAccountAddress()

    const credential = await backgroundAccount.getCredentialByAddress(defaultSolanaAddress)

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

    const transactionPayload = await getTransactionDataFromMessage(payload.data)

    const requestPayload = {
      origin,
      favicon,
      requestId,
      network: 'SOLANA',
      transactionPayload
    }


    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(
          async function(popupMessage, sender, sendResponse) {
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
                  const defaultSolanaAddress = await storage.setting.get.activatedSolanaAccountAddress()

                  const credential = await backgroundAccount.getCredentialByAddress(defaultSolanaAddress)

                  const transactionMessage = Message.from(bs58.decode(payload.data))
                  const transaction = Transaction.populate(transactionMessage)

                  console.log('transactionMessage', transactionMessage)

                  const solanaProvider = await storage.setting.get.solanaProvider()
                  const connection = new Connection(clusterApiUrl(solanaProvider), 'confirmed')
                  const tool = new SolanaTool(credential)

                  const signature = await sendAndConfirmTransaction(connection, transaction, [tool.keypair])

                  console.log('signature', signature)

                  next({ data: signature })
                  chrome.runtime.sendMessage({requestId, finished: true})
                } catch (err) {
                  console.error('Send sol error:', err.message)
                  chrome.runtime.sendMessage({requestId, finished: true})
                  next({ error: { code: 4001, data: err.message } })
                } 
              } else {
                next({ error: { code: 4001, data: 'Request rejected' } })
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
        next({ error: { code: 4001, data: 'Request rejected' }})
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: err.message })
  }
}
