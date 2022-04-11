import { MESSAGES } from 'constants/koiConstants'

import { Request } from './request'

export class ActivityRequest extends Request {
  constructor(backgroundConnect) {
    super(backgroundConnect)
  }

  /**
   * 
   * @param {Object} body request body
   * @param {Object} body.network
   */
  loadActivities(body) {
    return this.promise(MESSAGES.LOAD_ACTIVITIES, body)
  }
}
