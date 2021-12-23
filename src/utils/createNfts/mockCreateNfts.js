import arweave from 'services/arweave'
import nftInfoSchema from './nftInfoSchema'

export default async (nfts, setNfts) => {
  return Promise.all(nfts.map(async (nft, index) => {
    // validate
    const info = nftInfoSchema.validate(nft.info)
    if (info.error) throw new Error(info.error.message)

    const transaction = await arweave.createTransaction({data: []})
    await mockUploadNft()
    setNfts(prev => {prev[index].uploaded = true; return prev})

    return transaction.id
  }))
}

const mockUploadNft = () => {
  const time = (3 + Math.floor(Math.random() * 3)) * 1000

  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
