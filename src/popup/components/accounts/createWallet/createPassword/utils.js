import get from 'lodash/get'
import { ERROR_MESSAGE } from 'koiConstants'

export const validatePassword = async ({ e, setError, generateWallet, walletType }) => {
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
      await generateWallet({ stage: 2, password: pwd, walletType })
    }
  } catch (err) {
    setError(err.message)
  }
}
