/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import {PATH, ALL_NFT_LOADED } from 'koiConstants'
import { getChromeStorage } from 'utils'
import { get } from 'lodash'

import axios from 'axios'

import storage from 'storage'

export class ArweaveMethod {
  constructor(koi) {
    this.koi = koi
  }

  async getBalances() {
    const arBalance = await this.koi.getWalletBalance()
    const koiBalance = await this.koi.getKoiBalance()
    return { arBalance, koiBalance }
  }

  async loadMyContent() {
    try {
      const { data: allContent } = await axios.get(PATH.ALL_CONTENT)
      console.log({ allContent })
      const myContent = (allContent.filter(content => get(content[Object.keys(content)[0]], 'owner') === this.koi.address)).map(content => Object.keys(content)[0])
      console.log({ myContent })
      // const contentList = await storage.arweaveWallet.get.assets() || []
      const contentList = (await getChromeStorage(`${this.koi.address}_assets`))[`${this.koi.address}_assets`] || []
      if (myContent.length === contentList.length) return ALL_NFT_LOADED
      return Promise.all(myContent.map(async contentId => {
        try {
          console.log(`${PATH.SINGLE_CONTENT}${contentId}`)
          const { data: content } = await axios.get(`${PATH.SINGLE_CONTENT}${contentId}`)
          console.log({ content })
          if (content.title) {
            let url = `${PATH.NFT_IMAGE}/${content.txIdContent}`
            if (content.fileLocation) url = content.fileLocation
            const u8 = Buffer.from((await axios.get(url, { responseType: 'arraybuffer'})).data, 'binary').toString('base64')
            let imageUrl = `data:image/jpeg;base64,${u8}`
            if (content.contentType.includes('video')) imageUrl = `data:video/mp4;base64,${u8}`
            return {
              name: content.title,
              isKoiWallet: content.ticker === 'KOINFT',
              earnedKoi: content.totalReward,
              txId: content.txIdContent,
              imageUrl,
              galleryUrl: `${PATH.GALLERY}#/details/${content.txIdContent}`,
              koiRockUrl: `${PATH.KOI_ROCK}/${content.txIdContent}`,
              isRegistered: true,
              contentType: content.contentType,
              totalViews: content.totalViews,
              createdAt: content.createdAt,
              description: content.description
            }
          } else {  
            console.log('Failed load content: ', content)
            return {
              name: '...',
              isKoiWallet: true,
              earnedKoi: content.totalReward,
              txId: content.txIdContent,
              imageUrl: 'https://koi.rocks/static/media/item-temp.49349b1b.jpg',
              galleryUrl: `${PATH.GALLERY}#/details/${content.txIdContent}`,
              koiRockUrl: `${PATH.KOI_ROCK}/${content.txIdContent}`,
              isRegistered: true,
              contentType: content.contentType || 'image',
              totalViews: content.totalViews,
              createdAt: content.createdAt,
              description: content.description
            }
          }
        } catch (err) {
          console.log(err.message)
          return {
            isRegistered: false,
            isKoiWallet: false
          }
        }
  
      }))
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
