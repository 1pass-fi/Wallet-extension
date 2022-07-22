import React, { useEffect, useMemo, useState } from 'react'
import { get, isNumber } from 'lodash'

import getTokenData from 'utils/getTokenData'
import getArweaveTokenData from 'utils/getArweaveTokenData'
import { decodeERC20Transaction } from 'utils/erc20/decodeTxData'

import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

import { TRANSACTION_TYPE } from './constants'

import decodeTags from 'utils/decodeTags'
import { popupAccount } from 'services/account'

import { getSolanaCustomTokensData } from 'utils/getTokenData'

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
const useSendValue = ({ transactionPayload, network, transactionType, userAddress, setIsLoading }) => {
  const [value, setValue] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [tokenIconPath, setTokenIconPath] = useState(false)
  const [customTokenRecipient, setCustomTokenRecipient] = useState(null)
  const [contractAddress, setContractAddress] = useState(null)
  const [rawValue, setRawValue] = useState(null)
  const [balance, setBalance] = useState(null)
  const [originBalance, setOriginBalance] = useState(null)
  const [originSymbol, setOriginSymbol] = useState(null)

  const getSendValueEthereum = (value) => {
    value = fromHexToDecimal(value)
    value = fromWeiToEth(value)
    return value
  }

  const getSendValueArweave = (value) => {
    value = parseInt(value)
    return value / 1000000000000
  }

  const getSendValueSolana = (value) => {
    value = parseInt(value)
    return value / 1000000000
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
  
        switch (network) {
          case 'ETHEREUM':
            setValue(getSendValueEthereum(value))
            setRawValue(value)
            setSymbol('ETH')
            setOriginSymbol('ETH')
            break
          case 'ARWEAVE':
            setValue(getSendValueArweave(value))
            setRawValue(value)
            setSymbol('AR')
            setOriginSymbol('AR')
            break
          case 'SOLANA':
            setValue(getSendValueSolana(value))
            setRawValue(value)
            setSymbol('SOL')
            setOriginSymbol('SOL')
            setTokenIconPath('img/v2/solana-logo.svg')
            break
          case 'K2':
            setValue(getSendValueSolana(value))
            setRawValue(value)
            setSymbol('KOII')
            setOriginSymbol('KOII')
            setTokenIconPath('img/v2/k2-logos/finnie-k2-logo.svg')
            break
        }
        const account = await popupAccount.getAccount({ address: userAddress })
        const balance = await account.get.balance()
  
        setOriginBalance(balance)
        if (network === 'SOLANA' || network === 'K2') {
          setOriginBalance(balance / 1000000000)
        }
  
        if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
          if (network === 'ETHEREUM') {
            const to = get(transactionPayload, 'to')
            setContractAddress(to) // "to" is contractAddress for eth transaction
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
  
            setRawValue(quantity)
    
            decimal = decimal === 1 ? 0 : decimal
            quantity = quantity / (10 ** decimal)
    
            // if (!logo) logo = 'img/erc20/generic-token.svg'
            if (!logo) logo = customTokenIconPath
    
            setTokenIconPath(logo)
            setSymbol(symbol)
            setValue(quantity)
            setCustomTokenRecipient(customTokenRecipient)
            setBalance(balance / (10 ** decimal))
          }
  
          if (network === 'ARWEAVE') {
            let tags = decodeTags(get(transactionPayload, 'tags'))
            const contractAddress = get(tags, 'Contract')
            setContractAddress(contractAddress)   
            let {
              logo,
              balance,
              price,
              name,
              symbol,
              decimal
            } = await getArweaveTokenData(contractAddress, userAddress)
  
            const input = JSON.parse(tags['Input'])
  
            const customTokenRecipient = get(input, 'target')
            const quantity = get(input, 'qty')
  
            // if (!logo) logo = 'img/erc20/generic-token.svg'
            if (!logo) logo = customTokenIconPath
  
            setTokenIconPath(logo)
            setSymbol(symbol)
            setValue(quantity)
            setRawValue(quantity)
            setCustomTokenRecipient(customTokenRecipient)
            setBalance(balance)
          }

          if (network === 'SOLANA') {
            const contractAddress = get(transactionPayload, 'contractAddress')
            setContractAddress(contractAddress)
            const rawValue = get(transactionPayload, 'value')
            const recipient = get(transactionPayload, 'to')
            const sender = get(transactionPayload, 'from')

            const tokenData = await getSolanaCustomTokensData(contractAddress, sender)

            const rate = 10 ** (tokenData.decimal === 1 ? 0 : tokenData.decimal)

            setTokenIconPath(tokenData.logo)
            setSymbol(tokenData.symbol)
            setValue(rawValue / rate)
            setRawValue(rawValue)
            setCustomTokenRecipient(recipient)
            setBalance(tokenData.balance / rate)
          }

          if (network === 'K2') {
            const contractAddress = get(transactionPayload, 'contractAddress')
            setContractAddress(contractAddress)
            const rawValue = get(transactionPayload, 'value')
            const recipient = get(transactionPayload, 'to')
            const sender = get(transactionPayload, 'from')

            const tokenData = await getSolanaCustomTokensData(contractAddress, sender)

            const rate = 10 ** (tokenData.decimal === 1 ? 0 : tokenData.decimal)

            setTokenIconPath(tokenData.logo)
            setSymbol(tokenData.symbol)
            setValue(rawValue / rate)
            setRawValue(rawValue)
            setCustomTokenRecipient(recipient)
            setBalance(tokenData.balance / rate)
          }
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
      {network === 'ETHEREUM' && !tokenIconPath && <EthereumIcon />}
      {network === 'ARWEAVE' && !tokenIconPath && <ArweaveIcon />}
      {tokenIconPath && <img src={tokenIconPath}/>}
    </>
  )

  return { SendValue, TokenIcon, customTokenRecipient, value, contractAddress, rawValue, balance, symbol, originBalance, originSymbol }
}

export default useSendValue
