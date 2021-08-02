import { MESSAGES } from 'koiConstants'

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
}
