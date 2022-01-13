import errorHandler from '../errorHandler'

import createDID from './createDID'
import updateDID from './updateDID'
import getDID from './getDID'
import koiiMe from './koiiMe'
import kidHookCall from './kidHookCall'

export default {
  createDID: errorHandler(createDID),
  updateDID: errorHandler(updateDID),
  getDID: errorHandler(getDID),
  koiiMe,
  kidHookCall
}
