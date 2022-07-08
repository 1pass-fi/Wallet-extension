import isEmpty from 'lodash/isEmpty'

export const isContractAddress = async (address, provider) => {
  try {
    const code = await provider.getCode(address)

    if (code != '0x') return true
    return false
  } catch (err) {
    console.log(err.message)
    return false
  }
}

export const clarifyEthereumProvider = (provider) => {
  const providerArray = provider.split('/')
  const apiKey = providerArray[4]
  const ethNetwork = providerArray[2]?.split('.')[0]

  return { ethNetwork, apiKey }
}

export const isInteractWithContract = async (activity, provider) => {
  if (isEmpty(activity.to)) return false
  return await isContractAddress(activity.to, provider)
}

export const decodeTransactionData = async (activityHash, interfaceABI, provider) => {
  const tx = await provider.getTransaction(activityHash)
  const decodedInput = interfaceABI.parseTransaction({ data: tx.data, value: tx.value })

  return decodedInput
}
