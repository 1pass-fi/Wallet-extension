import { Connection, LAMPORTS_PER_SOL,PublicKey } from '@_koi/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { TYPE } from 'constants/accountConstants'
import { ACCOUNT } from 'constants/accountConstants'
import { ALL_NFT_LOADED,PATH } from 'constants/koiConstants'
import { findIndex } from 'lodash'
import moment from 'moment'
import { AccountStorageUtils } from 'services/account/AccountStorageUtils'
import storage from 'services/storage'
import { getChromeStorage } from 'utils'
import k2Contracts from 'utils/k2-contracts.json'
import clusterApiUrl from 'utils/k2ClusterApiUrl'
import * as TokenAssets from 'utils/resolveSolanaNFTs'

export class K2Method {
  #chrome
  constructor(k2Tool) {
    this.k2Tool = k2Tool
    this.#chrome = new AccountStorageUtils(k2Tool.address)
  }

  async getBalances() {
    const k2Balance = await this.k2Tool.getBalance()
    return { balance: k2Balance }
  }

  async loadMyContent() {
    try {
      const nfts = await this.fetchNfts()
      console.log('Fetched contents: ', nfts.length)

      /* 
        get nft list for this ETH address from Chrome storage
      */
      const contentList =
        (await getChromeStorage(`${this.k2Tool.address}_assets`))[
          `${this.k2Tool.address}_assets`
        ] || []
      console.log('Saved contents: ', contentList.length)

      /*
        There're two cases that NFTs will be filtered:
        - Failed load content (removed on functions cacheNFTs on "background/popupEventHandlers")
        - Out-of-date NFTs
      */
      const k2AssetIds = nfts.map((nft) => nft.txId)

      const validContents = contentList.filter((content) => {
        return k2AssetIds.indexOf(content.txId) !== -1
      })
      console.log('Up to date saved content: ', validContents.length)

      /* 
        detect new nft(s) that were not saved in Chrome storage
      */
      const storageContentIds = validContents.map((nft) => nft.txId)

      const newContents = nfts.filter((nft) => {
        return storageContentIds.indexOf(nft.txId) === -1
      })

      console.log('New contents: ', newContents.length)

      if (!newContents.length && nfts.length === contentList.length) {
        console.log('ALL NFT LOADED')
        return ALL_NFT_LOADED
      }

      const newContentList = await this.getNftData(newContents, false)
      console.log('newContentList', newContentList)

      const res = {
        contents: [...validContents, ...newContentList],
        newContents
      }
      return res
    } catch (e) {
      console.log('Unable to load K2 content', e)
      throw new Error(e.message)
    }
  }

  async fetchNfts() {
    const METADATA_PROGRAM_ID_PUBLIC_KEY = new PublicKey(
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    )

    if (this.k2Tool.connection === null) throw new Error('No connection')
    const connection = this.k2Tool.connection

    const wallets = [this.k2Tool.address]
    const tokenAccountsByOwnerAddress = await Promise.all(
      wallets.map(async (address) =>
        connection.getParsedTokenAccountsByOwner(new PublicKey(address), {
          programId: TOKEN_PROGRAM_ID
        })
      )
    )

    const potentialNFTsByOwnerAddress = tokenAccountsByOwnerAddress
      .map((ta) => ta.value)
      .map((value) => {
        const mintAddresses = value
          .map((v) => ({
            mint: v.account.data.parsed.info.mint,
            tokenAmount: v.account.data.parsed.info.tokenAmount
          }))
          .filter(({ tokenAmount }) => {
            // Filter out the token if we don't have any balance
            const ownsNFT = tokenAmount.amount !== '0'
            // Filter out the tokens that don't have 0 decimal places.
            // NFTs really should have 0
            const hasNoDecimals = tokenAmount.decimals === 0
            return ownsNFT && hasNoDecimals
          })
          .map(({ mint }) => mint)
        return { mintAddresses }
      })

    const nfts = await Promise.all(
      potentialNFTsByOwnerAddress.map(async ({ mintAddresses }) => {
        const programAddresses = await Promise.all(
          mintAddresses.map(
            async (mintAddress) =>
              (
                await PublicKey.findProgramAddress(
                  [
                    Buffer.from('metadata'),
                    METADATA_PROGRAM_ID_PUBLIC_KEY.toBytes(),
                    new PublicKey(mintAddress).toBytes()
                  ],
                  METADATA_PROGRAM_ID_PUBLIC_KEY
                )
              )[0]
          )
        )

        let accountInfos = await connection.getMultipleAccountsInfo(programAddresses)
        accountInfos = accountInfos.map((accountInfo, i) => [
          accountInfo,
          potentialNFTsByOwnerAddress.map(({ mintAddresses }) => mintAddresses[i])[0]
        ])

        const nonNullInfos = accountInfos?.filter((a) => !!a[0]) ?? []

        const metadataUrls = nonNullInfos
          .map((x) => [TokenAssets._utf8ArrayToNFTType(x[0]?.data), x[1]])
          .filter((metadataUrl) => !!metadataUrl[0])

        const results = await Promise.all(
          metadataUrls.map(async (item) =>
            fetch(item[0]?.url)
              .then((res) => res.json())
              .catch(() => null)
          )
        )

        const metadatas = results.filter(Boolean).map((metadata, i) => ({
          metadata,
          type: metadataUrls[i][0].type,
          txId: metadataUrls[i][1]
        }))

        return metadatas.filter((r) => !!r.metadata)
      })
    )
    return nfts[0]
  }

  async getNftData(nfts, getBase64) {
    try {
      let nftContents = await Promise.all(
        nfts.map(async (nft) => {
          try {
            const nftMetadata = nft.metadata
            const token_id = nftMetadata.properties.files[0].uri?.slice(24, 60)
            return {
              name: nftMetadata.name,
              isKoiWallet: false, // TODO DatH-LongP
              txId: `${nft.txId}`,
              imageUrl: nftMetadata.properties.files[0].uri,
              galleryUrl: `${PATH.GALLERY}#/details/${nft.txId}`,
              koiRockUrl: '',
              isRegistered: false,
              contentType: nftMetadata.properties.category,
              totalViews: 0,
              createdAt: '',
              description: nftMetadata.description,
              type: TYPE.K2,
              address: this.K2Tool.address
            }
          } catch (error) {
            return null
          }
        })
      )

      // filter failed load contents
      nftContents = nftContents.filter((nft) => !!nft)
      return nftContents
    } catch (error) {
      console.log(error.message)
      return []
    }
  }

  async updateActivities() {

    const getActiveName = (metaData, activeType) => {
      let foundToken = k2Contracts.find(token => 
        token.address.toLowerCase() === metaData.postTokenBalances[0].mint.toLowerCase()
      ) || {}
      return foundToken.symbol !== undefined ? `${activeType} ${foundToken.symbol}` : `${activeType} CustomToken` 
    }
    const provider = await storage.setting.get.k2Provider()
    const connection = new Connection(provider)
    const signatureInfos = await connection.getSignaturesForAddress(this.k2Tool.keypair.publicKey)
    const transactions = await Promise.all(
      signatureInfos.map(
        async (signatureInfos) => await connection.getTransaction(signatureInfos.signature)
      )
    )
    const accountName = await this.#chrome.getField(ACCOUNT.ACCOUNT_NAME)

    const activities = transactions.map((tx) => {
      const { transaction, meta } = tx
      let source, activityName, expense
      if (transaction.message.accountKeys[0]?.toString() === this.k2Tool.address) {
        source = transaction.message.accountKeys[1]?.toString()
        if (meta.postTokenBalances.length === 0 || meta.preTokenBalances.length === 0){
          activityName = 'Sent KOII'
          expense = Math.abs(meta.postBalances[0] - meta.preBalances[0] + meta.fee) / LAMPORTS_PER_SOL
        } else {
          activityName = getActiveName(meta, 'Sent')
          expense = Math.abs(meta.postTokenBalances[0].uiTokenAmount.amount - meta.preTokenBalances[0].uiTokenAmount.amount) / Math.pow(10, meta.preTokenBalances[0].uiTokenAmount.decimals)
        }
      } else {
        source = transaction.message.accountKeys[0]?.toString()
        if (meta.postTokenBalances.length === 0 || meta.preTokenBalances.length === 0){
          activityName = 'Received KOII'
          expense = Math.abs(meta.postBalances[1] - meta.preBalances[1]) / LAMPORTS_PER_SOL
        } else {
          activityName = getActiveName(meta, 'Received')
          expense = Math.abs(meta.postTokenBalances[0].uiTokenAmount.amount - meta.preTokenBalances[0].uiTokenAmount.amount) / Math.pow(10, meta.preTokenBalances[0].uiTokenAmount.decimals)
        }
      }
      return {
        id: transaction.signatures[0],
        activityName,
        expense,
        accountName,
        time: tx.blockTime,
        date: moment(Number(tx.blockTime) * 1000).format('MMMM DD YYYY'),
        source,
        network: this.k2Tool.provider,
        address: this.k2Tool.address,
        isK2Account: true
      }
    })

    const oldActivites = (await this.#chrome.getActivities()) || []
    const newestOfOldActivites = oldActivites[0]

    if (newestOfOldActivites) {
      const idx = findIndex(activities, (data) => data.id === newestOfOldActivites.id)

      for (let i = 0; i < idx; i++) {
        activities[i].seen = false
      }
    }

    await this.#chrome.setActivities(activities)
  }

  async transfer(_, recipient, qty) {
    return this.k2Tool.transfer(recipient, qty)
  }

  async loadCollections() {}

  async createCollection() {}

  async loadKID() {}

  async createOrUpdateKID() {}

  async transactionConfirmedStatus(txHas) {
    return { dropped: false, confirmed: true }
  }

  async nftBridge() {}

  async getBridgeStatus() {}

  /* */

  async signTx() {}

  async registerData() {}

  async signPort() {}

  async transferNFT() {}

  async updateNftStates() {}

  async registerNft() {}

  /*
    AFFILIATE CODE
  */
  async getAffiliateCode() {}

  async claimReward() {}

  async getRegistrationReward() {}

  async submitInviteCode() {}

  async getTotalRewardK2() {}

  async checkAffiliateInviteSpent() {}

  /*
    GET DATA FOR INPUT nftIds
  */
  async getNftData(nftIds, getBase64) {}

  /* */
  async getNfts(nftIds, getBase64) {}
}
