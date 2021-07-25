import { SET_ETHEREUM } from 'actions/types'

const initialState = {
  ethBalance: null,
  ethAddress: null
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_ETHEREUM:
      return { ...state, ...payload }
    default:
      return state
  }
}

/*  
[account1, account2, account3].map(account => render account)
account1 = {
  address: 'abcdef0x'
  balance: 0,
  password: encrypted password
  seedPhrase: encrypted seedphrases
}
account2 = {
  address: 'abcdef0x'
  balance: 0,
  password: encrypted password
  seedPhrase: encrypted seedphrases
}

accounts.get.all()
accounts.getByAddress()

-> need account class
const account = accounts.getByAddress('address')

account instances will contain address, balance attributes,
it will also contain methods to interact with the wallet like:
makeTransfer, signTransaction

get, set, remove.

What should be happened when a new wallet be imported?


*/ 
