import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import K2Icon from 'img/v2/k2-logos/finnie-k2-logo.svg'
import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import SolanaIcon from 'img/v2/solana-logo.svg'
import get from 'lodash/get'
import { setIsLoading } from 'popup/actions/loading'
import useNetworkLogo from 'popup/provider/hooks/useNetworkLogo'
// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'
// hooks
import useImportedTokenAddresses from 'popup/sharedHooks/useImportedTokenAddresses'
import storage from 'services/storage'
import { useEvmNetworkMetadata } from 'sharedHooks/useNetworkMetaData'
import { fiatCurrencyFormat, numberFormat } from 'utils'
import { fromArToWinston, fromEthToWei } from 'utils'
// utils
import getTokenData, { getK2CustomTokensData, getSolanaCustomTokensData } from 'utils/getTokenData'
import k2Contracts from 'utils/k2-contracts.json'


const Tokens = ({ currentProviderAddress, currency }) => {
  const dispatch = useDispatch()

  const displayingAccount = useSelector(getDisplayingAccount)
  const price = useSelector((state) => state.price)
  const networkMetadata = useSelector(state => state.networkMetadata)
  const { networkLogo, networkLogoPath } = useNetworkLogo({networkName: get(networkMetadata, 'networkName')})

  let { importedTokenAddresses } = useImportedTokenAddresses({
    userAddress: displayingAccount.address,
    currentProviderAddress,
    displayingAccount: displayingAccount
  })

  const [tokens, setTokens] = useState([])

  const customTokenIconPath = useMemo(
    () => `img/v2/custom-tokens/custom-token-${Math.floor(Math.random() * 5)}.svg`,
    []
  )

  const fireTokenIconPath = useMemo(
    () => `img/v2/FIRE-logo-3.png`,
    []
  )

  const loadTokenList = async () => {
    console.log('===============loadTokenList===============', displayingAccount.type)
    try {
      dispatch(setIsLoading(true))
      if (displayingAccount.type === TYPE.ARWEAVE) {
        setTokens([
          {
            name: 'Arweave',
            balance: numberFormat(fromArToWinston(displayingAccount.balance)),
            displayingBalance: numberFormat(displayingAccount.balance),
            symbol: 'AR',
            usdValue: fiatCurrencyFormat(displayingAccount.balance * price.AR),
            decimal: 12
          },
          /* This code block is creating an object representing a token called "KOII 1st Testnet". It
          includes properties such as the token's name, balance, symbol, and decimal. The
          `numberFormat` function is used to format the balance and displayingBalance values. The
          decimal value is set to 0, indicating that the token does not have any decimal places. */
          // {
          //   name: 'KOII 1st Testnet',
          //   balance: numberFormat(displayingAccount.koiBalance),
          //   displayingBalance: numberFormat(displayingAccount.koiBalance),
          //   symbol: 'KOII',
          //   decimal: 0
          // }
        ])
        return
      } else if (displayingAccount.type === TYPE.K2) {
        // TODO DatH - LongP
        const fireTokenMetadata = k2Contracts.find((token) => token.symbol === 'FIRE')
        const fireTokenContractAddress = fireTokenMetadata.address
        console.log('fireTokenContractAddress:', fireTokenContractAddress)
        const fireToken = await getK2CustomTokensData(fireTokenContractAddress, displayingAccount.address)
        console.log(fireToken)
        const importTokens = (fireToken.balance && !importedTokenAddresses.includes(fireTokenContractAddress)) ? [
          {
            name: 'KOII',
            balance: displayingAccount.balance,
            displayingBalance: numberFormat(displayingAccount.balance / Math.pow(10, 9)),
            symbol: 'KOII',
            decimal: 9,
            logo: 'img/v2/k2-logos/finnie-k2-logo.svg'
          },
          {
            ...fireToken,
            displayingBalance: fireToken.balance / Math.pow(10, fireToken.decimal)
          }
        ] : [
          {
            name: 'KOII',
            balance: displayingAccount.balance,
            displayingBalance: numberFormat(displayingAccount.balance / Math.pow(10, 9)),
            symbol: 'KOII',
            decimal: 9
          }
        ] 
        console.log('importedTokenAddress', importedTokenAddresses)
        await Promise.all(
          importedTokenAddresses.map(async (contractAddress) => {
            let token = await getK2CustomTokensData(contractAddress, displayingAccount.address)
            token = { ...token, displayingBalance: token.balance / Math.pow(10, token.decimal) }
            console.log('Token:', token)
            if (token.price) {
              token = {
                ...token,
                usdValue: fiatCurrencyFormat(
                  (token.balance / Math.pow(10, token.decimal)) * token.price
                )
              }
            }
            importTokens.push(token)
          })
        )
        await storage.setting.set.displayedImportedTokens(importTokens)
        setTokens(importTokens)
      } else if (displayingAccount.type === TYPE.SOLANA) {
        const importTokens = [
          {
            name: 'Solana',
            balance: numberFormat(displayingAccount.balance / Math.pow(10, 9)),
            displayingBalance: numberFormat(displayingAccount.balance / Math.pow(10, 9)),
            symbol: 'SOL',
            usdValue: fiatCurrencyFormat((displayingAccount.balance * price.SOL) / Math.pow(10, 9)),
            decimal: 9
          }
        ]

        await Promise.all(
          importedTokenAddresses.map(async (contractAddress) => {
            let token = await getSolanaCustomTokensData(contractAddress, displayingAccount.address)
            token = { ...token, displayingBalance: token.balance / Math.pow(10, token.decimal) }
            if (token.price) {
              token = {
                ...token,
                usdValue: fiatCurrencyFormat(
                  (token.balance / Math.pow(10, token.decimal)) * token.price
                )
              }
            }
            importTokens.push(token)
          })
        )

        setTokens(importTokens)
      } else if (displayingAccount.type === TYPE.ETHEREUM) {
        const importTokens = [
          {
            name: get(networkMetadata, 'networkName'),
            balance: numberFormat(fromEthToWei(displayingAccount.balance)),
            displayingBalance: numberFormat(displayingAccount.balance),
            usdValue: fiatCurrencyFormat(displayingAccount.balance * price.ETH),
            symbol: get(networkMetadata, 'currencySymbol'),
            decimal: 18,
            logo: networkLogoPath
          }
        ]
        await Promise.all(
          importedTokenAddresses.map(async (contractAddress) => {
            let token = await getTokenData(contractAddress, displayingAccount.address)
            token = { ...token, displayingBalance: token.balance / Math.pow(10, token.decimal) }
            if (token.price) {
              token = {
                ...token,
                usdValue: fiatCurrencyFormat(
                  (token.balance / Math.pow(10, token.decimal)) * token.price
                )
              }
            }
            importTokens.push(token)
          })
        )
        setTokens(importTokens)
      }
    } catch (error) {
      console.log('Failed to load Token list: ', error.message)
    } finally {
      dispatch(setIsLoading(false))
    }
  }

  useEffect(() => {
    importedTokenAddresses = []
  }, [displayingAccount.address])

  useEffect(() => {
    loadTokenList()
  }, [importedTokenAddresses, displayingAccount, currency, price])

  const handleRefreshTokenList = async () => {
    await loadTokenList()
  }

  const [accountInfoMinHeight, setAccountInfoMinHeight] = useState(0)
  const accountInfoRef = useRef(null)

  useEffect(() => {
    const accountInfoField = accountInfoRef.current
    if (accountInfoField) {
      const scrollHeight = accountInfoField.scrollHeight
      if (scrollHeight < 150) {
        setAccountInfoMinHeight(0)
        return
      }

      if (scrollHeight >= 150) {
        setAccountInfoMinHeight(400)
        return
      }
    }
  }, [tokens])

  return (
    <div
      className="w-full px-3"
      ref={accountInfoRef}
      style={{ minHeight: `${clsx(accountInfoMinHeight)}px` }}
    >
      {tokens.map((token, idx) => (
        <div
          key={idx}
          className={clsx(
            'w-full flex items-center justify-between px-2 py-3 text-blue-800 text-sm',
            'border-b border-trueGray-400'
          )}
        >
          <div className="flex items-center">
            {token.name === 'Ethereum' && <div className="w-8.75 h-8.75">{networkLogo}</div>}
            {token?.name?.includes('KOII 1st') && <FinnieIcon className="w-8.75 h-8.75" />}
            {token?.name === 'KOII' && <K2Icon className="w-8.75 h-8.75" />}
            {token.name === 'Arweave' && <ArweaveIcon className="w-8.75 h-8.75" />}
            {token.name === 'Solana' && <SolanaIcon className="w-8.75 h-8.75" />}
            {token.name === 'Solana' && <SolanaIcon className="w-8.75 h-8.75" />}
            {/* {token.name === 'Fire Token' && <img src={'https://s2.coinmarketcap.com/static/img/coins/64x64/10089.png'} className="w-8.75 h-8.75" />} */}
            {token.name !== 'Ethereum' &&
              !token?.name?.includes('KOII') &&
              token.name !== 'Arweave' &&
              token.name !== 'Solana' &&
              (token.logo ? (
                <img src={token.logo} className="w-8.75 h-8.75" />
              ) : (
                <img src={customTokenIconPath} className="w-8.75 h-8.75" />
              ))}
            <span className="font-semibold ml-2.75">{token.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-semibold">
              {token.displayingBalance} {token.symbol}
            </div>
            {currentProviderAddress?.includes('mainnet') && token.usdValue && (
              <div>
                {token.usdValue} {currency}
              </div>
            )}
          </div>
        </div>
      ))}
      {(displayingAccount.type === TYPE.ETHEREUM ||
        displayingAccount.type === TYPE.SOLANA ||
        displayingAccount.type === TYPE.K2) && (
        <div className="mt-5 text-xs font-normal text-center text-blue-800 tracking-finnieSpacing-wide">
          {chrome.i18n.getMessage('doNotSeeYourTokens')}
        </div>
      )}
      {(displayingAccount.type === TYPE.ETHEREUM ||
        displayingAccount.type === TYPE.SOLANA ||
        displayingAccount.type === TYPE.K2) && (
        <div className="mt-1.5 mb-4 font-normal text-xs text-center tracking-finnieSpacing-wide text-blue-800" data-testid="import-token-button">
          {/* <span
          className="underline cursor-pointer text-success-700"
          onClick={() => handleRefreshTokenList()}
        >
          Refresh list
        </span>{' '}
        or{' '} */}
          <Link className="underline cursor-pointer text-success-700" to="/import-token">
            {chrome.i18n.getMessage('importAToken')}
          </Link>
        </div>
      )}
    </div>
  )
}

export default Tokens
