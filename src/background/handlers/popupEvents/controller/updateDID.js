// Services
import { backgroundAccount } from 'services/account'
import helpers from 'background/helpers'

import storage from 'services/storage'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'

export default async (payload, next) => {
  try {
    const { didData, txId, newkID, activatedAddress } = payload.data

    let address
    if (activatedAddress) address = activatedAddress
    else address = await storage.setting.get.activatedAccountAddress()

    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)
    
    let transactionId
    try {
      transactionId = await helpers.did.updateDID(didData, txId, account)
    } catch (err) {
      next({ error: err.message, status: 400 })
      return
    }

    let reactAppId = await helpers.did.getDID(null, txId)

    if (newkID) {
      const { kIDCreated } = await helpers.did.koiiMe.mapKoiiMe({ txId: reactAppId, kID: didData.kID, account })

      if (!kIDCreated) {
        next({ error: 'Map koii.id error', status: 400 })
        return
      }
    }

    // create pending transaction
    const pendingPayload = {
      id: transactionId,
      activityName: 'Updated DID',
      expense: 0.00007,
      target: null,
      address,
      network: null,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.UPDATE_DID,
      contract: null,
      data: {
        didData,
        didTransactionID: txId,
        reactAppId
      }
    }

    await helpers.pendingTransactionFactory.createPendingTransaction(pendingPayload)

    next({ data: transactionId, status: 200 })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Update DID error', status: 500 })
  }
}
