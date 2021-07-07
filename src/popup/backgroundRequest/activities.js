import { MESSAGES } from 'koiConstants'

import { Request } from './request'

export class ActivityRequest extends Request {
  constructor(backgroundConnect) {
    super(backgroundConnect)
  }

  /**
   * 
   * @param {Object} body request body
   * @param {Object} body.cursor to do pagination on loading activities
   * @returns {Object} { activitiesList, nextOwnedCursor, nextRecipientCursor }
   */
  loadActivities(body) {
    return this.promise(MESSAGES.LOAD_ACTIVITIES, body)
  }
}
