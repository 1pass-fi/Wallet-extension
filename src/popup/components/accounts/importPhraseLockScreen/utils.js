import { PATH, ERROR_MESSAGE } from 'constants'

export const validatePhrase = ({
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
      const redirectPath = PATH.IMPORT_KEY_REDIRECT
      importWallet({ data: phrase, password, history, redirectPath })
    }
  } catch (err) {
    /* istanbul ignore next */
    setError(err.message)
  }
}
