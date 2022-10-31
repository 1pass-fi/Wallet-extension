import { ethers } from 'ethers'
import isString from 'lodash/isString'

import initEthersProvider from './initEthersProvider'

const maxFeePerGasFormular = (baseFee, priorityFee) => {
  return baseFee * 2 + priorityFee
}

/**
 * 
 * @param {String} providerUrl
 * @param {String} maxPriorityFeePerGas 
 */
const calculateMaxFeePerGas = async (providerUrl, maxPriorityFeePerGas) => {
  try {
    const { ethersProvider } = initEthersProvider(providerUrl)
    
    const baseFee = (await ethersProvider.getBlock('latest')).baseFeePerGas.toNumber()
    if (!isString) maxPriorityFeePerGas = `${maxPriorityFeePerGas}`
    maxPriorityFeePerGas = Number(ethers.utils.parseUnits(maxPriorityFeePerGas, 'gwei'))

    return maxFeePerGasFormular(baseFee, maxPriorityFeePerGas)
  } catch (err) {
    console.error(err)
    return NaN
  }
}

export default calculateMaxFeePerGas
