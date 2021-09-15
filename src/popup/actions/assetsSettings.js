import { SET_ASSETS_TAB_SETTINGS } from './types'

export const setAssetsTabSettings = (settings) => {
  return {
    type: SET_ASSETS_TAB_SETTINGS,
    payload: settings,
  }
}
