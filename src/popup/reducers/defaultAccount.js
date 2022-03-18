import { SET_DEFAULT_ARWEAVE_ACCOUNT, SET_DEFAULT_ETHEREUM_ACCOUNT } from 'options/actions/types'

const emptyAccount = {
  type: '',
  address: '',
  accountName: '',
  balance: 0,
  koiBalance: 0,
  provider: '',
  seedPhrase: '',
  affiliateCode: 'loading...',
  totalReward: 0,
  inviteSpent: true
}

const initialState = {
  ETH: emptyAccount,
  AR: emptyAccount
}

export default function defaultAccountReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_DEFAULT_ARWEAVE_ACCOUNT:
      return { ...state, AR: payload }
    case SET_DEFAULT_ETHEREUM_ACCOUNT:
      return { ...state, ETH: payload }
    default:
      return state
  }
}
