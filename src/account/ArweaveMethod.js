/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import {PATH, ALL_NFT_LOADED } from 'koiConstants'
import { getChromeStorage } from 'utils'
import { get, isNumber, isArray } from 'lodash'
import moment from 'moment'

import axios from 'axios'
import { AccountChromeStorage } from 'storage/ChromeStorage'
import { ERROR_MESSAGE } from 'koiConstants'

import { find } from 'lodash'
import storage from 'storage'

export class ArweaveMethod {
  #chrome
  constructor(koi) {
    this.koi = koi
    this.#chrome = new AccountChromeStorage(koi.address)
  }

  async getBalances() {
    const balance = await this.koi.getWalletBalance()
    const koiBalance = await this.koi.getKoiBalance()
    return { balance, koiBalance }
  }

  async loadMyContent() {
    try {
      const { data: allContent } = await axios.get(PATH.ALL_CONTENT)
      console.log({ allContent })
      const myContent = (allContent.filter(content => get(content[Object.keys(content)[0]], 'owner') === this.koi.address)).map(content => Object.keys(content)[0])
      console.log({ myContent })
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

  async loadMyActivities (cursor) {
    try {
      const { ownedCursor, recipientCursor } = cursor
  
      let ownedData
      let recipientData
      
      // fetch data base on inputed cursors
      if (ownedCursor) {
        ownedData = get(await this.koi.getOwnedTxs(this.koi.address, 10, ownedCursor), 'data.transactions.edges') || []
      } else {
        ownedData = get(await this.koi.getOwnedTxs(this.koi.address), 'data.transactions.edges') || []
      }
    
      if (recipientCursor) {
        recipientData = get(await this.koi.getRecipientTxs(this.koi.address, 10, recipientCursor), 'data.transactions.edges') || []
      } else {
        recipientData = get(await this.koi.getRecipientTxs(this.koi.address), 'data.transactions.edges') || []
      }
    
      let activitiesList = [...ownedData, ...recipientData]
      console.log('ACTIVITIES LIST BACKGROUND: ', activitiesList)
      // get next cursors
      const nextOwnedCursor = ownedData.length > 0 ? get(ownedData[ownedData.length - 1], 'cursor') : ownedCursor
      const nextRecipientCursor = recipientData.length > 0 ? get(recipientData[recipientData.length - 1], 'cursor') : recipientCursor
  
      if (activitiesList.length > 0) {
  
        // filter activities has node.block (success fetched activities) field then loop through to get necessary fields
        activitiesList = activitiesList.filter(activity => !!get(activity, 'node.block')).map(activity => {
          const time = get(activity, 'node.block.timestamp')
          const timeString = isNumber(time) ? moment(time*1000).format('MMMM DD YYYY') : ''
          const id = get(activity, 'node.id')
          let activityName = 'Sent AR'
          let expense = Number(get(activity, 'node.quantity.ar')) + Number(get(activity, 'node.fee.ar'))
  
          // get input tag
          let inputTag = (get(activity, 'node.tags'))
          if (!isArray(inputTag)) inputTag = []
          inputTag = inputTag.filter(tag => tag.name === 'Input')
  
          // get Init State tag
          const initStateTag = (get(activity, 'node.tags')).filter(tag => tag.name === 'Init-State')
  
          // get action tag
          const actionTag = ((get(activity, 'node.tags')).filter(tag => tag.name === 'Action'))
          let source = get(activity, 'node.recipient')
          let inputFunction
          if (inputTag[0]) {
            inputFunction = JSON.parse(inputTag[0].value)
            if (inputFunction.function === 'transfer' || inputFunction.function === 'mint') {
              activityName = 'Sent KOII'
              expense = inputFunction.qty
              source = inputFunction.target
            } else if (inputFunction.function === 'updateCollection') {
              activityName = 'Updated Collection'
            } else if (inputFunction.function === 'updateKID') {
              activityName = 'Updated KID'
            }
  
            if (inputFunction.function === 'registerData') {
              activityName = 'Registered NFT'
              source = null
            }
          }
  
          if (initStateTag[0]) {
            if (actionTag[0].value.includes('KID/Create')) {
              const initState = JSON.parse(initStateTag[0].value)
              activityName = `Created KID "${initState.name}"`
            } else if (actionTag[0].value.includes('Collection/Create')) {
              const initState = JSON.parse(initStateTag[0].value)
              activityName = `Created Collection "${initState.name}"`
            } else {
              const initState = JSON.parse(initStateTag[0].value)
              activityName = `Minted NFT "${initState.title}"`
            }
          }
  
          if (get(activity, 'node.owner.address') !== this.koi.address) {
            activityName = 'Received AR'
            source = get(activity, 'node.owner.address')
            expense -= Number(get(activity, 'node.fee.ar'))
            if (inputTag[0]) {
              inputFunction = JSON.parse(inputTag[0].value)
              if (inputFunction.function === 'transfer' || inputFunction.function === 'mint') {
                activityName = 'Received KOI'
                expense = inputFunction.qty
                source = inputFunction.target
              }
            }
          }
  
          return {
            id,
            activityName,
            expense,
            accountName: 'Account 1',
            date: timeString,
            source
          }
        })
      }
      return { activitiesList, nextOwnedCursor, nextRecipientCursor }
    } catch(err) {
      throw new Error(err.message)
    }
  }

  async transfer(token, target, qty) {
    try {
      let balance
      switch (token) {
        case 'KOI':
          balance = await this.koi.getKoiBalance()
          if (qty > balance) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_KOI)
          break
        case 'AR':
          balance = await this.koi.getWalletBalance()
          if (qty > balance) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_AR)
          break
      }
      const txId = await this.koi.transfer(qty, target, token)
      return txId
 
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async loadCollections() {
    try {
      const savedCollection = await this.#chrome.getCollections() || []
      // get list of transactions
      let fetchedCollections = await this.koi.getCollectionsByWalletAddress(this.koi.address)
  
      if (savedCollection.length == fetchedCollections.length) return 'fetched'
  
      // get list of transaction ids
      fetchedCollections = fetchedCollections.map(collection => get(collection, 'node.id'))
      console.log(fetchedCollections)
      fetchedCollections = await this.#readState(fetchedCollections)
      
      // read state from the transaction id to get needed data for the collection
      fetchedCollections = await Promise.all(fetchedCollections.map(collection => this.#getNftsDataForCollections(collection)))
  
      // filter collection has NFTs that cannot be found on the storage.
      fetchedCollections = fetchedCollections.filter(collection => {
        return collection.nfts.every(nft => nft)
      })
      console.log('fetchedCollections', fetchedCollections)
  
      await storage.arweaveWallet.set.collections(fetchedCollections)
      return fetchedCollections
    } catch (err) {
      console.log(err.message)
    }
  }

  async createCollection(collectionInfo, nftIds) {
    try {
      const collectionId = await this.koi.createCollection(collectionInfo)
      console.log('Collection ID: ', collectionId)
      return await this.#updateCollection(nftIds, collectionId)
    } catch (err) {
      console.log(err.message)
    }
  }

  async loadKID() {
    try {
      const data = await this.koi.getKIDByWalletAddress(this.koi.address)
      const txId = get(data[0], 'node.id')
      if (txId) {
        const imageUrl = `https://arweave.net/${txId}`
        const state = await this.koi.readState(txId)
        return { imageUrl, ...state }
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  async createOrUpdateKID(kidInfo, payload) {
    try {
      // Check had kid
      const hadKID = await this.#hadKIDCheck()
      if (hadKID) {
        // UPDATE KID
        return await this.koi.updateKID(kidInfo, hadKID)
      } else {
        // Create new kid 
        const { fileType } = payload
        const { u8 } = await this.#getImageDataForNFT(fileType)
        const image = { blobData: u8, contentType: fileType }
      
        const txId = await this.koi.createKID(kidInfo, image)
        return txId
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  async #updateCollection(nftIds, collectionId) {
    return await this.koi.updateCollection(nftIds, collectionId)
  }

  async #readState(txIds) {
    const result = await Promise.all(txIds.map(async id => {
      try {
        let state = await this.koi.readState(id)
        const viewsAndReward = await this.koi.getViewsAndEarnedKOII(state.collection)
        state = {...state, id, ...viewsAndReward}
        console.log('state', state)
        return state
      } catch (err) {
        return null
      }
    }))
    return result.filter(collection => collection)
  }

  async #getNftsDataForCollections (collection) {
    const storageNfts = await this.#chrome.getAssets() || []

    const { collection: nftIds } = collection
    const nfts = nftIds.map(id => {
      const nft = find(storageNfts, v => v.txId == id)
      if (nft) return nft
    })
  
    const resultCollection = { ...collection, nfts }
    return resultCollection
  }

  async #hadKIDCheck() {
    const data = await this.koi.getKIDByWalletAddress(this.koi.address)
    if (get(data[0], 'node.id')) {
      return get(data[0], 'node.id')
    }
    return false
  }

  async #getImageDataForNFT(fileType) {
    try {
      let bitObject = await storage.generic.get.nftBitData()
      if (!bitObject) return
      // parse the JSON string on local storage
      bitObject = JSON.parse(bitObject)
      console.log('bitObject', bitObject)
      // create 8 bit array from bit object
      const u8 = Uint8Array.from(Object.values(bitObject))
      console.log('u8', u8)
      // create blob from u8
      const blob = new Blob([u8], { type: 'contentType'})
      console.log('blob', blob)
      // create file from blob
      const file = new File([blob], 'filename', { type: fileType })
      console.log(file)
      return { u8, file }
    } catch (err) {
      throw new Error('')
    }
  }
}
