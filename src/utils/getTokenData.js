import {
  clusterApiUrl as clusterApiUrlK2,
  Connection as ConnectionK2,
  PublicKey as PublicKeyK2
} from '@_koi/web3.js'
import contractMap from '@metamask/contract-metadata'
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { TokenListProvider } from '@solana/spl-token-registry'
import { Connection, PublicKey } from '@solana/web3.js'
import axiosAdapter from '@vespaiach/axios-fetch-adapter'
import ERC20_ABI from 'abi/ERC20.json'
import axios from 'axios'
// import Web3 from 'web3'
import { ethers } from 'ethers'
import find from 'lodash/find'
import get from 'lodash/get'
import includes from 'lodash/includes'
import storage from 'services/storage'
import customTokens from 'solanaTokens/solanaTokens'
import { clarifyEthereumProvider } from 'utils'
import clusterApiUrl from 'utils/clusterApiUrl'
import k2Contracts from 'utils/k2-contracts.json'

export const getLogoPath = (logo) => {
  const path = `img/erc20/${logo}`
  return path
}

const getIconPath = (contractAddress) => {
  const metadata = contractMap[contractAddress]
  if (metadata?.logo) {
    const fileName = metadata.logo
    const path = `img/erc20/${fileName}`
    return path
  }
}

const getTokenData = async (contractAddress, userAddress) => {
  const logo = getIconPath(contractAddress)

  const provider = await storage.setting.get.ethereumProvider()
  const { ethNetwork, apiKey } = clarifyEthereumProvider(provider)

  const network = ethers.providers.getNetwork(ethNetwork)
  const web3 = new ethers.providers.InfuraProvider(network, apiKey)

  // const tokenContract = new web3.eth.Contract(ERC20_ABI, contractAddress)
  // const tokenContract = new web3.eth.Contract(contractAddress, ERC20_ABI, web3)
  const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, web3)

  // const name = await tokenContract.methods.name().call()
  // const decimal = await tokenContract.methods.decimals().call()
  // const symbol = await tokenContract.methods.symbol().call()
  // const balance = await tokenContract.methods.balanceOf(userAddress).call()
  const name = await tokenContract.name()
  const decimal = await tokenContract.decimals()
  const symbol = await tokenContract.symbol()
  const balance = await tokenContract.balanceOf(userAddress)
  const selectedCurrency = (await storage.setting.get.selectedCurrency()) || 'USD'

  let price = undefined

  try {
    const { data } = await axios.request({
      url: `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=${selectedCurrency}`,
      method: 'GET',
      adapter: axiosAdapter
    })
    price = get(data, [contractAddress.toLowerCase(), selectedCurrency.toLowerCase()])
  } catch (error) {
    console.log('Failed to get ETH price: ', error)
  }

  return {
    logo,
    balance,
    price,
    name,
    symbol,
    decimal,
    contractAddress
  }
}

export const getK2CustomTokensData = async (contractAddress, userAddress) => {
  try {
    const clusterSlug = await storage.setting.get.k2Provider()
    console.log('clusterSlug:', clusterSlug)
    const connection = new ConnectionK2(clusterSlug)
    // const connection = new ConnectionK2(clusterApiUrlK2(clusterSlug))
    console.log('connection:', connection)

    // const PublicKey = new PublicKeyK2(userAddress)
    // const requestBody = {
    //   jsonrpc: '2.0',
    //   id: 1,
    //   method: 'getAccountInfo',
    //   params: [
    //     PublicKey,
    //     {
    //       encoding: 'base58'
    //     }
    //   ]
    // }

    // const response = await axios.post(
    //   clusterSlug, 
    //   requestBody,
    //   { adapter: axiosAdapter }
    // )

    // const tokenAccounts = response.data.result
    // console.log('response:', response)
    let foundToken =
      find(k2Contracts, (token) =>
        includes(token.address?.toLowerCase(), contractAddress?.toLowerCase())
      ) || {}
    const { logoURI: logo, name, decimals: decimal, symbol } = foundToken

    const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKeyK2(userAddress), {
      programId: TOKEN_PROGRAM_ID
    })

    let balance = 0
    tokenAccounts.value.forEach((e) => {
      const accountInfo = AccountLayout.decode(e.account.data)
      if (accountInfo.mint?.toString().toLowerCase() === contractAddress?.toLowerCase()) {
        balance = parseInt(accountInfo.amount)
      }
    })

    const price = 0

    return {
      logo,
      balance,
      price,
      name,
      symbol,
      decimal,
      contractAddress
    }
  } catch (error) {
    console.error('Fail to get K2 Token data', error.message)
  }
}

export const getSolanaCustomTokensData = async (contractAddress, userAddress) => {
  try {
    const clusterSlug = await storage.setting.get.solanaProvider()
    const connection = new Connection(clusterApiUrl(clusterSlug))

    const tokenlistContainer = await new TokenListProvider().resolve()
    const tokenList = tokenlistContainer.filterByClusterSlug(clusterSlug).getList()

    let foundToken = find(tokenList, (token) =>
      includes(token.address?.toLowerCase(), contractAddress?.toLowerCase())
    )

    if (!foundToken) {
      foundToken =
        find(customTokens, (token) =>
          includes(token.address?.toLowerCase(), contractAddress?.toLowerCase())
        ) || {}
    }

    const { logoURI: logo, name, decimals: decimal, symbol } = foundToken

    const selectedCurrency = (await storage.setting.get.selectedCurrency()) || 'USD'
    let price = undefined

    try {
      const { data } = await axios.request({
        url: `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${contractAddress}&vs_currencies=${selectedCurrency}`,
        adapter: axiosAdapter,
        method: 'GET'
      })

      price = get(data, [contractAddress.toLowerCase(), selectedCurrency.toLowerCase()])
    } catch (error) {
      console.log('Failed to get SOL price: ', error)
    }

    const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(userAddress), {
      programId: TOKEN_PROGRAM_ID
    })

    let balance = 0
    tokenAccounts.value.forEach((e) => {
      const accountInfo = AccountLayout.decode(e.account.data)
      if (accountInfo.mint?.toString().toLowerCase() === contractAddress?.toLowerCase()) {
        balance = parseInt(accountInfo.amount)
      }
    })

    return {
      logo,
      balance,
      price,
      name,
      symbol,
      decimal,
      contractAddress
    }
  } catch (err) {
    console.error(err.message)
  }
}

export default getTokenData
