import isEmpty from 'lodash/isEmpty'
import { ethers } from 'ethers'

import storage from 'services/storage'
import ERC20ABI from 'services/account/Account/Chains/Ethereum/abi/ERC20ABI.json'

export const clarifyEthereumProvider = (ethProvider) => {
  try {
    let ethNetwork, apiKey
    const providerArray = ethProvider.split('/')
    apiKey = providerArray[4]
    ethNetwork = providerArray[2].split('.')[0]
    return { ethNetwork, apiKey }
  } catch (err) {
    console.error('Failed to clarify Ethereum Provider - error: ', err.message)
    return { ethNetwork: 'mainnet', apiKey: 'f811f2257c4a4cceba5ab9044a1f03d2' }
  }
}

export const isContractAddress = async (address) => {
  const provider = await storage.setting.get.ethereumProvider()
  const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)
  const network = ethers.providers.getNetwork(ethNetwork)
  const web3 = new ethers.providers.InfuraProvider(network, apiKey)

  try {
    const code = await web3.getCode(address)
    return code !== '0x'
  } catch (err) {
    console.log('Failed to get code', code)
    return false
  }
}

export const isInteractWithContract = async (activity) => {
  if (isEmpty(activity.to)) return false
  return await isContractAddress(activity.to)
}

export const decodeTransactionData = async (activityHash) => {
  const interfaceABI = new ethers.utils.Interface(ERC20ABI)

  const provider = await storage.setting.get.ethereumProvider()
  const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)
  const network = ethers.providers.getNetwork(ethNetwork)
  const web3 = new ethers.providers.InfuraProvider(network, apiKey)

  const tx = await web3.getTransaction(activityHash)
  const decodedInput = interfaceABI.parseTransaction({ data: tx.data, value: tx.value })

  return decodedInput
}
