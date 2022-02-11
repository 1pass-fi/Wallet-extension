import { smartweave } from 'smartweave'

// services
import arweave from 'services/arweave'
import { backgroundAccount } from 'services/account'
import { ArweaveAccount } from 'services/account/Account'

// constants
import { ERROR_MESSAGE, DID_CONTRACT_ID } from 'constants/koiConstants'

import didSchema from './schema'

export default async (payload, account) => {
  if (!(account instanceof ArweaveAccount)) throw new Error(ERROR_MESSAGE.DID.INVALID_ACCOUNT_INPUT)
  const ownerAddress = await account.get.address()

  console.log('payload', payload)

  let data = didSchema.validate(payload, ownerAddress)

  if (data.error) {
    console.log(data.error)
    throw new Error(ERROR_MESSAGE.DID.INVALID_DATA_INPUT)
  }

  data = data.value

  const reactFile = await arweave.transactions.getData(DID_CONTRACT_ID.REACT_APP, {
    decode: true,
    string: true
  })

  console.log('data', data)

  console.log('reactFile', reactFile.length)

  const initialState = {
    owner: ownerAddress,
    title: 'DID Profile Page 0.0.1',
    ticker: 'KOII-DID',
    balances: {
      [ownerAddress]: 1,
    },
    contentType: 'text/html',
    createdAt: new Date().valueOf(),
    data,
    tags: [],
    ethOwnerAddress: '0xf990AD1561D0846bCC7ac04130c926b7259Fe7cA',
  }

  const contractId = await deploySmartcontract(initialState, ownerAddress)
  console.log('smartcontract id', contractId)

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
  console.log('signed tx', tx)
  const uploader = await arweave.transactions.getUploader(tx)
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    console.log(
      uploader.pctComplete + '% complete',
      uploader.uploadedChunks + '/' + uploader.totalChunks
    )
  }
  console.log('react id', tx.id)
  return [tx.id, contractId]
}

const deploySmartcontract = async (state, address) => {
  try {
    const { key } = await backgroundAccount.getCredentialByAddress(address)
    if (!key) throw new Error(ERROR_MESSAGE.DID.KEY_NOT_FOUND)

    return await smartweave.createContractFromTx(
      arweave,
      key,
      DID_CONTRACT_ID.CONTRACT_SRC,
      JSON.stringify(state),
      [
        {name: 'Koii-Did', value: 'CreateContract'},
        {name: 'Owner', value: address}
      ]
    )
  } catch (err) {
    console.error(err.message)
    throw new Error(ERROR_MESSAGE.DID.DEPLOY_CONTRACT_ERROR)
  }
}
