import React, { useEffect, useState } from 'react'
import { get, isNumber } from 'lodash'

import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

const fromHexToDecimal = (hexString) => {
  let number = null
  if (hexString) number = parseInt(hexString, 16)

  return number
}

const fromWeiToEth = (wei) => {
  return wei / 1000000000000000000
}

const useSendValue = ({ transactionPayload, network }) => {
  const [value, setValue] = useState(null)
  const [symbol, setSymbol] = useState(null)

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
    const loadValue = () => {
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
    }

    if (transactionPayload && network) loadValue()
  }, [transactionPayload, network])

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

  return { SendValue, TokenIcon }
}

export default useSendValue
