import { ethers } from 'ethers'
import isString from 'lodash/isString'

import initEthersProvider from './initEthersProvider'

/**
 * 
 * @param {ethers.BigNumber} baseFee 
 * @param {ethers.BigNumber} priorityFee 
 * @returns 
 */
const maxFeePerGasFormular = (baseFee, priorityFee) => {
  return priorityFee.add(baseFee.mul('2'))
}

/**
 *
 * @param {String} providerUrl
 * @param {ethers.BigNumber} maxPriorityFeePerGas
 */
const calculateMaxFeePerGas = async (providerUrl, maxPriorityFeePerGas) => {
  try {
    const { ethersProvider } = initEthersProvider(providerUrl)

    const baseFee = (await ethersProvider.getBlock('latest')).baseFeePerGas

    return maxFeePerGasFormular(baseFee, maxPriorityFeePerGas)
  } catch (err) {
    console.error(err)
    return NaN
  }
}

export default calculateMaxFeePerGas
