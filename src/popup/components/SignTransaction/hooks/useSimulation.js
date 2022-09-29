import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NETWORK } from 'constants/koiConstants'
import get from 'lodash/get'

const useSimulation = ({ network, transactionPayload }) => {
  const fromHexToDecimal = (hexString) => {
    let number = null
    if (hexString) number = parseInt(hexString, 16)

    return number
  }

  const simulateTransaction = async () => {
    const sourceAddress = get(transactionPayload, 'from')
    const recipientAddress = get(transactionPayload, 'to')
    const value = get(transactionPayload, 'value')
    const transactionData = get(transactionPayload, 'data')

    const rawTx = {}
    rawTx.from = sourceAddress
    if (recipientAddress) rawTx.to = recipientAddress
    if (value) rawTx.value = value
    if (transactionData) rawTx.data = transactionData

    console.log('simulateTransaction rawTx', rawTx)
    const requestBody = {
      options: {
        metadata: true
      },
      transaction: {
        to: rawTx.to,
        from: rawTx.from,
        data: rawTx.data,
        value: rawTx.value
      }
    }
    const response = await axios.post(`https://api.sunrise.wtf/api/v1/simulate`, requestBody)
    const simulationData = get(response, 'data.simulation.success')

    if (!simulationData) {
      throw new Error('Failed to simulate transaction', rawTx)
    }

    console.log('simulationData', simulationData)
  }
  useEffect(() => {
    try {
      if (network === NETWORK.ETHEREUM) simulateTransaction()
    } catch (error) {
      console.error(error.message)
    }
  }, [network, transactionPayload])

  return <div>useSimulation</div>
}

export default useSimulation
