// Services
import { backgroundAccount } from 'services/account'
import helpers from 'background/helpers'

import storage from 'services/storage'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'

export default async (payload, next) => {
  try {
    const { didData, activatedAddress } = payload.data

    let address
    if (activatedAddress) address = activatedAddress
    else address = await storage.setting.get.activatedArweaveAccountAddress()

    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    let id, contractId
    try {
      [id, contractId] = await helpers.did.createDID(didData, account)
      console.log('react app', id)
      console.log('did', contractId)

    } catch (err) {
      next({ error: err.message, status: 400 })
    }
    
    await account.method.registerData(contractId)

    const { kIDCreated, id: brandlyID } = await helpers.did.koiiMe.mapKoiiMe({ txId: id, kID: didData.kID, account })

    if (!kIDCreated) {
      next({ error: 'Map koii.id error', status: 400 })
      return
    }

    // create pending transactions
    const createDIDPending = {
      id,
      activityName: 'Created DID',
      expense: 0.0005,
      target: null,
      address,
      network: null,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.CREATE_DID,
      contract: null,
      data: {
        dataContractID: contractId,
        brandlyID,
        kID: didData.kID
      }
    }

    const createDIDDataPending = {
      id: contractId,
      activityName: 'Initialized DID Data',
      expense: 0.00004,
      target: null,
      address,
      network: null,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.CREATE_DID_DATA,
      contract: null,
      data: {
        didData,
        brandlyID,
        reactAppId: id
      }
    }

    await helpers.pendingTransactionFactory.createPendingTransaction(createDIDPending)
    await helpers.pendingTransactionFactory.createPendingTransaction(createDIDDataPending)

    next({ data: {id, contractId}, status: 200 })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Create DID error', status: 500 })
  }
}
