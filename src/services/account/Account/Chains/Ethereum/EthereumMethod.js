/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import { PATH, ALL_NFT_LOADED, ACTIVITY_NAME } from 'constants/koiConstants'
import { ACCOUNT } from 'constants/accountConstants'
import { getChromeStorage } from 'utils'
import { get, includes } from 'lodash'
import moment from 'moment'

import { TYPE } from 'constants/accountConstants'
import { VALID_TOKEN_SCHEMA, ERROR_MESSAGE, URL, BRIDGE_FLOW } from 'constants/koiConstants'

import axios from 'axios'

import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'
import koiRouterABI from './abi/KoiRouter.json'
import koiTokenABI from './abi/KoiToken.json'
import { AccountStorageUtils } from 'services/account/AccountStorageUtils'

const KOI_ROUTER_CONTRACT = '0x8ce759A419aC0fE872e93C698F6e352246FDb50B'

export class EthereumMethod {
  #chrome
  constructor(eth) {
    this.eth = eth
    this.#chrome = new AccountStorageUtils(eth.address)
  }

  async getBalances() {
    const balance = Web3.utils.fromWei(await this.eth.getBalance())
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
      console.log('Fetched contents: ', ethAssets.length)

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

      console.log('New contents: ', newContents.length)

      if (!newContents.length && ethAssets.length === contentList.length){
        console.log('ALL NFT LOADED')
        return ALL_NFT_LOADED
      }

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

  async nftBridge({ txId, toAddress, type = TYPE.ARWEAVE, tokenAddress, tokenSchema, accountName }) {
    let bridgePending
    let pendingTransactions = await this.#chrome.getField(ACCOUNT.PENDING_TRANSACTION)
    let assets = await this.#chrome.getAssets()
    let success

    const provider = this.eth.getCurrentNetWork()
    if (includes(provider, 'mainnet')) return false

    switch (type) {
      case TYPE.ARWEAVE:
        success = await this.#bridgeEthtoAr({ txId, toAddress, tokenAddress, tokenSchema })
        /* 
          Create pending bridge
        */
        if (success) {
          bridgePending = {
            id: txId,
            activityName: ACTIVITY_NAME.BRIDGE_ETH_TO_AR,
            expense: 0,
            accountName,
            date: moment().format('MMMM DD YYYY'),
            source: toAddress,
            address: this.eth.address,
            tokenAddress,
            tokenSchema,
            retried: 1
          }
          pendingTransactions.unshift(bridgePending)
          /*
           Set isBridging:true to asset
          */
          assets = assets.map((nft) => {
            if (nft.txId === txId) nft.isBridging = true
            return nft
          })
          await this.#chrome.setAssets(assets)
          await this.#chrome.setField(ACCOUNT.PENDING_TRANSACTION, pendingTransactions)
        } else {
          return false
        }

        return true
      default:
        return false
    }
  }

  async #bridgeEthtoAr({ txId: tokenId, toAddress, tokenAddress, tokenSchema }) {
    console.log('BRIDGING...')
    const { balance } = await this.getBalances()
    /* 
      Validations
    */

    if (!includes(VALID_TOKEN_SCHEMA, tokenSchema)) throw new Error(ERROR_MESSAGE.INVALID_TOKEN_SCHEMA)
    if (balance < 0.00015) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_ETH)

    const provider = new HDWalletProvider(this.eth.key, this.eth.getCurrentNetWork())
    const web3 = new Web3(provider)

    const userAddress = this.eth.address

    const koiRouterContract = new web3.eth.Contract(koiRouterABI, KOI_ROUTER_CONTRACT)
    const tokenContract = new web3.eth.Contract(koiTokenABI, tokenAddress)

    const isApproved = await tokenContract.methods
      .isApprovedForAll(userAddress, KOI_ROUTER_CONTRACT)
      .call()

    if (!isApproved) {
      const res = await tokenContract.methods
        .setApprovalForAll(KOI_ROUTER_CONTRACT, true)
        .send({ from: userAddress })
      console.log('Receipt set approval for all', res)
    }

    try {
      const depositResult = await koiRouterContract.methods
        .deposit(tokenAddress, tokenId, 1, toAddress)
        .send({ from: userAddress, value: web3.utils.toWei('0.00015', 'ether'), gasPrice: 1000000000, gasLimit: 100000 })
      console.log('====== Deposit receipt ', depositResult)
      return true
    } catch (error) {
      console.log('======= Deposit error', error)
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
              address: this.eth.address,
              tokenAddress: content?.asset_contract?.address,
              tokenSchema: content?.asset_contract?.schema_name // ERC compatiblility. eg: ERC1155,...
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

  async getBridgeStatus(txId) {
    const payload = {
      ethereumNFTId: txId,
      flow: BRIDGE_FLOW.ETH_TO_AR
    }

    let response = await fetch(URL.GET_BRIDGE_STATUS, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    response = await response.json()
    console.log('Bridge status', response)

    let isBridged = get(response, 'data[0].isBridged')
    console.log('isBridged', isBridged)
    return { confirmed: isBridged, dropped: false }
  }

  async resendTransaction(txId) {
    let pendingTransactions = await this.#chrome.getField(ACCOUNT.PENDING_TRANSACTION)
    // find the appropriate transaction
    let transaction = find(pendingTransactions, (tx) => tx.id === txId)
    let newTxId
    if (transaction) {
      const { activityName } = transaction
      if (includes(activityName, 'Bridged')) {
        await this.#bridgeEthtoAr({ 
          txId, 
          toAddress: transaction.source, 
          tokenAddress: transaction.tokenAddress,  
          tokenSchema: transaction.tokenSchema
        })
        newTxId = txId
      }

      /* 
        Set newTxId for the pending transaction
      */
      if (newTxId) {
        pendingTransactions = pendingTransactions.map(transaction => {
          if (transaction.id === txId) {
            transaction.id = newTxId
            if (transaction.retried !== undefined) transaction.retried = 0
            transaction.retried++
          }
          return transaction
        })

        await this.#chrome.setField(ACCOUNT.PENDING_TRANSACTION, pendingTransactions)
      } else {
        // TODO: refactor
        pendingTransactions = pendingTransactions.map(transaction => {
          if (transaction.id === txId) {
            if (transaction.retried !== undefined) transaction.retried = 0
            transaction.retried++
          }
          return transaction
        })

        await this.#chrome.setField(ACCOUNT.PENDING_TRANSACTION, pendingTransactions)
      }

      return transaction
    }
  }
}
