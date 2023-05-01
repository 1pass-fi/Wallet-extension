import { SETTING } from 'constants/storageConstants'

import { ChromeStorage } from '../ChromeStorage'

const chrome = new ChromeStorage()

export const updateStorage = (key) => {
  return async (cb) => {
    try {
      const currentValue = await chrome._getChrome(key)
      const value = await cb(currentValue)
      await chrome._setChrome(key, value)
  
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
}

export default {
  addedEvmNetwork: updateStorage(SETTING.ADDED_EVM_NETWORKS)
}
