import React, { useEffect,useState } from 'react'
import { get, isNumber } from 'lodash'
import storage from 'services/storage'
import { numberFormat } from 'utils'
import ethereumUtils from 'utils/ethereumUtils'
import Web3 from 'web3'


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
  const [getFeeInterval, setGetFeeInterval] = useState(null)

  const getEthFee = async () => {
    const provider = await storage.setting.get.ethereumProvider()
    const { ethersProvider } = ethereumUtils.initEthersProvider(provider)

    const sourceAddress = get(transactionPayload, 'from')
    const recipientAddress = get(transactionPayload, 'to')
    const value = fromHexToDecimal(get(transactionPayload, 'value'))
    const transactionData = get(transactionPayload, 'data')
    const maxFeePerGas = get(transactionPayload, 'maxFeePerGas')
    const maxPriorityFeePerGas = get(transactionPayload, 'maxPriorityFeePerGas')

    const rawTx = {}
    rawTx.from = sourceAddress
    if (recipientAddress) rawTx.to = recipientAddress
    if (value) rawTx.value = value.toString()
    if (transactionData) rawTx.data = transactionData
    if (maxFeePerGas) rawTx.maxFeePerGas = maxFeePerGas
    if (maxPriorityFeePerGas) rawTx.maxPriorityFeePerGas = maxPriorityFeePerGas

    const gasUsed = await ethersProvider.estimateGas(rawTx)
    const gasFee = gasUsed * maxFeePerGas
    setTotalFee(fromWeiToEth(gasFee))
    setTokenSymbol('ETH')
  }

  useEffect(() => {
    const load = () => {
      try {
        getEthFee()
        setGetFeeInterval(
          setInterval(() => {
            getEthFee()
          }, 3000)
        )
      } catch (err) {
        console.error('get fee error: ', err.message)
      }
    }

    if (transactionPayload && network) load()
  }, [transactionPayload, network])

  const Fee = () => (
    <div>
      {isNumber(totalFee) ? numberFormat(totalFee, 8) : totalFee} {tokenSymbol}
    </div>
  )

  return { Fee, totalFee, tokenSymbol, getFeeInterval }
}

export default useGetFee
