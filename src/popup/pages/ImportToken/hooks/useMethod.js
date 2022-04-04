import storage from 'services/storage'
import { get, includes, filter } from 'lodash'

const useMethod = ({ contractAddress, userAddresses = [] }) => {
  const importNewToken = async () => {
    const importedTokens = await storage.setting.get.importedErc20Tokens()
    if (!get(importedTokens, contractAddress)) importedTokens[contractAddress] = []

    userAddresses.forEach((userAddress) => {
      if (!includes(importedTokens[contractAddress], userAddress))
        importedTokens[contractAddress].push(userAddress)
    })

    await storage.setting.set.importedErc20Tokens(importedTokens)
  }

  const removeToken = async () => {
    const importedTokens = await storage.setting.get.importedErc20Tokens()
    const addresses = get(importedTokens, contractAddress)
    filter(addresses, (address) => address !== userAddress)
  }

  return { importNewToken, removeToken }
}

export default useMethod
