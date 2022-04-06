import React, { useEffect, useState } from 'react'
import { get, isNumber } from 'lodash'

import getTokenData from 'utils/getTokenData'
import { decodeERC20Transaction } from 'utils/erc20/decodeTxData'

import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

import { TRANSACTION_TYPE } from './constants'

const fromHexToDecimal = (hexString) => {
  let number = null
  if (hexString) number = parseInt(hexString, 16)

  return number
}

const fromWeiToEth = (wei) => {
  return wei / 1000000000000000000
}

const useSendValue = ({ transactionPayload, network, transactionType, userAddress = '0xb076413401172CBB73C082107514De3376E4FF6c' }) => {
  const [value, setValue] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [tokenIconPath, setTokenIconPath] = useState(false)
  const [customTokenRecipient, setCustomTokenRecipient] = useState(null)

  const getSendValueEthereum = (value) => {
    value = fromHexToDecimal(value)
    value = fromWeiToEth(value)
    return value
  }

  const getSendValueArweave = (value) => {
    value = parseInt(value)
    return value / 1000000000000
  }

  useEffect(() => {
    const loadValue = async () => {
      const value = get(transactionPayload, 'value')

      switch (network) {
        case 'ETHEREUM':
          setValue(getSendValueEthereum(value))
          setSymbol('ETH')
          break
        case 'ARWEAVE':
          setValue(getSendValueArweave(value))
          setSymbol('AR')
          break
      }

      if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
        const to = get(transactionPayload, 'to')
        let {     
          logo,
          balance,
          price,
          name,
          symbol,
          decimal 
        } = await getTokenData(to, userAddress)

        const data = get(transactionPayload, 'data')
        const decode = decodeERC20Transaction(data)
        let quantity = get(decode, 'params[1].value')
        const customTokenRecipient = get(decode, 'params[0].value')

        decimal = decimal === 1 ? 0 : decimal
        quantity = quantity / (10 ** decimal)
        
        setTokenIconPath(logo)
        setSymbol(symbol)
        setValue(quantity)
        setCustomTokenRecipient(customTokenRecipient)
      }

    }

    if (transactionPayload && network) loadValue()
  }, [transactionPayload, network, transactionType])

  const SendValue = () => (
    <>
      {isNumber(value) ? value : '------'} {symbol || '------'}
    </>
  )

  const TokenIcon = () => (
    <>
      {network === 'ETHEREUM' && <EthereumIcon />}
      {network === 'ARWEAVE' && <ArweaveIcon />}
    </>
  )

  return { SendValue, TokenIcon, customTokenRecipient }
}

export default useSendValue
