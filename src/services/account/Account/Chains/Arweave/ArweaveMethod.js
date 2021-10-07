/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import { PATH, ALL_NFT_LOADED, ERROR_MESSAGE } from 'constants/koiConstants'
import { getChromeStorage, setChromeStorage } from 'utils'
import { get, isNumber, isArray, orderBy, includes } from 'lodash'
import moment from 'moment'
import { smartweave } from 'smartweave'
import axios from 'axios'

import { AccountStorageUtils } from 'services/account/AccountStorageUtils'
import { TYPE } from 'constants/accountConstants'

import { find, isEmpty } from 'lodash'
import storage from 'services/storage'
import arweave from 'services/arweave'

import _signPort from 'utils/signPort'

export class ArweaveMethod {
  #chrome
  constructor(koi) {
    this.koi = koi
    this.#chrome = new AccountStorageUtils(koi.address)
  }

  async getBalances() {
    const balance = await this.koi.getWalletBalance()
    const koiBalance = await this.koi.getKoiBalance()
    return { balance, koiBalance }
  }

  /**
   * 
   * @returns res.contents NFTs array of an specified address at the moment this function invoked
   * @returns res.newContent NFT IDs array that will be used for "saveNewNFTsToStorage"
   */
  async loadMyContent() {
    try {
      const attentionState = await this.koi.getState('attention')
      const { nfts: allContent } = attentionState

      /* 
        get nft id list for this koi address
      */
      let myContent = await this.koi.getNftIdsByOwner(this.koi.address)
      myContent = myContent.filter(id => {
        const nftOwners = allContent[id]
        const balances = Object.values(nftOwners)
        const isOwner = nftOwners[this.koi.address] === Math.max(...balances)

        return isOwner
      })

      /* 
        get nft list for this koi address from Chrome storage
      */
      const contentList = (await getChromeStorage(`${this.koi.address}_assets`))[`${this.koi.address}_assets`] || []
      console.log('Saved contents: ', contentList.length)

      /*
        There're two cases that NFTs will be filtered:
        - Failed load content (removed on functions cacheNFTs on "background/popupEventHandlers")
        - Sent NFTs (this address no longer own these NFTs)
      */
      const validContents = contentList.filter((content) => {
        return myContent.indexOf(content.txId) !== -1
      })
      console.log('Up to date saved content: ', validContents.length)

      /* 
        detect new nft(s) that were not saved in Chrome storage
      */
      const storageContentIds = validContents.map(nft => nft.txId)
      const newContents = myContent.filter((nftId) => {
        return storageContentIds.indexOf(nftId) === -1
      })

      if (!newContents.length) return ALL_NFT_LOADED

      console.log('New contents: ', newContents.length)

      const newContentList = await this.getNftData(newContents)

      const res = {
        contents: [...validContents, ...newContentList],
        newContents
      }

      return res
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async loadMyActivities(cursor) {
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
      // sort by time
      activitiesList = orderBy(activitiesList, 'node.block.timestamp', 'desc')
      console.log('ACTIVITIES LIST BACKGROUND: ', activitiesList)
      // get next cursors
      const nextOwnedCursor = ownedData.length > 0 ? get(ownedData[ownedData.length - 1], 'cursor') : ownedCursor
      const nextRecipientCursor = recipientData.length > 0 ? get(recipientData[recipientData.length - 1], 'cursor') : recipientCursor

      if (activitiesList.length > 0) {

        // filter activities has node.block (success fetched activities) field then loop through to get necessary fields
        activitiesList = activitiesList.filter(activity => !!get(activity, 'node.block')).map(activity => {
          const time = get(activity, 'node.block.timestamp')
          const timeString = isNumber(time) ? moment(time * 1000).format('MMMM DD YYYY') : ''
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

            if (inputFunction.function === 'registerData' ||
                inputFunction.function === 'burnKoi' ||
                inputFunction.function === 'migratePreRegister') {
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
            source,
            time
          }
        })
      }
      return { activitiesList, nextOwnedCursor, nextRecipientCursor }
    } catch (err) {
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
        const state = await smartweave.readContract(arweave ,txId)
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

  /* 
    AFFILIATE CODE
  */
  async getAffiliateCode() {
    try {
      const signedPayload = await this.koi.signPayload({ data: { address: this.koi.address } })
      const { data } = await axios({
        method: 'POST',
        url: PATH.AFFILIATE_REGISTER,
        data: {
          address: this.koi.address,
          signature: signedPayload.signature,
          publicKey: signedPayload.owner
        }
      })

      return get(data, 'data.affiliateCode')
    } catch (err) {
      console.log(err.message)
      throw new Error('Cannot get affiliateCode')
    }
  }

  async claimReward() {
    try {
      const signedPayload = await this.koi.signPayload({ data: { address: this.koi.address } })
      const { data } = await axios({
        method: 'POST',
        url: PATH.AFFILIATE_CLAIM_REWARD,
        data: {
          address: this.koi.address,
          signature: signedPayload.signature,
          publicKey: signedPayload.owner
        }
      })
      return data
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getRegistrationReward(nftId) {
    console.log('NFT ID: ', nftId)
    try {
      const signedPayload = await this.koi.signPayload({ data: { address: this.koi.address } })
      const { data } = await axios({
        method: 'POST',
        url: PATH.AFFILIATE_REGISTRATION_REWARD,
        data: {
          address: this.koi.address,
          signature: signedPayload.signature,
          publicKey: signedPayload.owner,
          nftId
        }
      })

      return data
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async submitInviteCode(code) {
    try {
      const signedPayload = await this.koi.signPayload({ data: { address: this.koi.address, code } })
      const { data } = await axios({
        method: 'POST',
        url: PATH.AFFILIATE_SUBMIT_CODE,
        data: {
          address: this.koi.address,
          code,
          signature: signedPayload.signature,
          publicKey: signedPayload.owner
        }
      })

      return data
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getTotalRewardKoi() {
    try {
      const { data } = await axios({
        method: 'POST',
        url: PATH.AFFILIATE_TOTAL_REWARD,
        data: {
          address: [this.koi.address]
        }
      })
      if (status !== 200) {
        return 0
      }

      return get(data, 'data.totalReward')
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async checkAffiliateInviteSpent() {
    try {
      const signedPayload = await this.koi.signPayload({ data: { address: this.koi.address, code: 'code' } })
      const { data } = await axios({
        method: 'POST',
        url: PATH.AFFILIATE_SUBMIT_CODE,
        data: {
          address: this.koi.address,
          code: 'code',
          signature: signedPayload.signature,
          publicKey: signedPayload.owner
        }
      })

      if (((data.message).toLowerCase()).includes('already exists')) {
        return true
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /* 
    PRIVATE FUNCTIONS
  */
  async #updateCollection(nftIds, collectionId) {
    return await this.koi.updateCollection(nftIds, collectionId)
  }

  async #readState(txIds) {
    const result = await Promise.all(txIds.map(async id => {
      try {
        let state = await smartweave.readContract(arweave, id)
        const viewsAndReward = await this.koi.getViewsAndEarnedKOII(state.collection)
        state = { ...state, id, ...viewsAndReward }
        console.log('state', state)
        return state
      } catch (err) {
        return null
      }
    }))
    return result.filter(collection => collection)
  }

  async #getNftsDataForCollections(collection) {
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
      const blob = new Blob([u8], { type: 'contentType' })
      console.log('blob', blob)
      // create file from blob
      const file = new File([blob], 'filename', { type: fileType })
      console.log(file)
      return { u8, file }
    } catch (err) {
      throw new Error('')
    }
  }

  async nftBridge(txId, toAddress, type) {
    console.log('AR - NFT Bridge', type)
    switch (type) {
      case TYPE.ETHEREUM:
        return true
      default:
        return false
    }
  }

  async signTransaction(transaction) {
    try {
      let tx
      console.log({ transaction })
      if (transaction.data) {
        console.log('TRANSACTION WITH DATA')
        transaction.data = JSON.parse(transaction.data)
        const data = Uint8Array.from(Object.values(transaction.data))
        tx = await arweave.createTransaction({ data })
        tx.data_root = transaction.data_root
        const { tags } = transaction
        tags.forEach((tag) => {
          console.log('TAG', atob(tag.name), atob(tag.value))
          tx.addTag(atob(tag.name), atob(tag.value))
        })
      } else {
        console.log('TRANSFER TRANSACTION')
        tx = await arweave.createTransaction({ target: transaction.target, quantity: transaction.quantity })
      }
      console.log({ tx })
      console.log(await arweave.transactions.getPrice(tx.data_size))
      const result = await this.koi.signTransaction(tx)
      result.data = []
      return result
    } catch (err) {
      console.log(err.message)
    }
  }

  async registerData(txId) {
    const _txId = await this.koi.burnKoiAttention(txId)
    console.log('BURN KOII')
    await this.koi.migrateAttention()
    console.log('MIGRATE')
    return _txId
  }

  async signPort(txId) {
    return await _signPort(txId, this.koi)
  }

  async transferNFT(nftId, address) {
    const txId = await this.koi.transferNft(nftId, 1, address)
    return txId
  }

  async transactionConfirmedStatus(id) {
    const response = await arweave.transactions.getStatus(id)
    return !isEmpty(get(response, 'confirmed'))
  }

  async getNftData(nftIds, getBase64) {
    try {
      return await Promise.all(nftIds.map(async contentId => {
        try {
          const content = await this.koi.getNftState(contentId)
          if (content.title) {
            if (!get(content, 'contentType')) {
              const response = await fetch(`${PATH.NFT_IMAGE}/${content.id}`)
              const blob = await response.blob()
              const type = get(blob, 'type') || 'image/png'
              content.contentType = type
            }
            let url = `${PATH.NFT_IMAGE}/${content.id}`
            let imageUrl = url
            if (getBase64) {
              if (!includes(content.contentType, 'html')) {
                const u8 = Buffer.from((await axios.get(url, { responseType: 'arraybuffer' })).data, 'binary').toString('base64')
                imageUrl = `data:${content.contentType};base64,${u8}`
                if (content.contentType.includes('video')) imageUrl = `data:video/mp4;base64,${u8}`
              }
            }

            return {
              name: content.title,
              isKoiWallet: content.ticker === 'KOINFT',
              earnedKoi: content.reward,
              txId: content.id,
              imageUrl,
              galleryUrl: `${PATH.GALLERY}#/details/${content.id}`,
              koiRockUrl: `${PATH.KOII_LIVE}/${content.id}`,
              isRegistered: true,
              contentType: content.contentType,
              totalViews: content.attention,
              createdAt: content.createdAt,
              description: content.description,
              type: TYPE.ARWEAVE,
              address: this.koi.address
            }
          } else {
            console.log('Failed load content: ', content)
            return {
              name: '...',
              isKoiWallet: true,
              earnedKoi: content.reward,
              txId: content.id,
              imageUrl: 'https://koi.rocks/static/media/item-temp.49349b1b.jpg',
              galleryUrl: `${PATH.GALLERY}#/details/${content.id}`,
              koiRockUrl: `${PATH.KOII_LIVE}/${content.id}`,
              isRegistered: true,
              contentType: content.contentType || 'image',
              totalViews: content.attention,
              createdAt: content.createdAt,
              description: content.description,
              type: TYPE.ARWEAVE,
              address: this.koi.address
            }
          }
        } catch (err) {
          console.log(err.message)
          throw new Error(err.message)
        }
      }))
    } catch (err) {
      console.log(err.message)
      return []
    }
  }
}
