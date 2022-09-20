import { useEffect, useState } from 'react'
import { TYPE } from 'constants/accountConstants'
import { isEmpty } from 'lodash'
import { popupAccount } from 'services/account'
import useImportedTokenAddresses from 'sharedHooks/useImportedTokenAddresses'
import {
  fiatCurrencyFormat,
  fromArToWinston,
  fromEthToWei,
  fromLampToSol,
  fromSolToLamp,
  numberFormat
} from 'utils'
import getTokenData, { getK2CustomTokensData, getSolanaCustomTokensData } from 'utils/getTokenData'

const useTokenLists = ({ account, address, setIsLoading, currentProviderAddress }) => {
  const [tokenList, setTokenList] = useState([])

  let { importedTokenAddresses } = useImportedTokenAddresses({
    userAddress: address,
    currentProviderAddress
  })

  useEffect(() => {
    const loadTokenList = async () => {
      try {
        setIsLoading && setIsLoading((prev) => ++prev)
        const account = await popupAccount.getAccount({ address })
        if (isEmpty(account)) throw new Error('Get account failed.')

        const accountType = await account.get.type()
        const balance = (await account.get.balance()) || 0
        const koiBalance = (await account.get.koiBalance()) || 0
        const price = (await account.get.price) || {
          AR: 0,
          ETH: 0,
          SOL: 0
        }

        let _tokenList = []
        switch (accountType) {
          case TYPE.ARWEAVE:
            _tokenList = [
              {
                name: 'Arweave',
                balance: numberFormat(fromArToWinston(balance)),
                displayingBalance: numberFormat(balance),
                symbol: 'AR',
                usdValue: fiatCurrencyFormat(balance * price.AR),
                decimal: 12
              },
              {
                name: 'KOII',
                balance: numberFormat(koiBalance),
                displayingBalance: numberFormat(koiBalance),
                symbol: 'KOII',
                decimal: 0
              }
            ]
            break
          case TYPE.ETHEREUM:
            _tokenList = [
              {
                name: 'Ethereum',
                balance: numberFormat(fromEthToWei(balance)),
                displayingBalance: numberFormat(balance),
                usdValue: fiatCurrencyFormat(balance * price.ETH),
                symbol: 'ETH',
                decimal: 18
              }
            ]
            await Promise.all(
              importedTokenAddresses.map(async (contractAddress) => {
                let token = await getTokenData(contractAddress, address)
                token = { ...token, displayingBalance: token.balance / Math.pow(10, token.decimal) }
                if (token.price) {
                  token = {
                    ...token,
                    usdValue: fiatCurrencyFormat(
                      (token.balance / Math.pow(10, token.decimal)) * token.price
                    )
                  }
                }
                _tokenList.push(token)
              })
            )
            break
          case TYPE.SOLANA:
            _tokenList = [
              {
                name: 'Solana',
                balance,
                displayingBalance: numberFormat(fromLampToSol(balance)),
                symbol: 'SOL',
                usdValue: fiatCurrencyFormat(fromLampToSol(balance) * price.SOL),
                decimal: 9
              }
            ]

            await Promise.all(
              importedTokenAddresses.map(async (contractAddress) => {
                let token = await getSolanaCustomTokensData(contractAddress, address)
                token = { ...token, displayingBalance: token.balance / Math.pow(10, token.decimal) }
                if (token.price) {
                  token = {
                    ...token,
                    usdValue: fiatCurrencyFormat(
                      (token.balance / Math.pow(10, token.decimal)) * token.price
                    )
                  }
                }
                _tokenList.push(token)
              })
            )
            break
          case TYPE.K2:
            _tokenList = [
              {
                name: 'KOII',
                balance,
                displayingBalance: numberFormat(fromLampToSol(balance)),
                symbol: 'KOII',
                // usdValue: fiatCurrencyFormat(fromLampToSol(balance) * price.K2),
                decimal: 9
              }
            ]

            await Promise.all(
              importedTokenAddresses.map(async (contractAddress) => {
                let token = await getK2CustomTokensData(contractAddress, address)
                token = { ...token, displayingBalance: token.balance / Math.pow(10, token.decimal) }
                if (token.price) {
                  token = {
                    ...token,
                    usdValue: fiatCurrencyFormat(
                      (token.balance / Math.pow(10, token.decimal)) * token.price
                    )
                  }
                }
                _tokenList.push(token)
              })
            )
            break
        }

        setTokenList(_tokenList)
      } catch (err) {
        console.error('Load token failed: ', err)
      } finally {
        setIsLoading && setIsLoading((prev) => --prev)
      }
    }

    if (!isEmpty(address)) loadTokenList()
  }, [account, address, importedTokenAddresses])

  return { tokenList }
}

export default useTokenLists
