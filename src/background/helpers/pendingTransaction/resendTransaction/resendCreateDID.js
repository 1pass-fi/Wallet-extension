/* 
  Resend the transaction the will create the react app
*/
import koiiMe from 'background/helpers/did/koiiMe'
import { DID_CONTRACT_ID } from 'constants/koiConstants'
import { get } from 'lodash'
import arweave from 'services/arweave'

import errorHandler from '../../errorHandler'

const resendCreateDID = async (account, transaction) => {
  const contractId = get(transaction, 'data.dataContractID')
  const kID = get(transaction, 'data.kID')
  if (!contractId) throw new Error('Contract ID not found.')
  if (!kID) throw new Error('Koii ID not found.')

  const txId = await createReactAppDID(contractId, account)

  // map koiime to new react app
  await koiiMe.updateKoiiMe(kID, txId, account)

  return txId
}

const createReactAppDID = async (contractId, account) => {
  const reactFile = await arweave.transactions.getData(DID_CONTRACT_ID.REACT_APP, {
    decode: true,
    string: true
  })

  const tx = await arweave.createTransaction({
    data: reactFile
  })

  tx.addTag('Content-Type', 'text/html')
  tx.addTag('Exchange', 'Verto')
  tx.addTag('Action', 'marketplace/Create')
  tx.addTag('App-Name', 'SmartWeaveContract')
  tx.addTag('App-Version', '0.3.1') 
  tx.addTag('Contract-Id', contractId)
  tx.addTag('Koii-Did', 'CreateReactApp')

  await account.method.signTx(tx)
  const uploader = await arweave.transactions.getUploader(tx)
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    console.log(
      uploader.pctComplete + '% complete',
      uploader.uploadedChunks + '/' + uploader.totalChunks
    )
  }
  console.log('react id', tx.id)

  return tx.id
}

export default errorHandler(resendCreateDID)
