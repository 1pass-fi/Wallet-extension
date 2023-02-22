// Services
import helpers from 'background/helpers'
// Constants
import { PENDING_TRANSACTION_TYPE, POPUP_CONTROLLER_ERROR } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'
import arweave from 'services/arweave'

export default async (payload, next) => {
  const { content, tags, fileType, address, price, imageId } = payload.data
  try {
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    const { u8, imageId: _imageId, file } = await helpers.uploadNft.getImageDataForNFT()
    const createdAt = Math.floor(Date.now() / 1000).toString()

    // check for imageId
    console.log('Upload NFT [1/6]: check for imageId')
    if (imageId !== _imageId) throw new Error(POPUP_CONTROLLER_ERROR.INVALID_CONTENT)

    // create transaction
    console.log('Upload NFT [2/6]: create transaction')
    let transaction
    try {
      transaction = await helpers.uploadNft.createTransaction({
        u8,
        nftContent: content,
        nftTags: tags,
        fileType,
        ownerAddress: address,
        createdAt
      })
    } catch (err) {
      console.error(err.message)
      throw new Error(POPUP_CONTROLLER_ERROR.CREATE_TRANSACTION)
    }
    console.log('Created transaction: ', transaction)

    // sign transaction
    console.log('Upload NFT [3/6]: sign transaction')
    try {
      await account.method.signTx(transaction)
    } catch (err) {
      console.error(err.message)
      throw new Error(POPUP_CONTROLLER_ERROR.SIGN_TRANSACTION)
    }
    console.log('Signed transaction: ', transaction)

    // get registrationReward data (true -> don't need to register this nft)
    console.log('Upload NFT [4/6]: check hasRegistrationReward')
    let hasRegistrationReward = false
    // try {
    //   const registrationReward = await account.method.getRegistrationReward(transaction.id)
    //   hasRegistrationReward = registrationReward.status === 200
    // } catch (err) {
    //   console.error(err.message)
    //   hasRegistrationReward = false
    // }
    console.log('Has registration reward: ', hasRegistrationReward)

    // post transaction
    console.log('Upload NFT [5/6]: post transaction')
    try {
      const uploader = await arweave.transactions.getUploader(transaction)
      while (!uploader.isComplete) {
        await uploader.uploadChunk()
        console.log(
          uploader.pctComplete + '% complete',
          uploader.uploadedChunks + '/' + uploader.totalChunks
        )
      }
    } catch (err) {
      console.error(err.message)
      throw new Error(POPUP_CONTROLLER_ERROR.UPLOAD_NFT)
    }
    console.log('NFT uploaded')

    // register NFT
    console.log('Register NFT [6/6]: register nft')
    if (!hasRegistrationReward) {
      try {
        await account.method.registerNft(transaction.id)
      } catch (err) {
        console.error(err.message)
        throw new Error(POPUP_CONTROLLER_ERROR.REGISTER_NFT)
      }
    }
    console.log('NFT registered')

    const result = { txId: transaction.id, createdAt }
    console.log('Upload NFT result', result)

    // save pending transaction to storage
    const payload = {
      id: transaction.id,
      activityName: `Minted NFT "${content.title}"`,
      expense: price,
      target: null,
      address,
      network: null,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.MINT_NFT
    }
    await helpers.pendingTransactionFactory.createPendingTransaction(payload)

    // save pending nft to storage
    const nftPayload = {
      file,
      nftContent: content,
      nftTags: tags,
      nftId: transaction.id,
      fileType,
      ownerAddress: address,
      createdAt,
      address,
      isPrivate: false
    }
    await helpers.pendingTransactionFactory.createPendingAsset(nftPayload)

    next({ data: result })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
