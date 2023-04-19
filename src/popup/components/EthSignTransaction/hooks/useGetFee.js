import React, { useEffect, useMemo, useState } from 'react'
import { get, isNumber } from 'lodash'
import storage from 'services/storage'
import { numberFormat } from 'utils'
import ethereumUtils from 'utils/ethereumUtils'

const fromHexToDecimal = (hexString) => {
  let number = null
  if (hexString) number = parseInt(hexString, 16)

  return number
}

const useGetFee = ({
  network,
  transactionPayload,
  baseFee,
  maxPriorityFeePerGas,
  setMaxPriorityFeePerGas,
  maxFeePerGas,
  setMaxFeePerGas,
  isFixedMaxFeePerGas,
  setIsFixedMaxFeePerGas
}) => {
  const [gasLimit, setGasLimit] = useState(0)

  const initFeeData = async () => {
    const sourceAddress = get(transactionPayload, 'from')
    const recipientAddress = get(transactionPayload, 'to')
    const value = fromHexToDecimal(get(transactionPayload, 'value'))
    const transactionData = get(transactionPayload, 'data')
    let presetMaxFeePerGas = get(transactionPayload, 'maxFeePerGas') // -> null
    let presetMaxPriorityFeePerGas = get(transactionPayload, 'maxPriorityFeePerGas') || 2500000000

    setIsFixedMaxFeePerGas(!!presetMaxFeePerGas)
    setMaxFeePerGas(presetMaxFeePerGas)
    setMaxPriorityFeePerGas(presetMaxPriorityFeePerGas)

    const rawTx = {}
    rawTx.from = sourceAddress
    if (recipientAddress) rawTx.to = recipientAddress
    if (value) rawTx.value = value.toString()
    if (transactionData) rawTx.data = transactionData
    if (maxFeePerGas) rawTx.maxFeePerGas = maxFeePerGas
    if (maxPriorityFeePerGas) rawTx.maxPriorityFeePerGas = maxPriorityFeePerGas
    
    const providerUrl = await storage.setting.get.ethereumProvider()
    const { ethersProvider } = await ethereumUtils.initEthersProvider(providerUrl)
    const gasUsed = await ethersProvider.estimateGas(rawTx)

    setGasLimit(gasUsed.toNumber())
  }

  /* Max Fee to display */
  const maxFee = useMemo(() => {
    if (!baseFee || !gasLimit) return '------'

    let calculatedMaxFee
    if (isFixedMaxFeePerGas) calculatedMaxFee = maxFeePerGas * gasLimit
    else calculatedMaxFee = (maxPriorityFeePerGas + baseFee * 2) * gasLimit

    return calculatedMaxFee / Math.pow(10, 18)
  }, [gasLimit, baseFee, maxPriorityFeePerGas, isFixedMaxFeePerGas, maxFeePerGas])

  /* Estimated Fee to display */
  const estimatedFee = useMemo(() => {
    if (!baseFee || !gasLimit) return '------'

    return ((maxPriorityFeePerGas + baseFee) * gasLimit) / Math.pow(10, 18)
  }, [gasLimit, baseFee, maxPriorityFeePerGas])

  useEffect(() => {
    if (transactionPayload && network) {
      initFeeData()
    }
  }, [transactionPayload, network])

  useEffect(() => {
    if (isFixedMaxFeePerGas) return
    setMaxFeePerGas(maxPriorityFeePerGas + baseFee * 2)
  }, [maxPriorityFeePerGas, baseFee, isFixedMaxFeePerGas])

  const Fee = () => (
    <div>
      <div>{isNumber(estimatedFee) ? numberFormat(estimatedFee, 8) : estimatedFee} ETH</div>
      <div>({chrome.i18n.getMessage('maxFee')}: {numberFormat(maxFee, 8)} ETH)</div>
    </div>
  )

  return { Fee, maxFee, estimatedFee, gasLimit }
}

export default useGetFee
