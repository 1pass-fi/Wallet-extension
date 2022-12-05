import { decodeTransferInstructionUnchecked, getAccount } from '@solana/spl-token'
import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { getInternalError, getSdkError } from '@walletconnect/utils'
import base58 from 'bs58'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { backgroundAccount } from 'services/account'
import { SolanaTool } from 'services/solana'
import storage from 'services/storage'
import clusterApiUrl from 'utils/clusterApiUrl'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

const getTransactionFromParams = (params) => {
  let instructions = get(params, 'instructions')
  instructions = instructions.map(
    (instruction) =>
      new TransactionInstruction({
        programId: new PublicKey(instruction.programId),
        data: base58.decode(instruction.data),
        keys: instruction.keys.map((key) => ({
          isSigner: key.isSigner,
          isWritable: key.isWritable,
          pubkey: new PublicKey(key.pubkey)
        }))
      })
  )

  const transaction = new Transaction()
  transaction.feePayer = new PublicKey(get(params, 'feePayer'))
  transaction.recentBlockhash = get(params, 'recentBlockhash')
  transaction.add(...instructions)

  return transaction
}
const getTransactionData = async (transaction) => {
  try {
    const instruction = transaction.instructions[0]
    const decodeData = decodeTransferInstructionUnchecked(instruction)

    console.log('decodeData', decodeData)
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
  } catch (err) {
    console.error(err)
  }
}
export default async (payload, next) => {
  try {
    console.log('solana sign transaction')
    console.log('payload', payload)

    const params = get(payload, 'params')
    const transaction = getTransactionFromParams(params)

    console.log('transaction', transaction)
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

    const requestId = uuid()

    const transactionPayload = await getTransactionData(transaction)
    console.log('transactionPayload', transactionPayload)

    const requestPayload = {
      requestId,
      network: 'SOLANA',
      transactionPayload,
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
                next({ error: getInternalError('EXPIRED') })
                chrome.runtime.sendMessage({
                  requestId,
                  error: 'Request has been removed'
                })
                return
              }
              try {
                /* Sign transaction */
                const credentials = await backgroundAccount.getCredentialByAddress(
                  get(params, 'feePayer')
                )
                const solTool = new SolanaTool(credentials)
                const keypair = solTool.keypair

                transaction.sign(keypair)
                console.log('signed transaction', transaction)

                const signature = base58.encode(transaction.signature)
                console.log('signature', signature)

                next({ data: { signature } })
                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {
                console.error('Sign transaction error:', err.message)
                chrome.runtime.sendMessage({ requestId, finished: true })
                next({ error: { code: 4001, message: err.message } })
              }
            } else {
              next({ error: getSdkError('USER_REJECTED_METHODS') })
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
        next({ error: getSdkError('USER_REJECTED_METHODS') })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (error) {
    console.log('hihihihi', error)
    next({ error: { code: 4001, message: error.message } })
  }
}
