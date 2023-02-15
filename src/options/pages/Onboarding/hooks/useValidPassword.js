import { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import { VALIDATE_ERROR_MESSAGE } from '../../../../constants/koiConstants'

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

const useValidPassword = ({ password, confirmPassword }) => {
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null)

  const validatePassword = () => {
    setIsValidPassword(false)

    if (password?.length < 8) {
      setIsValidPassword(false)
      setPasswordErrorMessage(VALIDATE_ERROR_MESSAGE.NOT_ENOUGH_CHARACTERS)
      return
    }

    if (!passwordRegex.test(password)) {
      setIsValidPassword(false)
      setPasswordErrorMessage(VALIDATE_ERROR_MESSAGE.INVALID_CHARACTER)
      return
    }

    if (password !== confirmPassword) {
      setIsValidPassword(false)
      setPasswordErrorMessage(chrome.i18n.getMessage('passwordDoesNotMatch'))
      return
    }

    setIsValidPassword(true)
    setPasswordErrorMessage(null)
  }

  useEffect(() => {
    setIsValidPassword(false)
    if (password?.length) validatePassword()
  }, [password, confirmPassword])

  return { isValidPassword, passwordErrorMessage }
}

export default useValidPassword
