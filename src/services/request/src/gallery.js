import { MESSAGES } from 'constants/koiConstants'

import { Request } from './request'

export class GalleryRequest extends Request {
  constructor(backgroundConnect) {
    super(backgroundConnect)
  }

  /**
   * @param {Object} body
   * @param {JSON} body.content Title, Description, Username of the NFT
   * @param {Array} body.tags Tas of the NFT
   * @param {String} body.fileType The content type of file
   * @returns {String} transaction Id
   */
  uploadNFT(body) {
    return this.promise(MESSAGES.UPLOAD_NFT, body)
  }

  /**
   *
   * @param {Object} body
   * @param {Object} body.collectionData An array of NFT IDs
   * @param {String} body.address { name: String, description: String, tags: Array }
   */
  createNewCollection(body) {
    return this.promise(MESSAGES.CREATE_COLLECTION, body)
  }

  /**
   *
   * @param {Object} body
   * @param {Object} body.kidInfo { name, description, link, addresses }
   * @param {String} body.fileType
   * @returns
   */
  createNewKID(body) {
    return this.promise(MESSAGES.CREATE_KID, body)
  }

  /**
   *
   * @param {Object} body
   * @param {Object} body.kidInfo { name, description, link, addresses }
   * @param {String} body.contractId contract ID of KID to be updated
   * @returns
   */
  updateKID(body) {
    return this.promise(MESSAGES.UPDATE_KID, body)
  }

  /**
   *
   * @param {Object} body
   * @param {String} body.password Input password
   * @returns
   */
  getKeyFile(body) {
    return this.promise(MESSAGES.GET_KEY_FILE, body)
  }

  loadCollections() {
    return this.promise(MESSAGES.LOAD_COLLECTIONS)
  }

  /**
   *
   * @param {Object} body
   * @param {String} body.address Address of wallet
   * @returns
   */
  loadKID(body) {
    return this.promise(MESSAGES.LOAD_KID, body)
  }

  /**
   *
   * @param {Object} body
   * @param {Object} body.kidInfo
   * @param {String} body.address
   * @param {Object} body.payload
   * @returns
   */
  createOrUpdateKID(body) {
    return this.promise(MESSAGES.CREATE_UPDATE_KID, body)
  }

  uploadJSONKeyFile(body) {
    return this.promise(MESSAGES.IMPORT_WALLET, body)
  }

  generateNewWallet(body) {
    return this.promise(MESSAGES.GENERATE_WALLET, body)
  }

  saveWallet(body) {
    return this.promise(MESSAGES.SAVE_WALLET_GALLERY, body)
  }

  /**
   *
   * @param {Object} body
   * @param {String} body.address
   */
  setDefaultAccount(body) {
    return this.promise(MESSAGES.SET_DEFAULT_ARWEAVE_ACCOUNT, body)
  }

  friendReferral(body) {
    return this.promise(MESSAGES.FRIEND_REFERRAL, body)
  }

  // TODO: PLEASE CHANGE THE FUNCTION NAME ASAP
  transferNFT(body) {
    return this.promise(MESSAGES.TRANSFER_NFT, body)
  }

  /**
   *
   * @param {Object} body
   * @param {String} body.nftId
   * @param {String} body.senderAddress
   * @param {String} body.recipientAddress
   * @returns
   */
  _transferNFT(body) {
    return this.promise(MESSAGES.REAL_TRANSFER_NFT, body)
  }

  loadFriendReferralData(body) {
    return this.promise(MESSAGES.LOAD_FRIEND_REFERRAL_DATA, body)
  }

  createDID(body) {
    return this.promise(MESSAGES.HANDLE_CREATE_DID, body)
  }

  updateDID(body) {
    return this.promise(MESSAGES.HANDLE_UPDATE_DID, body)
  }

  getDID(body) {
    return this.promise(MESSAGES.GET_DID, body)
  }

  getDIDData(body) {
    return this.promise(MESSAGES.GET_DID_DATA, body)
  }

  /**
   *
   * @param {Object} body
   * @param {Object} body.collectionData
   * @param {String} body.collectionId
   * @param {String} body.address
   * @returns
   */
  updateCollection(body) {
    return this.promise(MESSAGES.UPDATE_COLLECTION, body)
  }

  /**
   * @typedef {Object} GetKeyPayload
   * @property {string} address
   * @param {GetKeyPayload} body
   * @returns {Promise<any>}
   */
  getKey(body) {
    return this.promise(MESSAGES.GET_KEY, body)
  }

  /**
   *
   * @param {Object} body
   * @param {Boolean} body.isPrivate
   * @param {String} body.txId
   * @param {String} body.address
   * @returns
   */
  updateNft(body) {
    return this.promise(MESSAGES.UPDATE_NFT, body)
  }

  test(body) {
    return this.promise(MESSAGES.TEST, body)
  }

  updateEthereumProvider(body) {
    return this.promise(MESSAGES.UPDATE_ETHEREUM_PROVIDER, body)
  }

  updateSolanaProvider(body) {
    return this.promise(MESSAGES.UPDATE_SOLANA_PROVIDER, body)
  }

  updateK2Provider(body) {
    return this.promise(MESSAGES.UPDATE_K2_PROVIDER, body)
  }
}
