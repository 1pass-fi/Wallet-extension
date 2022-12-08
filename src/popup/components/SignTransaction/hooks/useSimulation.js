import React, { useEffect, useState } from 'react'
import axiosAdapter from '@vespaiach/axios-fetch-adapter'
import axios from 'axios'
import { NETWORK } from 'constants/koiConstants'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { TRANSACTION_METHOD } from 'popup/components/SignTransaction/hooks/constants'

const useSimulation = ({ network, transactionPayload }) => {
  const [simulationData, setSimulationData] = useState({})
  const fromHexToDecimal = (hexString) => {
    let number = null
    if (hexString) number = parseInt(hexString, 16)

    return number
  }

  const classifyTransaction = (sunriseResponse) => {
    let simulationData = {}
    const successData = get(sunriseResponse, 'data.simulation.success')
    if (!successData) return null

    const metadata = get(sunriseResponse, 'data.metadata')
    if (!isEmpty(get(successData, 'erc1155'))) {
      // TODO LongP simulation
      return simulationData
    }
    if (!isEmpty(get(successData, 'erc20'))) {
      const ercData = get(successData, 'erc20')
      const addressInfo = Object.keys(ercData)[0]
      const receiveTokenData = Object.values(ercData)[0][0]

      simulationData.type = TRANSACTION_METHOD.TOKEN_TRANSFER
      simulationData.data = {
        givenTokenAmount: fromHexToDecimal(get(successData, 'native[0].amount')),
        receiveTokenAmount: fromHexToDecimal(get(receiveTokenData, 'transfer.amount')),
        tokenInfo: get(metadata, `erc20.${addressInfo}`)
      }

      return simulationData
    }
    if (!isEmpty(get(successData, 'erc721'))) {
      const ercData = get(successData, 'erc721')
      const addressInfo = Object.keys(ercData)[0]
      const nftInfo = get(metadata, `nft.${addressInfo}`)

      simulationData.type = TRANSACTION_METHOD.MINT_COLLECTIBLES
      simulationData.data = {
        givenTokenAmount: fromHexToDecimal(get(successData, 'native[0].amount')),
        nftInfo: nftInfo,
        nft: Object.values(get(nftInfo, 'nfts'))[0]
      }

      return simulationData
    }
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
    const response = await axios.post(`https://api.sunrise.wtf/api/v1/simulate`, requestBody, {
      adapter: axiosAdapter
    })

    // detect the transaction types based on Sunrise successful response
    const simulationData = classifyTransaction(response)
    if (!simulationData) {
      console.error('Failed to simulate transaction', rawTx)
      return
    }
    setSimulationData(simulationData)
  }

  /* 
    Sunrise API has been down
    Hard return empty object while looking for substitute vendor
  */
  useEffect(() => {
    try {
      // if (network === NETWORK.ETHEREUM) simulateTransaction()
    } catch (error) {
      console.error(error.message)
    }
  }, [network, transactionPayload])

  return { simulationData }
}

export default useSimulation
