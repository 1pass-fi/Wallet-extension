import React, { useState, useEffect } from 'react'
import { get, isNumber } from 'lodash'
import Web3 from 'web3'

import storage from 'services/storage'
import { numberFormat } from 'utils'
import arweave from 'services/arweave'

const fromHexToDecimal = (hexString) => {
  let number = null
  if (hexString) number = parseInt(hexString, 16)

  return number
}

const fromWeiToEth = (wei) => {
  return wei / 1000000000000000000
}

const useGetFee = ({ network, transactionPayload }) => {
  const [totalFee, setTotalFee] = useState('------')
  const [tokenSymbol, setTokenSymbol] = useState('------')

  const getEthFee = async () => {
    const provider = await storage.setting.get.ethereumProvider()
    const web3 = new Web3(provider)

    const sourceAddress = get(transactionPayload, 'from')
    const recipientAddress = get(transactionPayload, 'to')
    const value = fromHexToDecimal(get(transactionPayload, 'value'))
    const transactionData = get(transactionPayload, 'data')
    const estimatedGas = get(transactionPayload, 'gas')
    const maxFeePerGas = get(transactionPayload, 'maxFeePerGas')
    const maxPriorityFeePerGas = get(transactionPayload, 'maxPriorityFeePerGas')

    const rawTx = {}
    rawTx.from = sourceAddress
    if (recipientAddress) rawTx.to = recipientAddress
    if (value) rawTx.value = value
    if (transactionData) rawTx.data = transactionData
    if (maxFeePerGas) rawTx.maxFeePerGas = maxFeePerGas
    if (maxPriorityFeePerGas) rawTx.maxPriorityFeePerGas = maxPriorityFeePerGas

    console.log('rawTx', rawTx)

    const gasPrice = await web3.eth.getGasPrice()
    const gasUsed = await web3.eth.estimateGas(rawTx)

    console.log('gasPrice', gasPrice)

    const gasFee = gasUsed * gasPrice
    setTotalFee(fromWeiToEth(gasFee))
    setTokenSymbol('ETH')
  }

  const getArFee = async () => {
    const rawTx = {}

    const recipientAddress = get(transactionPayload, 'to')
    const value = get(transactionPayload, 'value')
    const transactionData = get(transactionPayload, 'data')

    if (recipientAddress) rawTx.target = recipientAddress
    if (isNumber(value)) rawTx.quantity = value.toString()
    if (transactionData) rawTx.data = Buffer.from(transactionData)

    const transaction = await arweave.createTransaction(rawTx)
    let fee = await arweave.transactions.getPrice(transaction.data_size)
    fee = fee / 1000000000000
    
    setTotalFee(fee)
    setTokenSymbol('AR')
  }

  useEffect(() => {
    const load = () => {
      if (network === 'ETHEREUM') {
        getEthFee()
        setInterval(() => {
          getEthFee()
        }, 3000)
      }
      if (network === 'ARWEAVE') getArFee()
    }

    if (transactionPayload && network) load()
  }, [transactionPayload, network])

  const Fee = () => (
    <div>
      {isNumber(totalFee) ? numberFormat(totalFee, 8) : totalFee} {tokenSymbol}
    </div>
  )

  return [Fee, totalFee, tokenSymbol]
}

export default useGetFee
