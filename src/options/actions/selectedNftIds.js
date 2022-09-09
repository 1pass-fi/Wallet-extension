import { SET_SELECTED_NFT_IDS } from 'options/actions/types'

export const setSelectedNftIds = (nftIds) => (dispatch) => {
  dispatch({ type: SET_SELECTED_NFT_IDS, payload: nftIds })
}
