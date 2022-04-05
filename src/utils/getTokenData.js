import axios from 'axios'
import get from 'lodash/get'
import contractMap from '@metamask/contract-metadata'
import Web3 from 'web3'

import storage from 'services/storage'
import ERC20_ABI from 'abi/ERC20.json'

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
  const web3 = new Web3(provider)
  const tokenContract = new web3.eth.Contract(ERC20_ABI, contractAddress)

  const name = await tokenContract.methods.name().call()
  const decimal = await tokenContract.methods.decimals().call()
  const symbol = await tokenContract.methods.symbol().call()
  const balance = await tokenContract.methods.balanceOf(userAddress).call()

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
    decimal
  }
}

export default getTokenData
