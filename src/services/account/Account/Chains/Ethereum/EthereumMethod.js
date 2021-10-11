/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import { PATH, ALL_NFT_LOADED } from 'constants/koiConstants'
import { getChromeStorage } from 'utils'
import { get } from 'lodash'
import moment from 'moment'

import { TYPE } from 'constants/accountConstants'

import axios from 'axios'

import web3 from 'web3'

export class EthereumMethod {
  constructor(eth) {
    this.eth = eth
  }

  async getBalances() {
    const balance = web3.utils.fromWei(await this.eth.getBalance())
    const koiBalance = 100
    return { balance, koiBalance }
  }

  async loadMyContent() {
    try {
      console.log('ETH ADDRESS', this.eth.address)
      console.log('ETH PROVIDER', this.eth.provider)
      let path = PATH.OPENSEA_API_MAINNET
      if ((this.eth.provider).includes('rinkeby')) path = PATH.OPENSEA_API_RINEKY

      /* 
        get nft list for this ETH address
      */
      const { data: ethContents } = await axios.get(`${path}/assets?owner=${this.eth.address}&order_direction=desc&offset=0&limit=50`)
      const ethAssets = get(ethContents, 'assets')

      /* 
        get nft list for this ETH address from Chrome storage
      */
      const contentList = (await getChromeStorage(`${this.eth.address}_assets`))[`${this.eth.address}_assets`] || []
      console.log('Saved contents: ', contentList.length)

      /*
        There're two cases that NFTs will be filtered:
        - Failed load content (removed on functions cacheNFTs on "background/popupEventHandlers")
        - Out-of-date NFTs
      */
      const ethAssetIds = ethAssets.map(ethAsset => ethAsset.token_id)
      const validContents = contentList.filter((content) => {
        return ethAssetIds.indexOf(content.txId) !== -1
      })
      console.log('Up to date saved content: ', validContents.length)

      /* 
        detect new nft(s) that were not saved in Chrome storage
      */
      const storageContentIds = validContents.map(nft => nft.txId)

      const newContents = ethAssets.filter((ethAsset) => {
        return storageContentIds.indexOf(ethAsset.token_id) === -1
      })

      if (!newContents.length) return ALL_NFT_LOADED

      console.log('New contents: ', newContents.length)

      const newContentList = await this.getNftData(newContents, false)

      const res = {
        contents: [...validContents, ...newContentList],
        newContents
      }
      return res
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async loadMyActivities() {
    return { activitiesList: [] }
  }

  async transfer(_, recipient, qty) {
    try {
      return await this.eth.transferEth(recipient, qty)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async loadCollections() {
    return []
  }

  async nftBridge(txId, toAddress, type) {
    console.log('ETH - NFT Bridge', type)
    switch (type) {
      case TYPE.ARWEAVE:
        return true
      default:
        return false
    }
  }

  async transactionConfirmedStatus(txHash) {
    const response = await this.eth.getTransactionStatus(txHash)
    return { dropped: false, confirmed: get(response, 'status') }
  }

  async getNftData(contents, getBase64) {
    try {
      return await Promise.all(contents.map(async content => {
        try {
          if (content.image_url) {
            let imageUrl = content.image_url

            if (getBase64) {
              let u8 = Buffer.from((await axios.get(content.image_url, { responseType: 'arraybuffer' })).data, 'binary').toString('base64')
              imageUrl = `data:image/jpeg;base64,${u8}`
              if (content.image_url.endsWith('.svg')) {
                imageUrl = `data:image/svg+xml;base64,${u8}`
              }

              if (content.animation_url) {
                u8 = Buffer.from((await axios.get(content.animation_url, { responseType: 'arraybuffer' })).data, 'binary').toString('base64')
                imageUrl = `data:video/mp4;base64,${u8}`
              }
            }

            return {
              name: content.name,
              isKoiWallet: false,
              txId: content.token_id,
              imageUrl,
              galleryUrl: `${PATH.GALLERY}#/details/${content.token_id}`,
              koiRockUrl: `${PATH.KOI_ROCK}/${content.token_id}`,
              // TODO handle this field later
              isRegistered: false,
              contentType: content.animation_url ? 'video' : 'image',
              totalViews: 0,
              createdAt: Date.parse(get(content, 'collection.created_date')) / 1000,
              description: content.description,
              type: TYPE.ETHEREUM,
              address: this.eth.address
            }
          } else {
            console.log('Failed load content: ', content)
            return {
              name: '...',
              isKoiWallet: false,
              txId: content.token_id,
              imageUrl: 'https://koi.rocks/static/media/item-temp.49349b1b.jpg',
              galleryUrl: `${PATH.GALLERY}#/details/${content.token_id}`,
              koiRockUrl: `${PATH.KOI_ROCK}/${content.token_id}`,
              isRegistered: false,
              contentType: content.animation_url ? 'video' : 'image',
              totalViews: 0,
              createdAt: Date.parse(get(content, 'collection.created_date')) / 1000,
              description: content.description,
              type: TYPE.ETHEREUM,
              address: this.eth.address
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
      console.log(err.message)
      return []
    }
  }
}
