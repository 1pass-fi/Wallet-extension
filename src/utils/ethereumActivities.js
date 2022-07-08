export const clarifyEthereumProvider = (provider) => {
  const providerArray = provider.split('/')
  const apiKey = providerArray[4]
  const ethNetwork = providerArray[2]?.split('.')[0]

  return { ethNetwork, apiKey }
}

