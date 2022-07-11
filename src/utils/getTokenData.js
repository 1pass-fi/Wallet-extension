import {
  clusterApiUrl as clusterApiUrlK2,
  Connection as ConnectionK2,
  PublicKey as PublicKeyK2
} from '@_koi/web3.js'
import contractMap from '@metamask/contract-metadata'
// import Web3 from 'web3'
import { ethers } from 'ethers'

import { clarifyEthereumProvider } from 'utils'

import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { TokenListProvider } from '@solana/spl-token-registry'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import ERC20_ABI from 'abi/ERC20.json'
import axios from 'axios'
import find from 'lodash/find'
import get from 'lodash/get'
import includes from 'lodash/includes'
import storage from 'services/storage'
import customTokens from 'solanaTokens/solanaTokens'
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
  const tokenContract = new web3.eth.Contract(contractAddress, ERC20_ABI, web3)

  // const name = await tokenContract.methods.name().call()
  // const decimal = await tokenContract.methods.decimals().call()
  // const symbol = await tokenContract.methods.symbol().call()
  // const balance = await tokenContract.methods.balanceOf(userAddress).call()
  const name = await tokenContract.name()
  const decimal = await tokenContract.decimals()
  const symbol = await tokenContract.symbol()
  const balance = await tokenContract.balanceOf(userAddress)
  const selectedCurrency = (await storage.setting.get.selectedCurrency()) || 'USD'

  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=${selectedCurrency}`
  )

  const price = get(data, [contractAddress.toLowerCase(), selectedCurrency.toLowerCase()])

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
    const connection = new ConnectionK2(clusterApiUrlK2(clusterSlug))

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
      foundToken = find(customTokens, (token) =>
        includes(token.address?.toLowerCase(), contractAddress?.toLowerCase())
      ) || {}
    }
    
    const { logoURI: logo, name, decimals: decimal, symbol } = foundToken
  
    const selectedCurrency = (await storage.setting.get.selectedCurrency()) || 'USD'
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${contractAddress}&vs_currencies=${selectedCurrency}`
    )
    const price = get(data, [contractAddress.toLowerCase(), selectedCurrency.toLowerCase()])
  
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
