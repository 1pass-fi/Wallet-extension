import { isEmpty } from 'lodash'

import resendKoii from './resendKoii'
import resendAr from './resendAr'
import resendMintNft from './resendMintNft'
import resendNft from './resendNft'
import resendUpdateDID from './resendUpdateDID'
import updatePendingTransaction from './updatePendingTransaction'
import resendCreateDID from './resendCreateDID'
import resendCreateDIDData from './resendCreateDIDData'
import errorHandler from 'background/helpers/errorHandler'

import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import { BackgroundAccount } from 'services/account/Account'

const resendTransaction = async (account, transaction) => {
  let newTransactionId
  if (!(account instanceof BackgroundAccount)) throw new Error('Invalid input account')
  if (isEmpty(transaction)) throw new Error('Invalid input transaction')
  
  const type = transaction?.transactionType
  switch (type) {
    case PENDING_TRANSACTION_TYPE.SEND_KOII:
      newTransactionId = await resendKoii(account, transaction)
      break
    case PENDING_TRANSACTION_TYPE.SEND_AR:
      newTransactionId = await resendAr(account, transaction)
      break
    case PENDING_TRANSACTION_TYPE.MINT_NFT:
      newTransactionId = await resendMintNft(account, transaction)
      break
    case PENDING_TRANSACTION_TYPE.SEND_NFT:
      newTransactionId = await resendNft(account, transaction)
      break
    case PENDING_TRANSACTION_TYPE.UPDATE_DID:
      newTransactionId = await resendUpdateDID(account, transaction)
      break
    case PENDING_TRANSACTION_TYPE.CREATE_DID:
      newTransactionId = await resendCreateDID(account, transaction)
      break
    case PENDING_TRANSACTION_TYPE.CREATE_DID_DATA:
      newTransactionId = await resendCreateDIDData(account, transaction)
      break
    default:
      throw new Error('Invalid input transaction')
  }

  await updatePendingTransaction(account, transaction, newTransactionId)
  return newTransactionId
}

export default errorHandler(resendTransaction)
