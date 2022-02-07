import { v4 as uuid } from 'uuid'

import arweave from 'services/arweave'
import nftInfoSchema from './nftInfoSchema'

export default async (nfts, setNfts) => {
  nfts = [...nfts]
  return await Promise.all(nfts.map(async (nft, index) => {
    // validate
    const info = nftInfoSchema.validate(nft.info)
    if (info.error) throw new Error(info.error.message)

    await mockUploadNft()
    setNfts(prev => {prev[index].uploaded = true; return [...prev]})

    return uuid() // mock transactionId
  }))
}

const mockUploadNft = () => {
  const time = (2 + Math.floor(Math.random() * 5)) * 1000

  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
