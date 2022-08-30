import errorHandler from '../errorHandler'

import createDID from './createDID'
import getDID from './getDID'
import kidHookCall from './kidHookCall'
import koiiMe from './koiiMe'
import updateDID from './updateDID'

export default {
  createDID: errorHandler(createDID),
  updateDID: errorHandler(updateDID),
  getDID: errorHandler(getDID),
  koiiMe,
  kidHookCall
}
