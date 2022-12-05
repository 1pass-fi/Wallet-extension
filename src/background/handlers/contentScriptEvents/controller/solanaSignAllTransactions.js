import { decodeTransferInstructionUnchecked, getAccount } from '@solana/spl-token'
import { Message, Transaction } from '@solana/web3.js'
import { Connection, PublicKey } from '@solana/web3.js'
import axiosAdapter from '@vespaiach/axios-fetch-adapter'
import axios from 'axios'
import base58 from 'bs58'
import bs58 from 'bs58'
// Constants
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { backgroundAccount } from 'services/account'
import { SolanaTool } from 'services/solana'
import storage from 'services/storage'
import clusterApiUrl from 'utils/clusterApiUrl'
// Utils
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

/* Use for solsea only */
const getTransactionValue = async (transaction, address) => {
  try {
    const provider = await storage.setting.get.solanaProvider()
    const connection = new Connection(clusterApiUrl(provider))
    const blockhash = (await connection.getLatestBlockhash()).blockhash
    transaction.recentBlockhash = blockhash

    const transactionString = base58.encode(transaction.serialize({ verifySignatures: false }))

    const providerUrl = clusterApiUrl(provider)
    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method: 'simulateTransaction',
      params: [
        transactionString,
        {
          accounts: {
            addresses: [address]
          }
        }
      ]
    }
    const response = await axios.post(providerUrl, requestBody, { adapter: axiosAdapter })

    const afterBalance = get(response, 'data.result.value.accounts[0].lamports')

    if (!afterBalance) {
      throw new Error('Simulate value failed')
    }

    const balance = await connection.getBalance(new PublicKey(address))
    return balance - afterBalance
  } catch (err) {
    console.error(err)
    throw err
  }
}

const getTransactionDataFromMessage = async (transactionMessage, origin, address) => {
  try {
    const SOLSEA_URL = 'https://solsea.io'
    const provider = await storage.setting.get.solanaProvider()
    const connection = new Connection(clusterApiUrl(provider), 'confirmed')

    if (origin === SOLSEA_URL) {
      try {
        const message = Message.from(bs58.decode(transactionMessage))
        const transaction = Transaction.populate(message)
        const blockhash = (await connection.getLatestBlockhash()).blockhash
        transaction.recentBlockhash = blockhash

        const from = transaction.feePayer.toString()
        const value = await getTransactionValue(transaction, address)

        return {
          from,
          value,
          transactionMessage
        }
      } catch (err) {
        throw err
      }
    } else {
      const message = Message.from(bs58.decode(transactionMessage))

      const transaction = Transaction.populate(message)
      const instruction = transaction.instructions[0]

      const decodeData = decodeTransferInstructionUnchecked(instruction)

      if (decodeData.data.instruction === 3) {
        const provider = await storage.setting.get.solanaProvider()
        const connection = new Connection(clusterApiUrl(provider), 'confirmed')

        const contractData = await getAccount(
          connection,
          new PublicKey(decodeData.keys.source.pubkey)
        )
        const contractAddress = contractData.mint.toString()

        const recipientAccount = await getAccount(
          connection,
          new PublicKey(decodeData.keys.destination.pubkey)
        )

        return {
          from: decodeData.keys.owner.pubkey.toString(),
          to: recipientAccount.owner.toString(),
          value: Number(decodeData.data.amount),
          contractAddress
        }
      } else {
        return {
          from: decodeData.keys.source.pubkey.toString(),
          to: decodeData.keys.destination.pubkey.toString(),
          value: Number(decodeData.data.amount) / 16777216
        }
      }
    }
  } catch (err) {
    throw err
  }
}

export default async (payload, tab, next) => {
  try {
    const {
      origin,
      favicon,
      hadPermission,
      hasPendingRequest,
      activatedAddress,
      connectedAddresses
    } = tab

    if (!hadPermission) {
      return next({ error: { code: 4100, message: 'No permissions' } })
    }

    if (hasPendingRequest) {
      next({ error: { code: 4001, message: 'Request pending' } })
      return
    }

    /* Show popup for signing transaction */
    const screen = (await chrome.system.display.getInfo())[0].bounds
    const screenWidth = screen.width
    const screenHeight = screen.height
    const os = (await chrome.runtime.getPlatformInfo()).os

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

    /* Temporary disabling sign multiple transactions */
    if (payload?.data?.length > 1) {
      return next({
        error: {
          code: -32000,
          message: 'Finnie is unable to sign multiple transactions at the same time.'
        }
      })
    }

    const messages = payload.data
    const message = messages[0]
    let transactionPayload

    try {
      transactionPayload = await getTransactionDataFromMessage(message, origin, activatedAddress)
    } catch (err) {
      return next({
        error: {
          code: -32000,
          message:
            'Attempt to obtain transaction data failed. Please ensure that you have sufficient balance.'
        }
      })
    }
    const requestId = uuid()
    const requestPayload = {
      origin,
      favicon,
      requestId,
      network: 'SOLANA',
      transactionPayload,
      message,
      signWithoutSend: true
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
                next({ error: { code: 4001, message: 'Request has been removed' } })
                chrome.runtime.sendMessage({
                  requestId,
                  error: 'Request has been removed'
                })
                return
              }
              try {
                const credentials = await backgroundAccount.getCredentialByAddress(
                  connectedAddresses[0]
                )
                const solTool = new SolanaTool(credentials)
                const keypair = solTool.keypair
                const signatures = await Promise.all(
                  messages.map(async (message) => {
                    const _message = Message.from(base58.decode(message))
                    const transaction = Transaction.populate(_message)
                    transaction.sign(keypair)

                    return transaction.signatures
                  })
                )

                next({ data: signatures })
                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {
                console.error('Sign transactions error:', err.message)
                chrome.runtime.sendMessage({ requestId, finished: true })
                next({ error: { code: 4001, message: err.message } })
              }
            } else {
              next({ error: { code: 4001, message: 'Request rejected' } })
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.TRANSACTION,
          data: requestPayload
        })
      },
      afterClose: async () => {
        chrome.action.setBadgeText({ text: '' })
        next({ error: { code: 4001, message: 'Request rejected' } })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    console.error(err)
    next({ data: { status: 500, message: 'Solana signAllTransactions error' } })
  }
}
