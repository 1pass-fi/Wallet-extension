import { useEffect, useState } from 'react'
import { VALIDATE_ERROR_MESSAGE } from '../../../../../constants/koiConstants'
import isEmpty from 'lodash/isEmpty'

const passwordRegex = new RegExp('(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[0-9].*)(?=.*[!@#$%^&*()].*).{8,}')

const useValidPassword = ({ password, confirmPassword }) => {
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null)

  const validatePassword = () => {
    console.log('password', password)
    console.log('confirmPassword', confirmPassword)

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

    if (!isEmpty(confirmPassword) && password !== confirmPassword) {
      setIsValidPassword(false)
      setPasswordErrorMessage(VALIDATE_ERROR_MESSAGE.NOT_MATCH)
      return
    }

    setIsValidPassword(true)
    setPasswordErrorMessage(null)
  }

  useEffect(() => {
    if (password?.length) validatePassword()
  }, [password, confirmPassword])

  return { isValidPassword, passwordErrorMessage }
}

export default useValidPassword
