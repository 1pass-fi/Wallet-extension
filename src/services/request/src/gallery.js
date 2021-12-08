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
   * @param {Array} body.nftIds An array of NFT IDs
   * @param {Object} body.collectionInfo { name: String, description: String, tags: Array }
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

  /**
   * @param {Object} body
   * @param {String} body.address Address of wallet
   * @returns
   */
  loadCollections(body) {
    return this.promise(MESSAGES.LOAD_COLLECTIONS, body)
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
    return this.promise(MESSAGES.SET_DEFAULT_ACCOUNT, body)
  }

  friendReferral(body) {
    return this.promise(MESSAGES.FRIEND_REFERRAL, body)
  }

  // TODO: PLEASE CHANGE THE FUNCTION NAME ASAP
  transferNFT(body){
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
}
