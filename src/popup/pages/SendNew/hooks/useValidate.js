import { useEffect, useState } from 'react'
import { TYPE } from 'constants/accountConstants'
import { isArweaveAddress, isEthereumAddress, isSolanaAddress } from 'utils'

// const NOT_ENOUGH_BALANCE = 'Not enough tokens'
const INVALID_RECIPIENT = 'Invalid recipient address'

const useValidate = ({ selectedToken, amount, recipient, selectedAccount, alchemyAddress }) => {
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Please fill in all fields')

  useEffect(() => {
    const throwValidationError = (message) => {
      setValidated(false)
      setErrorMessage(message)
    }

    const throwValidationSuccess = () => {
      setValidated(true)
      setErrorMessage(null)
    }

    const validate = () => {
      let balance = selectedToken?.balance
      let rate = 10 ** selectedToken?.decimal
      if (selectedToken?.decimal === 1) rate = 1

      // validate balance
      // if (balance <= (amount * rate)) return throwValidationError(NOT_ENOUGH_BALANCE)

      // validate recipient address
      if (selectedAccount?.type === TYPE.ARWEAVE) {
        if (!isArweaveAddress(recipient)) return throwValidationError(INVALID_RECIPIENT)
        return throwValidationSuccess()
      }

      if (selectedAccount?.type === TYPE.ETHEREUM) {
        if (alchemyAddress) {
          if (!isEthereumAddress(alchemyAddress))
            return throwValidationError(INVALID_RECIPIENT)
        } else {
          if (!isEthereumAddress(recipient)) return throwValidationError(INVALID_RECIPIENT)
          return throwValidationSuccess()
        }
      }

      if (selectedAccount?.type === TYPE.SOLANA) {
        if (!isSolanaAddress(recipient)) return throwValidationError(INVALID_RECIPIENT)
        return throwValidationSuccess()
      }

      // TODO DatH
      if (selectedAccount?.type === TYPE.K2) {
        if (!isSolanaAddress(recipient)) return throwValidationError(INVALID_RECIPIENT)
        return throwValidationSuccess()
      }

      setValidated(true)
    }

    if (selectedToken && amount && recipient && selectedAccount) validate()
  }, [selectedToken, amount, recipient, selectedAccount, alchemyAddress])

  return { validated, errorMessage }
}

export default useValidate
