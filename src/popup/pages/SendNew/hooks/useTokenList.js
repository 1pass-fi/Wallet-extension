import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get, isEmpty } from 'lodash'
import useNetworkLogo from 'popup/provider/hooks/useNetworkLogo'
import useImportedTokenAddresses from 'popup/sharedHooks/useImportedTokenAddresses'
import { popupAccount } from 'services/account'
import storage from 'services/storage'
import { fromArToWinston, fromEthToWei, fromSolToLamp } from 'utils'
import getTokenData from 'utils/getTokenData'
import { getK2CustomTokensData, getSolanaCustomTokensData } from 'utils/getTokenData'

const useTokenList = ({ selectedNetwork, selectedAccount }) => {
  const userAddress = selectedAccount?.address
  const [tokenList, setTokenList] = useState([])
  const [ethProvider, setEthProvider] = useState(null)
  const [selectedToken, setSelectedToken] = useState()

  const networkMetadata = useSelector((state) => state.networkMetadata)
  const { networkLogoPath } = useNetworkLogo({ networkName: get(networkMetadata, 'networkName') })

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
    displayingAccount: selectedAccount
  })

  const loadArweaveTokens = async (userAddress) => {
    const arweaveToken = {}
    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    arweaveToken.logo = 'img/erc20/AR.svg'
    arweaveToken.balance = fromArToWinston(get(accountData, 'balance'))
    arweaveToken.price = 40
    arweaveToken.name = 'Arweave'
    arweaveToken.symbol = 'AR'
    arweaveToken.decimal = 12

    setSelectedToken(arweaveToken)
    return [arweaveToken]
  }

  const loadEthereumTokens = async (userAddress, importedTokenAddresses) => {
    const ethereumToken = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    ethereumToken.logo = networkLogoPath
    ethereumToken.balance = fromEthToWei(get(accountData, 'balance'))
    ethereumToken.price = 2000
    ethereumToken.name = 'Ether'
    ethereumToken.symbol = get(networkMetadata, 'currencySymbol')
    ethereumToken.decimal = 18
    setSelectedToken(ethereumToken)

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

  const loadSolanaTokens = async (userAddress, importedTokenAddresses) => {
    const solanaToken = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    solanaToken.logo = 'img/v2/solana-logo.svg'
    solanaToken.balance = get(accountData, 'balance')
    solanaToken.price = 40
    solanaToken.name = 'Solana'
    solanaToken.symbol = 'SOL'
    solanaToken.decimal = 9
    setSelectedToken(solanaToken)

    if (isEmpty(importedTokenAddresses)) {
      return [solanaToken]
    }

    const customTokenList = await Promise.all(
      importedTokenAddresses?.map(async (tokenAddress) => {
        return await getSolanaCustomTokensData(tokenAddress, userAddress)
      })
    )

    return [solanaToken, ...customTokenList]
  }

  const loadK2Tokens = async (userAddress, importedTokenAddresses) => {
    const k2Token = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    k2Token.logo = 'img/v2/k2-logos/finnie-k2-logo.svg'
    k2Token.balance = get(accountData, 'balance')
    k2Token.price = 0
    k2Token.name = 'Koii'
    k2Token.symbol = 'KOII'
    k2Token.decimal = 9
    setSelectedToken(k2Token)

    /* TODO DatH Custom token K2 */
    // if (isEmpty(importedTokenAddresses)) {
    //   return [k2Token]
    // }

    // const customTokenList = await Promise.all(
    //   importedTokenAddresses?.map(async (tokenAddress) => {
    //     return await getK2CustomTokensData(tokenAddress, userAddress)
    //   })
    // )
    const tokenList = await storage.setting.get.displayedImportedTokens()
    // return [k2Token, ...customTokenList]
    console.log('tokenList:', tokenList)
    return tokenList
  }

  useEffect(() => {
    const loadTokenList = async () => {
      setTokenList([])
      let result = []
      switch (selectedNetwork) {
        case 'TYPE_ETHEREUM':
          result = await loadEthereumTokens(userAddress, importedTokenAddresses)
          break
        case 'TYPE_ARWEAVE':
          result = await loadArweaveTokens(userAddress)
          break
        case 'TYPE_SOLANA':
          result = await loadSolanaTokens(userAddress, importedTokenAddresses)
          break
        case 'K2':
          result = await loadK2Tokens(userAddress, importedTokenAddresses)
          break
      }
      setTokenList(result)
    }

    if (selectedNetwork && userAddress) loadTokenList()
  }, [importedTokenAddresses])

  return { tokenList, selectedToken, setSelectedToken }
}

export default useTokenList
