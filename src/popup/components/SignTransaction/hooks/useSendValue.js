import React, { useEffect, useState } from 'react'
import { get } from 'lodash'

import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

const useSendValue = ({ transactionPayload, network }) => {
  const [value, setValue] = useState(null)
  const [symbol, setSymbol] = useState(null)

  const getSendValueEthereum = (value) => {
    return 0.001
  }

  useEffect(() => {
    const loadValue = () => {
      const value = get(transactionPayload, 'value')

      console.log('network', network)

      switch (network) {
        case 'ETHEREUM':
          setValue(getSendValueEthereum(value))
          setSymbol('ETH')
          break
        case 'ARWEAVE':
          break
      }
    }

    if (transactionPayload && network) loadValue()
  }, [transactionPayload, network])

  const SendValue = () => (
    <>
      {value || '------'} {symbol || '------'}
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
