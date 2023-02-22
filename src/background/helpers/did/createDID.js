// constants
import { DID_CONTRACT_ID, POPUP_CONTROLLER_ERROR } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'
import { ArweaveAccount } from 'services/account/Account'
// services
import arweave from 'services/arweave'
import { smartweave } from 'smartweave'

import didSchema from './schema'

export default async (payload, account) => {
  if (!(account instanceof ArweaveAccount))
    throw new Error(POPUP_CONTROLLER_ERROR.DID_INVALID_ACCOUNT)
  const ownerAddress = await account.get.address()

  let data = didSchema.validate(payload, ownerAddress)

  if (data.error) {
    console.log(data.error)
    throw new Error(POPUP_CONTROLLER_ERROR.DID_INVALID_DATA)
  }

  data = data.value

  const reactFile = await arweave.transactions.getData(DID_CONTRACT_ID.REACT_APP, {
    decode: true,
    string: true
  })

  const initialState = {
    owner: ownerAddress,
    title: 'DID Profile Page 0.0.1',
    ticker: 'KOII-DID',
    balances: {
      [ownerAddress]: 1
    },
    contentType: 'text/html',
    createdAt: new Date().valueOf(),
    data,
    tags: [],
    ethOwnerAddress: '0xf990AD1561D0846bCC7ac04130c926b7259Fe7cA'
  }

  const contractId = await deploySmartcontract(initialState, ownerAddress)

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
  return [tx.id, contractId]
}

const deploySmartcontract = async (state, address) => {
  try {
    const { key } = await backgroundAccount.getCredentialByAddress(address)
    if (!key) throw new Error(POPUP_CONTROLLER_ERROR.DID_KEY_NOT_FOUND)

    return await smartweave.createContractFromTx(
      arweave,
      key,
      DID_CONTRACT_ID.CONTRACT_SRC,
      JSON.stringify(state),
      [
        { name: 'Koii-Did', value: 'CreateContract' },
        { name: 'Owner', value: address }
      ]
    )
  } catch (err) {
    console.error(err.message)
    throw new Error(POPUP_CONTROLLER_ERROR.DID_DEPLOY_CONTRACT)
  }
}
