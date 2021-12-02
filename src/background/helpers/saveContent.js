import { isArray, differenceBy } from 'lodash'

// services
import { BackgroundAccount } from 'services/account/Account'

/**
 * 
 * @param {Array} contents Up to date NFTs
 * @param {Account} account NFTs owner
 */
const cacheNFTs = async (contents, account) => {
  try {
    if (!(account instanceof BackgroundAccount)) throw new Error('Invalid input account')

    if (isArray(contents)) {
      const contentList = contents.filter(content => !!content.name) // remove failed loaded nfts
      console.log('Cache NFTs: ', contentList.length)
      await account.set.assets(contentList)

      // filter pending assets
      let pendingAssets = await account.get.pendingAssets() || []
      pendingAssets = pendingAssets.filter(asset => {
        return contents.every(content => content.txId !== asset.txId)
      })
      await account.set.pendingAssets(pendingAssets)
    }
  } catch (error) {
    console.error(error)
  }
}

/*
  Load new NFT contents
    Step 1: get all NFTs of account in current Chrome storage
    Step 2: detect no-need-update NFTs from above list.
    Step 3: append up-to-date NFTs and new NFTs
*/
const saveNewNFTsToStorage = async (newContents, account) => {

  try {
    if (isArray(newContents)) {
      if (!(account instanceof BackgroundAccount)) throw new Error('Invalid input account')

      let newNFTContents = await account.method.getNftData(newContents, true)
      newNFTContents = newNFTContents.filter(content => !!content.name) // remove failed loaded nfts
      let allNFTs = await account.get.assets()

      const oldNFTs = differenceBy(allNFTs, newNFTContents, 'txId')

      console.log('Stored NFTs: ', newNFTContents.length)
      allNFTs = [...oldNFTs, ...newNFTContents]
      account.set.assets(allNFTs)
    }
  } catch (error) {
    console.error(error)
  }
}

export default {
  cacheNFTs,
  saveNewNFTsToStorage
}
