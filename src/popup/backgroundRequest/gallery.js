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
}
