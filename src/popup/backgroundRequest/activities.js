import { MESSAGES } from 'koiConstants'

import { Request } from './request'

export class ActivityRequest extends Request {
  constructor(backgroundConnect) {
    super(backgroundConnect)
  }
}
