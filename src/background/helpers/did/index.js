import errorHandler from '../errorHandler'

import createDID from './createDID'
import updateDID from './updateDID'
import getDID from './getDID'

export default {
  createDID: errorHandler(createDID),
  updateDID: errorHandler(updateDID),
  getDID: errorHandler(getDID)
}
