import { useEffect } from 'react'
import { get } from 'lodash'

import { fromArToWinston, fromEthToWei } from 'utils'
import getTokenData from 'utils/getTokenData'

import { popupAccount } from 'services/account'

import useImportedTokenAddresses from 'popup/sharedHooks/useImportedTokenAddresses'
import storage from 'services/storage'

const useTokenList = ({ selectedNetwork, userAddress }) => {
  const [tokenList, setTokenList] = useState([])
  const [ethProvider, setEthProvider] = useState(null)

  const loadArweaveTokens = async (userAddress) => {
    const arweaveToken = {}
    const koiiToken = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    arweaveToken.icon = 'example_path'
    arweaveToken.balance = fromArToWinston(get(accountData, 'balance'))
    arweaveToken.price = 40
    arweaveToken.name = 'Arweave'
    arweaveToken.symbol = 'AR'
    arweaveToken.decimal = 12

    koiiToken.icon = 'example_path'
    koiiToken.balance = get(accountData, 'koiBalance')
    koiiToken.price = 0
    koiiToken.name = 'Koii'
    koiiToken.symbol = 'KOII'
    koiiToken.decimal = 1

    return [arweaveToken, koiiToken]
  }

  const loadEthereumTokens = async (userAddress, importedTokenAddresses) => {
    const ethereumToken = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    ethereumToken.icon = 'example_path'
    ethereumToken.balance = fromEthToWei(get(accountData, 'balance'))
    ethereumToken.price = 2000
    ethereumToken.name = 'Ether'
    ethereumToken.symbol = 'ETH'
    ethereumToken.decimal = 1000000000000000000

    const customTokenList = await Promise.all(importedTokenAddresses.map(async tokenAddress => {
      return await getTokenData(tokenAddress, userAddress)
    }))

    return [ethereumToken, ...customTokenList]
  }

  const importedTokenAddresses = useImportedTokenAddresses({ userAddress, currentProviderAddress: ethProvider })


  useEffect(() => {
    const loadEthProvider = async () => {
      const provider = await storage.setting.get.ethereumProvider()
      setEthProvider(provider)  
    }

    loadEthProvider()
  }, [])

  useEffect(() => {
    const loadTokenList = async () => {
      switch (selectedNetwork) {
        case 'TYPE_ETHEREUM':
          loadEthereumTokens()
          break
        case 'TYPE_ARWEAVE':
          loadArweaveTokens()
      }
    }

    if (selectedNetwork && userAddress) loadTokenList()
  }, [selectedNetwork, userAddress])
}

export default useTokenList
