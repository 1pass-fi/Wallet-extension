/* 
  Resend the transaction the will create the react app
*/
import { get } from 'lodash'

import arweave from 'services/arweave'
import { DID_CONTRACT_ID } from 'constants/koiConstants'

import errorHandler from '../../errorHandler'
import koiiMe from 'background/helpers/did/koiiMe'

const resendCreateDID = async (account, transaction) => {
  const contractId = get(transaction, 'data.dataContractID')
  const brandlyId = get(transaction, 'data.brandlyID')
  if (!contractId) throw new Error('Contract ID not found.')
  if (!brandlyId) throw new Error('Brandly ID not found.')

  const txId = await createReactAppDID(contractId, account)

  // map koiime to new react app
  await koiiMe.updateKoiiMe(brandlyId, txId)

  return txId
}

const createReactAppDID = async (contractId, account) => {
  const reactFile = await arweave.transactions.getData(DID_CONTRACT_ID.REACT_APP, {
    decode: true,
    string: true
  })

  console.log('reactFile', reactFile.length)

  const tx = await arweave.createTransaction({
    data: reactFile
  })

  tx.addTag('Content-Type', 'text/html')
  tx.addTag('Exchange', 'Verto')
  tx.addTag('Action', 'marketplace/Create')
  tx.addTag('App-Name', 'SmartWeaveContract')
  tx.addTag('App-Version', '0.3.0') 
  tx.addTag('Contract-Id', contractId)
  tx.addTag('Koii-Did', 'CreateReactApp')

  await account.method.signTx(tx)
  console.log('signed tx', tx)
  const uploader = await arweave.transactions.getUploader(tx)
  await uploader.uploadChunk()
  console.log('react id', tx.id)

  return tx.id
}

export default errorHandler(resendCreateDID)
