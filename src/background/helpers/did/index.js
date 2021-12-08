import errorHandler from '../errorHandler'

import createDID from './createDID'
import updateDID from './updateDID'

export default {
  createDID: errorHandler(createDID),
  updateDID: errorHandler(updateDID)
}
