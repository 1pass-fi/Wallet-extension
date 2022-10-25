import { useEffect, useState } from 'react'
import { TYPE } from 'constants/accountConstants'
import { get, isEmpty } from 'lodash'
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
    const koiiToken = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    arweaveToken.logo = 'img/erc20/AR.svg'
    arweaveToken.balance = fromArToWinston(get(accountData, 'balance'))
    arweaveToken.price = 40
    arweaveToken.name = 'Arweave'
    arweaveToken.symbol = 'AR'
    arweaveToken.decimal = 12

    koiiToken.logo = 'img/erc20/KOII.svg'
    koiiToken.balance = get(accountData, 'koiBalance')
    koiiToken.price = 0
    koiiToken.name = 'Koii'
    koiiToken.symbol = 'KOII'
    koiiToken.decimal = 0
    koiiToken.contractAddress = 'QA7AIFVx1KBBmzC7WUNhJbDsHlSJArUT0jWrhZMZPS8'

    setSelectedToken(koiiToken)
    return [arweaveToken, koiiToken]
  }

  const loadEthereumTokens = async (userAddress, importedTokenAddresses) => {
    const ethereumToken = {}

    const account = await popupAccount.getAccount({ address: userAddress })
    const accountData = await account.get.metadata()

    ethereumToken.logo = 'img/erc20/ETH.svg'
    ethereumToken.balance = fromEthToWei(get(accountData, 'balance'))
    ethereumToken.price = 2000
    ethereumToken.name = 'Ether'
    ethereumToken.symbol = 'ETH'
    ethereumToken.decimal = 18
    setSelectedToken(ethereumToken)

    if (isEmpty(importedTokenAddresses) || importedTokenAddresses.tokenType !== TYPE.ETHEREUM) {
      return [ethereumToken]
    }

    const customTokenList = await Promise.all(
      importedTokenAddresses?.addresses?.map(async (tokenAddress) => {
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

    if (isEmpty(importedTokenAddresses) || importedTokenAddresses.tokenType !== TYPE.SOLANA) {
      return [solanaToken]
    }

    const customTokenList = await Promise.all(
      importedTokenAddresses?.addresses?.map(async (tokenAddress) => {
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
    if (isEmpty(importedTokenAddresses) || importedTokenAddresses.tokenType !== TYPE.K2) {
      return [k2Token]
    }

    const customTokenList = await Promise.all(
      importedTokenAddresses?.addresses?.map(async (tokenAddress) => {
        return await getK2CustomTokensData(tokenAddress, userAddress)
      })
    )

    return [k2Token, ...customTokenList]
  }

  useEffect(() => {
    const loadTokenList = async () => {
      switch (selectedNetwork) {
        case 'TYPE_ETHEREUM':
          setTokenList(await loadEthereumTokens(userAddress, importedTokenAddresses))
          break
        case 'TYPE_ARWEAVE':
          setTokenList(await loadArweaveTokens(userAddress))
          break
        case 'TYPE_SOLANA':
          setTokenList(await loadSolanaTokens(userAddress, importedTokenAddresses))
          break
        case 'K2':
          console.log('TYPE_K2 ========== loadK2Tokens')
          setTokenList(await loadK2Tokens(userAddress, importedTokenAddresses))
          break
      }
    }

    if (selectedNetwork && userAddress) loadTokenList()
  }, [selectedNetwork, userAddress, importedTokenAddresses])

  return { tokenList, selectedToken, setSelectedToken }
}

export default useTokenList
