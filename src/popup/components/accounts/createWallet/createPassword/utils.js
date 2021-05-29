import get from 'lodash/get'
import { ERROR_MESSAGE } from 'koiConstants'

export const validatePassword = ({ e, setError, generateWallet }) => {
  try {
    const pwd = get(e, 'target.pwd.value')
    const pwdConfirm = get(e, 'target.pwdConfirm.value')
    const checked = get(e, 'target.checkbox.checked')
    if (pwd.length < 8) {
      setError(ERROR_MESSAGE.PASSWORD_LENGTH)
    } else if (pwd !== pwdConfirm) {
      setError(ERROR_MESSAGE.PASSWORD_MATCH)
    } else if (!checked) {
      setError(ERROR_MESSAGE.CHECKED_TERMS)
    } else {
      generateWallet({ stage: 2, password: pwd })
    }
  } catch (err) {
    setError(err.message)
  }
}
