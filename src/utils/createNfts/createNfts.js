import { Web } from '@_koi/sdk/web'

import arweave from 'services/arweave'
import { popupBackgroundRequest as request } from 'services/request/popup'

import nftInfoSchema from './nftInfoSchema'

/* 
  Return nft ids of uploaded nfts
*/
export default async (nfts, setNfts, address) => {
  const key = await request.gallery.getKey({address})

  let info = nftInfoSchema.validate(nfts.info)
  if (info.error) throw new Error(info.error.message)

  info = info.value

  return await Promise.all(nfts.map(async ({ info, file }, index) => {
    const buffer = await getBufferFromFile(file)
    const transaction = await createTransaction(buffer, info)

    await arweave.transactions.sign(transaction, key)
    const uploader = await arweave.transactions.getUploader(transaction)
    while (!uploader.isComplete) {
      await uploader.uploadChunk()
    }

    const koii = new Web()
    koii.wallet = key
    await koii.getWalletAddress()
    await registerData(koii, transaction.id)

    setNfts(prev => {prev[index].uploaded = true; return prev})

    return transaction.id
  }))
}

const getBufferFromFile = async (file) => {
  const url = URL.createObjectURL(file)

  const response = await fetch(url)
  const blob = await response.blob()
  return blob.arrayBuffer()
}

const createTransaction = async (buffer, info) => {
  const { isNSFW, ownerName, ownerAddress, title, description, tags, contentType, createdAt } = info

  try {
    const balances = { [ownerAddress]: 1 }
    const ticker = 'KOINFT'

    const initialState = {
      'owner': ownerAddress,
      'title': title,
      'name': ownerName,
      'description': description,
      'ticker': ticker,
      'balances': balances,
      'contentType': contentType,
      'createdAt': createdAt,
      'tags': tags,
      'locked': []
    }

    const transaction = await arweave.createTransaction({ data: buffer })
    addTag({ transaction, contentType, initialState, isNSFW })

    return transaction
  } catch (err) {
    throw new Error(err.message)
  }
}

const addTag = ({ transaction, contentType, initialState, isNSFW }) => {
  transaction.addTag('Content-Type', contentType)
  transaction.addTag('Network', 'Koii')
  transaction.addTag('Action', 'marketplace/Create')
  transaction.addTag('App-Name', 'SmartWeaveContract')
  transaction.addTag('App-Version', '0.3.0')
  transaction.addTag('Contract-Src', 'r_ibeOTHJW8McJvivPJjHxjMwkYfAKRjs-LjAeaBcLc')
  transaction.addTag('Init-State', JSON.stringify(initialState))
  transaction.addTag('NSFW', isNSFW)
}

const registerData = async (koii, txId) => {
  await koii.burnKoiAttention(txId)
  await koii.migrateAttention()
}
