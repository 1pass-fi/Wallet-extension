import React, { useEffect, useMemo, useState } from 'react'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import { get, isNumber } from 'lodash'
import { popupAccount } from 'services/account'
import decodeTags from 'utils/decodeTags'
import getArweaveTokenData from 'utils/getArweaveTokenData'

import { TRANSACTION_TYPE } from './constants'

/* 
  rawValue is the value in smallest unit
  For example: 1 AR -> rawValue: 1.000.000.000.000 Winston

  value is the value in largest unit
*/
const useSendValue = ({
  transactionPayload,
  network,
  transactionType,
  userAddress,
  setIsLoading
}) => {
  const [value, setValue] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [tokenIconPath, setTokenIconPath] = useState(false)
  const [customTokenRecipient, setCustomTokenRecipient] = useState(null)
  const [contractAddress, setContractAddress] = useState(null)
  const [rawValue, setRawValue] = useState(null)
  const [balance, setBalance] = useState(null)
  const [originBalance, setOriginBalance] = useState(null)
  const [originSymbol, setOriginSymbol] = useState(null)

  const getSendValueArweave = (value) => {
    value = parseInt(value)
    return value / 1000000000000
  }

  const customTokenIconPath = useMemo(
    () => `img/v2/custom-tokens/custom-token-${Math.floor(Math.random() * 5)}.svg`,
    []
  )

  useEffect(() => {
    const loadValue = async () => {
      try {
        setIsLoading(true)
        const value = get(transactionPayload, 'value')

        setValue(getSendValueArweave(value))
        setRawValue(value)
        setSymbol('AR')
        setOriginSymbol('AR')

        const account = await popupAccount.getAccount({
          address: userAddress
        })
        const balance = await account.get.balance()

        setOriginBalance(balance)

        if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
          let tags = decodeTags(get(transactionPayload, 'tags'))
          const contractAddress = get(tags, 'Contract')
          setContractAddress(contractAddress)
          let { logo, balance, price, name, symbol, decimal } = await getArweaveTokenData(
            contractAddress,
            userAddress
          )

          const input = JSON.parse(tags['Input'])

          const customTokenRecipient = get(input, 'target')
          const quantity = get(input, 'qty')

          if (!logo) logo = customTokenIconPath

          setTokenIconPath(logo)
          setSymbol(symbol)
          setValue(quantity)
          setRawValue(quantity)
          setCustomTokenRecipient(customTokenRecipient)
          setBalance(balance)
        }
      } catch (err) {
        console.error('Get send value error: ', err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (transactionPayload && network && userAddress) loadValue()
  }, [transactionPayload, network, transactionType, userAddress])

  const SendValue = () => (
    <>
      {isNumber(value) ? value : '------'} {symbol || '------'}
    </>
  )

  const TokenIcon = () => (
    <>
      {tokenIconPath ? <img src={tokenIconPath} /> : <ArweaveIcon />}
    </>
  )

  return {
    SendValue,
    TokenIcon,
    customTokenRecipient,
    value,
    contractAddress,
    rawValue,
    balance,
    symbol,
    originBalance,
    originSymbol
  }
}

export default useSendValue
