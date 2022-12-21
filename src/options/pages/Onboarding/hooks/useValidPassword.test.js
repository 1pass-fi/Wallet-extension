import { VALIDATE_ERROR_MESSAGE } from 'constants/koiConstants'
import renderCustomHook from 'testUtils/renderCustomHook'

import useValidPassword from './useValidPassword'

describe('useValidPassword-onboarding hook', () => {
  it('should return the true validation result and null error message', async () => {
    const result = await renderCustomHook(useValidPassword, {
      password: 'OpenKoi@123',
      confirmPassword: 'OpenKoi@123'
    })

    const { isValidPassword, passwordErrorMessage } = result.current

    expect(isValidPassword).toBeTruthy()
    expect(passwordErrorMessage).toBeNull()
  })

  it('should return the false validation result and error message is not enough characters', async () => {
    const result = await renderCustomHook(useValidPassword, {
      password: 'Op@123',
      confirmPassword: 'Op@123'
    })

    const { isValidPassword, passwordErrorMessage } = result.current
    expect(isValidPassword).toBeFalsy()
    expect(passwordErrorMessage).toBe(VALIDATE_ERROR_MESSAGE.NOT_ENOUGH_CHARACTERS)
  })

  it('should return the false validation result and error message is invalid characters', async () => {
    const result = await renderCustomHook(useValidPassword, {
      password: 'OpenKoi¥@123',
      confirmPassword: 'OpenKoi¥@123'
    })

    const { isValidPassword, passwordErrorMessage } = result.current
    expect(isValidPassword).toBeFalsy()
    expect(passwordErrorMessage).toBe(VALIDATE_ERROR_MESSAGE.INVALID_CHARACTER)
  })

  it('should return the false validation result and error message is not matching password', async () => {
    const result = await renderCustomHook(useValidPassword, {
      password: 'OpenKoi@123',
      confirmPassword: 'Openkoi@123'
    })

    const { isValidPassword, passwordErrorMessage } = result.current
    expect(isValidPassword).toBeFalsy()
    expect(passwordErrorMessage).toBe(VALIDATE_ERROR_MESSAGE.NOT_MATCH)
  })
})
