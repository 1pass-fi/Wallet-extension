import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import { get, isNumber } from 'lodash'
import { popupAccount } from 'services/account'
import { decodeERC20Transaction } from 'utils/erc20/decodeTxData'
import getTokenData from 'utils/getTokenData'

import { TRANSACTION_TYPE } from './constants'

const fromHexToDecimal = (hexString) => {
  let number = null
  if (hexString) number = parseInt(hexString, 16)

  return number
}

const fromWeiToEth = (wei) => {
  return wei / 1000000000000000000
}

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

  const networkMetadata = useSelector(state => state.networkMetadata)

  const getSendValueEthereum = (value) => {
    value = fromHexToDecimal(value)
    value = fromWeiToEth(value)
    return value
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

        setValue(getSendValueEthereum(value))
        setRawValue(value)
        setSymbol(get(networkMetadata, 'currencySymbol'))
        setOriginSymbol(get(networkMetadata, 'currencySymbol'))
        userAddress = ethers.utils.getAddress(userAddress)

        const account = await popupAccount.getAccount({
          address: userAddress
        })
        const balance = await account.get.balance()
        setOriginBalance(balance)

        if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
          const to = get(transactionPayload, 'to')
          setContractAddress(to) // "to" is contractAddress for eth transaction
          let { logo, balance, price, name, symbol, decimal } = await getTokenData(
            to,
            userAddress
          )

          const data = get(transactionPayload, 'data')
          const decode = decodeERC20Transaction(data)
          let quantity = get(decode, 'params[1].value')
          const customTokenRecipient = ethers.utils.getAddress(get(decode, 'params[0].value'))

          setRawValue(quantity)

          decimal = decimal === 1 ? 0 : decimal
          quantity = quantity / 10 ** decimal

          if (!logo) logo = customTokenIconPath

          setTokenIconPath(logo)
          setSymbol(symbol)
          setValue(quantity)
          setCustomTokenRecipient(customTokenRecipient)
          setBalance(balance / 10 ** decimal)
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
      {tokenIconPath ? <img src={tokenIconPath} /> : <EthereumIcon />}
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
