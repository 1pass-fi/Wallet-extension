// constants
import { ERROR_MESSAGE } from 'constants/koiConstants'

export const validatePhrase = async ({
  phrase,
  password,
  confirmPassword,
  history,
  setError,
  importWallet,
}) => {
  try {
    if (phrase.split(' ').length != 12) {
      setError(ERROR_MESSAGE.INCORRECT_PHRASE)
    } else if (password.length < 8) {
      setError(ERROR_MESSAGE.PASSWORD_LENGTH)
    } else if (password !== confirmPassword) {
      setError(ERROR_MESSAGE.PASSWORD_MATCH)
    } else {
      await importWallet(phrase, password)
    }
  } catch (err) {
    /* istanbul ignore next */
    setError(err.message)
  }
}
