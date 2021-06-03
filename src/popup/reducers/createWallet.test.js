import createWalletReducer from './createWallet'
import * as types from 'actions/types'

const initialState = {
  stage: 1,
  password: null,
  seedPhrase: null
}

describe('CreateWallet reducer', () => {
  describe('Initial', () => {
    it('has initial object state', () => {
      expect(createWalletReducer(undefined, {})).toEqual(initialState)
    })
  })

  describe('Handle SET_CREATE_WALLET', () => {
    it('adds new attributes', () => {
      const newAttr = {
        stage: 2,
        password: 'password',
        seedPhrase: 'seedPhrase'
      }
      expect(createWalletReducer(newAttr, { type: types.SET_CREATE_WALLET, payload: newAttr }))
        .toEqual(newAttr)
    })
  })
})
