/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import {
  PATH,
  ALL_NFT_LOADED,
  ACTIVITY_NAME,
  ETHERSCAN_API,
  ETH_NFT_BRIDGE_ACTION
} from 'constants/koiConstants'
import { ACCOUNT } from 'constants/accountConstants'
import { getChromeStorage } from 'utils'
import { get, includes, findIndex } from 'lodash'
import moment from 'moment'

import { TYPE } from 'constants/accountConstants'
import {
  VALID_TOKEN_SCHEMA,
  ERROR_MESSAGE,
  URL,
  BRIDGE_FLOW,
  KOI_ROUTER_CONTRACT,
  ETH_NETWORK_PROVIDER
} from 'constants/koiConstants'

import axios from 'axios'

import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'
import koiRouterABI from './abi/KoiRouter.json'
import koiTokenABI from './abi/KoiToken.json'
import ERC20ABI from './abi/ERC20ABI.json'
import { AccountStorageUtils } from 'services/account/AccountStorageUtils'
import storage from 'services/storage'

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
      let path = PATH.OPENSEA_API_MAINNET
      const ethereumProvider = await storage.setting.get.ethereumProvider()
      console.log('ethereumProvider', ethereumProvider)

      if (ethereumProvider.includes('rinkeby')) path = PATH.OPENSEA_API_RINEKY

      console.log('ETH ADDRESS', this.eth.address)
      console.log('ETH PROVIDER', this.eth.provider)
      // if ((this.eth.provider).includes('rinkeby')) path = PATH.OPENSEA_API_RINEKY

      /* 
        get nft list for this ETH address
      */
      let ethAssets = []
      for (let i = 0; i < 3; i++) {
        let assets = []
        const url = `${path}/assets?owner=${this.eth.address}&order_direction=desc&offset=${
          i * 50
        }&limit=50`
        try {
          const { data } = await axios.get(url)
          assets = get(data, 'assets') || []
        } catch (err) {
          console.error('Fetched ETH nft error: ', err.message)
        }

        ethAssets = [...ethAssets, ...assets]
      }

      console.log('Fetched contents: ', ethAssets.length)

      /* 
        get nft list for this ETH address from Chrome storage
      */
      const contentList =
        (await getChromeStorage(`${this.eth.address}_assets`))[`${this.eth.address}_assets`] || []
      console.log('Saved contents: ', contentList.length)

      /*
        There're two cases that NFTs will be filtered:
        - Failed load content (removed on functions cacheNFTs on "background/popupEventHandlers")
        - Out-of-date NFTs
      */
      const ethAssetIds = ethAssets.map((ethAsset) => ethAsset.token_id)
      const validContents = contentList.filter((content) => {
        return ethAssetIds.indexOf(content.txId) !== -1
      })
      console.log('Up to date saved content: ', validContents.length)

      /* 
        detect new nft(s) that were not saved in Chrome storage
      */
      const storageContentIds = validContents.map((nft) => nft.txId)

      const newContents = ethAssets.filter((ethAsset) => {
        return storageContentIds.indexOf(ethAsset.token_id) === -1
      })

      console.log('New contents: ', newContents.length)

      if (!newContents.length && ethAssets.length === contentList.length) {
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

  async updateActivities() {
    let baseUrl, url, network

    network = this.eth.getCurrentNetWork()

    switch (network) {
      case ETH_NETWORK_PROVIDER.RINKEBY:
        baseUrl = ETHERSCAN_API.RINKEY
        break
      default:
        baseUrl = ETHERSCAN_API.MAINNET
    }

    const walletAddress = this.eth.address
    const offset = 1000
    const etherscanAPIKey = 'USBA7QPN747A6KGYFCSY42KZ1W9JGFI2YB'

    url = [
      `${baseUrl}/`,
      'api?module=account',
      '&action=txlist',
      `&address=${walletAddress}`,
      '&startblock=0&endblock=99999999',
      `&page=1&offset=${offset}`,
      '&sort=desc',
      `&apikey=${etherscanAPIKey}`
    ]

    url = url.join('')

    let resp = await axios.get(url)

    let fetchedData = resp.data.result
    const accountName = await this.#chrome.getField(ACCOUNT.ACCOUNT_NAME)
    fetchedData = fetchedData.map((activity) => {
      try {
        let id, activityName, expense, date, source, time

        id = activity.hash
        if (activity.from === this.eth.address.toLowerCase()) {
          activityName = 'Sent ETH'
          source = activity.to
        } else {
          activityName = 'Received ETH'
          source = activity.from
        }

        const gasFee = (activity.gasUsed * activity.gasPrice) / 1000000000000000000
        const expenseValue = activity.value / 1000000000000000000

        expense = gasFee + expenseValue
        date = moment(Number(activity.timeStamp) * 1000).format('MMMM DD YYYY')

        time = activity.timeStamp

        return {
          id,
          activityName,
          expense,
          accountName,
          date,
          source,
          time,
          network,
          address: this.eth.address
        }
      } catch (err) {
        console.error(err.message)
        return {}
      }
    })

    const oldActivites = (await this.#chrome.getActivities()) || []
    const newestOfOldActivites = oldActivites[0]

    if (newestOfOldActivites) {
      const idx = findIndex(fetchedData, (data) => data.id === newestOfOldActivites.id)

      for (let i = 0; i < idx; i++) {
        fetchedData[i].seen = false
      }
    }

    await this.#chrome.setActivities(fetchedData)
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

  async nftBridge({
    txId,
    toAddress,
    type = TYPE.ARWEAVE,
    tokenAddress,
    tokenSchema,
    accountName
  }) {
    let bridgePending
    let pendingTransactions = (await this.#chrome.getField(ACCOUNT.PENDING_TRANSACTION)) || []
    let assets = await this.#chrome.getAssets()
    let success, action, result

    try {
      switch (type) {
        case TYPE.ARWEAVE:
          result = await this.#bridgeEthtoAr({ txId, toAddress, tokenAddress, tokenSchema })
          success = get(result, 'success')
          action = get(result, 'action')

          /* 
            Create pending bridge
          */
          if (success) {
            if (action === ETH_NFT_BRIDGE_ACTION.DEPOSIT) {
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
            }
          } else {
            return false
          }

          return true
        default:
          return false
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async #bridgeEthtoAr({ txId: tokenId, toAddress, tokenAddress, tokenSchema }) {
    if (!this.eth.provider) throw new Error('Something went wrong.')
    let koiRouterContractAddress = null

    if (includes(this.eth.provider, 'mainnet')) {
      koiRouterContractAddress = KOI_ROUTER_CONTRACT.MAINNET
    }

    if (includes(this.eth.provider, 'rinkeby')) {
      koiRouterContractAddress = KOI_ROUTER_CONTRACT.RINKEBY
    }

    if (!koiRouterContractAddress) throw new Error('Something went wrong.')

    console.log('KOI ROUTER CONTRACT', koiRouterContractAddress)

    console.log('BRIDGING...')
    const { balance } = await this.getBalances()
    /* 
      Validations
    */
    if (!includes(VALID_TOKEN_SCHEMA, tokenSchema))
      throw new Error(ERROR_MESSAGE.INVALID_TOKEN_SCHEMA)
    if (balance < 0.00015) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_ETH)

    const provider = new HDWalletProvider(this.eth.key, this.eth.getCurrentNetWork())
    const web3 = new Web3(provider)

    const userAddress = this.eth.address

    const koiRouterContract = new web3.eth.Contract(koiRouterABI, koiRouterContractAddress)
    const tokenContract = new web3.eth.Contract(koiTokenABI, tokenAddress)

    /* 
      Check for approval
      If not approved, setApprovalForAll()
    */
    let isApproved = false
    try {
      isApproved = await tokenContract.methods
        .isApprovedForAll(userAddress, koiRouterContractAddress)
        .call()
      console.log('isApproved', isApproved)
    } catch (error) {
      console.log('====== get isApprovedForAll error', error)
    }

    if (!isApproved) {
      try {
        console.log('SET APPROVAL...')
        const res = await tokenContract.methods
          .setApprovalForAll(koiRouterContractAddress, true)
          .send({ from: userAddress })
        console.log('====== setApprovalForAll receipt', res)
        return { success: true, action: ETH_NFT_BRIDGE_ACTION.SET_APPROVAL }
      } catch (error) {
        console.log('======= setApprovalForAll error', error)
        return { success: false, action: ETH_NFT_BRIDGE_ACTION.SET_APPROVAL }
      }
    } else {
      try {
        const depositResult = await koiRouterContract.methods
          .deposit(tokenAddress, tokenId, 1, toAddress)
          .send({ from: userAddress, value: web3.utils.toWei('0.00015', 'ether') })
        console.log('====== Deposit receipt ', depositResult)
        return { success: true, action: ETH_NFT_BRIDGE_ACTION.DEPOSIT }
      } catch (error) {
        console.log('======= Deposit error', error)
        return { success: false, action: ETH_NFT_BRIDGE_ACTION.SET_APPROVAL }
      }
    }
  }

  async transactionConfirmedStatus(txHash) {
    const response = await this.eth.getTransactionStatus(txHash)
    return { dropped: false, confirmed: get(response, 'status') }
  }

  async getNftData(contents, getBase64) {
    try {
      const provider = this.eth.provider
      let etherscanUrl
      if (provider === ETH_NETWORK_PROVIDER.MAINNET) etherscanUrl = URL.ETHERSCAN_MAINNET
      if (provider === ETH_NETWORK_PROVIDER.RINKEBY) etherscanUrl = URL.ETHERSCAN_RINKEBY

      let fetchedNFTs = await Promise.all(
        contents.map(async (content) => {
          try {
            const tokenId = content?.token_id
            const addressContract = content?.asset_contract?.address
            const koiRockUrl = `${etherscanUrl}/token/${addressContract}?a=${tokenId}`

            if (content.image_url && content.name) {
              let imageUrl = content.image_url
              if (getBase64) {
                let u8 = Buffer.from(
                  (await axios.get(content.image_url, { responseType: 'arraybuffer' })).data,
                  'binary'
                ).toString('base64')
                imageUrl = `data:image/jpeg;base64,${u8}`
                if (content.image_url.endsWith('.svg')) {
                  imageUrl = `data:image/svg+xml;base64,${u8}`
                }

                if (content.animation_url) {
                  u8 = Buffer.from(
                    (await axios.get(content.animation_url, { responseType: 'arraybuffer' })).data,
                    'binary'
                  ).toString('base64')
                  imageUrl = `data:video/mp4;base64,${u8}`
                }
              }

              return {
                name: content.name,
                isKoiWallet: false,
                txId: `${content.token_id}_${content.asset_contract?.address}`,
                imageUrl,
                galleryUrl: `${PATH.GALLERY}#/details/${content.token_id}_${content.asset_contract?.address}`,
                koiRockUrl,
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
              console.log('Not enough data NFT: ', content)
              return null
            }
          } catch (err) {
            console.log('Failed loaded NFT: ', content)
            return null
          }
        })
      )

      // Filter failed load contents
      fetchedNFTs = fetchedNFTs.filter((nft) => !!nft)
      return fetchedNFTs
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
        Accept: 'application/json',
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
        pendingTransactions = pendingTransactions.map((transaction) => {
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
        pendingTransactions = pendingTransactions.map((transaction) => {
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

  async getNetworkId() {
    return this.eth.web3().eth.net.getId()
  }

  async transferToken({ tokenContractAddress, to, value }) {
    const provider = await storage.setting.get.ethereumProvider()
    const web3 = new Web3(provider)

    const tokenContract = new web3.eth.Contract(ERC20ABI, tokenContractAddress)

    const decimals = await tokenContract.methods.decimals().call()
    const amount = parseFloat(value) * Math.pow(10, decimals)

    const rawTx = {
      from: this.eth.address,
      to: tokenContractAddress,
      data: tokenContract.methods.transfer(to, value).encodeABI()
    }
    const estimateGas = await web3.eth.estimateGas(rawTx)
    rawTx.gas = estimateGas

    const signedTx = await web3.eth.accounts.signTransaction(rawTx, this.eth.key)
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    return receipt
  }
}
