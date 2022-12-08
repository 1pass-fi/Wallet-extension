import { DID_CONTRACT_ID, PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import isEmpty from 'lodash/isEmpty'
import { ArweaveAccount } from 'services/account/Account'
import arweave from 'services/arweave'
import { smartweave } from 'smartweave'

import helpers from '..'

/*
  Map KID to react app
*/
export const mapKoiiMe = async ({ txId, kID, account }) => {
  if (!(account instanceof ArweaveAccount)) throw new Error('Invalid account input')

  const wallet = await account.getKey()
  const ownerAddress = await account.get.address()

  const available = await checkAvailable(kID)
  if (!available) throw new Error('This kID is not available')

  try {
    const input = {
      function: 'register',
      name: kID,
      address: txId
    }

    const transactionId = await smartweave.interactWrite(arweave, wallet, DID_CONTRACT_ID.KID_CONTRACT, input)

    // create pending transaction
    const pendingTransaction = {
      id: transactionId,
      activityName: 'Registered KID',
      expense: 0.00004,
      address: ownerAddress,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.REGISTER_KID,
      data: {
        txId,
        kID
      }
    }

    await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransaction)
    return {kIDCreated: transactionId, id: 'abcd' }
  } catch (err) {
    console.log(err.error)
    return false
  }
}

/* 
  Update KID -> unregsiter -> register
*/
export const updateKoiiMe = async (kID, txId, account) => {
  try {
    const wallet = await account.getKey()
    const ownerAddress = await account.get.address()

    const unregisterInput = {
      function: 'unregister',
      name: kID,
    }
    const transactionId = await smartweave.interactWrite(arweave, wallet, DID_CONTRACT_ID.KID_CONTRACT, unregisterInput)

    // create pending transaction
    const pendingTransaction = {
      id: transactionId,
      activityName: 'Updated KID',
      expense: 0.00004,
      address: ownerAddress,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.UPDATE_KID,
      data: {
        txId,
        kID
      }
    }
    await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransaction)

    return !!transactionId
  } catch (err) {
    console.error(err.message)
    return false
  }
}

/* 
  Read contract to check availability
*/
export const checkAvailable = async (kID) => {
  try {
    const state = await smartweave.readContract(arweave, DID_CONTRACT_ID.KID_CONTRACT)

    const allKIDs = Object.keys(state.dids)
    const existing = allKIDs.includes(kID)
    return !existing

  } catch (err) {
    console.error(err.message)
    return false
  }
}

export const getDIDs = async () => {
  try {
    const state = await smartweave.readContract(arweave, DID_CONTRACT_ID.KID_CONTRACT)
    return isEmpty(state.dids) ? {} : state.dids
  } catch (err) {
    console.error(err.message)
    return {}
  }
}

export default {
  mapKoiiMe,
  checkAvailable,
  updateKoiiMe
}
