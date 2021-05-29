import { ERROR_MESSAGE } from 'koiConstants'

import { validatePhrase } from './utils'

describe('vailidatePassword', () => {
  let setError, importWallet

  const getProps = ({
    phrase = '1 2 3 4 5 6 7 8 9 0 1 2',
    password = '12345678',
    confirmPassword = '12345678',
    history = '',
  }) => ({
    phrase,
    password,
    confirmPassword,
    history,
    setError,
    importWallet,
  })

  beforeEach(() => {
    setError = jest.fn()
    importWallet = jest.fn()
  })

  describe('phrase length is not equal 12', () => {
    it('setError INCORRECT_PHRASE', () => {
      validatePhrase(getProps({ phrase: '1 2' }))
      expect(setError).toHaveBeenCalledWith(ERROR_MESSAGE.INCORRECT_PHRASE)
    })
  })

  describe('password invalid', () => {
    it('setError PASSWORD_LENGTH', () => {
      validatePhrase(getProps({ password: '1234567' }))
      expect(setError).toHaveBeenCalledWith(ERROR_MESSAGE.PASSWORD_LENGTH)
    })
  })

  describe('password and confirmPassword do not match', () => {
    it('setError PASSWORD_MATCH', () => {
      validatePhrase(getProps({ confirmPassword: '123456789' }))
      expect(setError).toHaveBeenCalledWith(ERROR_MESSAGE.PASSWORD_MATCH)
    })
  })

  describe('all properties are valid', () => {
    it('importWallet successfully', () => {
      validatePhrase(getProps({}))
      expect(importWallet).toHaveBeenCalled()
    })
  })
})
