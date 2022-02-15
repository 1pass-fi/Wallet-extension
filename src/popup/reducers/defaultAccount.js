import {
  UPDATE_DEFAULT_ACCOUNT,
  SET_DEFAULT_ACCOUNT,
  SET_DEFAULT_ACCOUNT_BY_ADDRESS
} from 'options/actions/types'

const initialState = {
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

export default function defaultAccountReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_DEFAULT_ACCOUNT:
    case SET_DEFAULT_ACCOUNT_BY_ADDRESS:
      return payload
    case UPDATE_DEFAULT_ACCOUNT:
      return { ...state, ...payload }
    default:
      return state
  }
}
