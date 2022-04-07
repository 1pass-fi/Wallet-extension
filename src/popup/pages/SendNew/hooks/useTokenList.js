import { useEffect, useState } from 'react'
import { get, isEmpty } from 'lodash'

import { fromArToWinston, fromEthToWei } from 'utils'
import getTokenData from 'utils/getTokenData'

import { popupAccount } from 'services/account'

import useImportedTokenAddresses from 'popup/sharedHooks/useImportedTokenAddresses'
import storage from 'services/storage'

const useTokenList = ({ selectedNetwork, userAddress }) => {
  const [tokenList, setTokenList] = useState([])
  const [ethProvider, setEthProvider] = useState(null)
  const [selectedToken, setSelectedToken] = useState()

  useEffect(() => {
    const loadEthProvider = async () => {
      const provider = await storage.setting.get.ethereumProvider()
      setEthProvider(provider)
    }

    loadEthProvider()
  }, [])

  const { importedTokenAddresses } = useImportedTokenAddresses({
    userAddress,
    currentProviderAddress: ethProvider,
    displayingAccountAddress: userAddress
  })

  const loadArweaveTokens = async (userAddress) => {
    setSelectedToken('KOII')
    const arweaveToken = {}
    const koiiToken = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    arweaveToken.logo = 'example_path'
    arweaveToken.balance = fromArToWinston(get(accountData, 'balance'))
    arweaveToken.price = 40
    arweaveToken.name = 'Arweave'
    arweaveToken.symbol = 'AR'
    arweaveToken.decimal = 12

    koiiToken.logo = 'example_path'
    koiiToken.balance = get(accountData, 'koiBalance')
    koiiToken.price = 0
    koiiToken.name = 'Koii'
    koiiToken.symbol = 'KOII'
    koiiToken.decimal = 0

    return [arweaveToken, koiiToken]
  }

  const loadEthereumTokens = async (userAddress, importedTokenAddresses) => {
    setSelectedToken('ETH')
    const ethereumToken = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    ethereumToken.logo = 'example_path'
    ethereumToken.balance = fromEthToWei(get(accountData, 'balance'))
    ethereumToken.price = 2000
    ethereumToken.name = 'Ether'
    ethereumToken.symbol = 'ETH'
    ethereumToken.decimal = 18

    if (isEmpty(importedTokenAddresses)) {
      return [ethereumToken]
    }

    const customTokenList = await Promise.all(
      importedTokenAddresses?.map(async (tokenAddress) => {
        return await getTokenData(tokenAddress, userAddress)
      })
    )

    return [ethereumToken, ...customTokenList]
  }

  useEffect(() => {
    const loadTokenList = async () => {
      switch (selectedNetwork) {
        case 'TYPE_ETHEREUM':
          setTokenList(await loadEthereumTokens(userAddress, importedTokenAddresses))
          break
        case 'TYPE_ARWEAVE':
          setTokenList(await loadArweaveTokens(userAddress))
      }
    }

    if (selectedNetwork && userAddress) loadTokenList()
  }, [selectedNetwork, userAddress, importedTokenAddresses])

  return { tokenList, selectedToken, setSelectedToken }
}

export default useTokenList
