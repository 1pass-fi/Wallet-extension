import errorHandler from 'background/helpers/errorHandler'
import createTransaction from 'background/helpers/uploadNft/createTransaction'
import { find } from 'lodash'
import arweave from 'services/arweave'

const resendMintNft = async (account, transaction) => {
  const pendingAssets = await account.get.pendingAssets()
  const asset = find(pendingAssets, (asset) => asset.txId === transaction.id)

  if (!asset) throw new Error('Asset not found')

  const arrayBuffer = await getArrayBuffer(asset)

  const nftContent = {
    title: asset.name,
    owner: asset.owner,
    description: asset.description,
    isNSFW: asset.isNSFW
  }

  const createdAt = Math.floor(transaction.timestamp / 1000).toString()

  const newTransaction = await createTransaction({
    u8: arrayBuffer,
    nftContent,
    nftTags: asset.tags,
    fileType: asset.contentType,
    ownerAddress: transaction.address,
    createdAt
  })

  // check price
  const price = arweave.transactions.getPrice(newTransaction.data_size)
  const { balance: arBalance, koiBalance } = await account.method.getBalances()
  console.log('arBalance', arBalance)
  console.log('koiBalance', koiBalance)
  if (arBalance < price || koiBalance < 1)
    throw new Error(chrome.i18n.getMessage('notEnoughARorKoiiTokens'))

  // sign transaction
  await account.method.signTx(newTransaction)

  // post
  const uploader = await arweave.transactions.getUploader(newTransaction)
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    console.log(
      uploader.pctComplete + '% complete',
      uploader.uploadedChunks + '/' + uploader.totalChunks
    )
  }

  // register NFT
  await account.method.registerNft(newTransaction.id)

  return newTransaction.id
}

const getArrayBuffer = async (asset) => {
  try {
    const imgBase64 = asset.imageUrl.slice(asset.imageUrl.indexOf(',') + 1)
    return base64ToArrayBuffer(imgBase64)
  } catch (err) {
    console.error(err.message)
    throw new Error('Get array buffer failed')
  }
}

const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes.buffer
}

export default errorHandler(resendMintNft)
