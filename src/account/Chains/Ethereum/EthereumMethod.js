/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import {PATH, ALL_NFT_LOADED } from 'koiConstants'
import { getChromeStorage } from 'utils'
import { get, isNumber, isArray } from 'lodash'
import moment from 'moment'

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
      const ethContent = get(ethContents, 'assets')
      console.log({ ethContent })

      const contentList = (await getChromeStorage(`${this.eth.address}_assets`))[`${this.eth.address}_assets`] || []

      if (ethContent.length === contentList.length) return ALL_NFT_LOADED

      return Promise.all(ethContent.map(async content => {
        try {
          console.log({ content })
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
              description: content.description
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
              description: content.description
            }
          }
        } catch (err) {
          return {
            isRegistered: false,
            isKoiWallet: false
          }
        }
      }))
    } catch(err) {
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
}
