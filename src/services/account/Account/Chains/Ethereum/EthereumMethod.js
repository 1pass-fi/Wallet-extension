/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import {PATH, ALL_NFT_LOADED } from 'constants/koiConstants'
import { getChromeStorage } from 'utils'
import { get, isNumber, isArray } from 'lodash'
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
      const { data: ethContents } = await axios.get('https://rinkeby-api.opensea.io/api/v1/assets?owner=0xb6F8a936dd47F924999C1fd25f22EE18e4A74d2C&order_direction=desc&offset=0&limit=50')
      console.log({ ethContents })

      // const ethContent = get(ethContents, 'assets').filter(asset => get(asset, 'owner.address').toUpperCase() === this.eth.address.toUpperCase()).map(asset => asset)
      const ethAssets = get(ethContents, 'assets')
      console.log({ ethAssets })

      const contentList = (await getChromeStorage(`${this.eth.address}_assets`))[`${this.eth.address}_assets`] || []
      console.log({ contentList })

      // detect new nft(s) that were not saved in Chrome storage
      const storageContentIds = contentList.map(nft => nft.txId)

      const newContents = ethAssets.filter((ethAsset) => {
        return storageContentIds.indexOf(ethAsset.token_id) === -1
      })

      if (!newContents.length) return ALL_NFT_LOADED

      console.log('Storage new contents...', newContents)

      const newContentList = await Promise.all(newContents.map(async content => {
        try {
          console.log({ content })
          if (content.image_url) {
            const imageUrl = content.image_url
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
              createdAt: Date.parse(get(content, 'collection.created_date'))/1000,
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
              createdAt: Date.parse(get(content, 'collection.created_date'))/1000,
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

      const res = {
        contents: [...contentList, ...newContentList],
        newContents
      }
      return res
    } catch(err) {
      throw new Error(err.message)
    }
  }

  async storageAssets(contents) {
    try {
      console.log('STORAGE ASSETS - ETH', contents)
      return await Promise.all(contents.map(async content => {
        try {
          console.log('storage content: ', { content })
          if (content.image_url) {
            let u8 = Buffer.from((await axios.get(content.image_url, { responseType: 'arraybuffer'})).data, 'binary').toString('base64')
            let imageUrl = `data:${content.contentType};base64,${u8}`
            if (content.animation_url) {
              u8 = Buffer.from((await axios.get(content.animation_url, { responseType: 'arraybuffer'})).data, 'binary').toString('base64')
              imageUrl = `data:video/mp4;base64,${u8}`
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
              createdAt: Date.parse(get(content, 'collection.created_date'))/1000,
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
              createdAt: Date.parse(get(content, 'collection.created_date'))/1000,
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
      throw new Error(err.message)
    }
  }

  async loadMyActivities (cursor) {
    return {activitiesList: [
      {id: '1', activityName: 'Sent ETH', expense: 0.32, accountName: 'Account 1', date: 'July 20 2021', source:'0x1234567890'}
    ]}
  }

  async transfer() {
    try {
      console.log('ETH send transfer result', await this.eth.sendTransfer())
    } catch (err) {
      console.log('SEND TRANSACTION ERRROR', err.message)
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
}
