import { ERROR_MESSAGE } from 'constants'

import { validatePassword } from './utils'

describe('vailidatePassword', () => {
  let setError, generateWallet

  const generateEvent = (
    { pwd, pwdConfirm, checked } = { pwd: '', pwdConfirm: '', checked: '' }
  ) => ({
    target: {
      pwd: {
        value: pwd,
      },
      pwdConfirm: {
        value: pwdConfirm,
      },
      checkbox: {
        checked: checked,
      },
    },
  })

  beforeEach(() => {
    setError = jest.fn()
    generateWallet = jest.fn()
  })

  describe('password length < 8', () => {
    it('setError PASSWORD_LENGTH', () => {
      const e = generateEvent()
      validatePassword({ e, setError, generateWallet })
      expect(setError).toHaveBeenCalledWith(ERROR_MESSAGE.PASSWORD_LENGTH)
    })
  })

  describe('password and password confirm do not match', () => {
    it('setError PASSWORD_MATCH', () => {
      const e = generateEvent({ pwd: '12345678', pwdConfirm: '12345679' })
      validatePassword({ e, setError, generateWallet })
      expect(setError).toHaveBeenCalledWith(ERROR_MESSAGE.PASSWORD_MATCH)
    })
  })

  describe('not checked terms', () => {
    it('setError CHECKED_TERMS', () => {
      const e = generateEvent({ pwd: '12345678', pwdConfirm: '12345678' })
      validatePassword({ e, setError, generateWallet })
      expect(setError).toHaveBeenCalledWith(ERROR_MESSAGE.CHECKED_TERMS)
    })
  })

  describe('enough infomation', () => {
    it('generateWallet', () => {
      const e = generateEvent({
        pwd: '12345678',
        pwdConfirm: '12345678',
        checked: true,
      })
      validatePassword({ e, setError, generateWallet })
      expect(generateWallet).toHaveBeenCalledWith({
        stage: 2,
        password: '12345678',
      })
    })
  })
})
