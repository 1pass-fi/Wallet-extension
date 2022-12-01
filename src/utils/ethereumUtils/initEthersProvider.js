import { ETH_NETWORK_PROVIDER } from 'constants/koiConstants'
import { ethers } from 'ethers'

const NETWORK_NAME = {
  MAINNET: 'mainnet',
  GOERLI: 'goerli'
}

const API_KEY = 'f811f2257c4a4cceba5ab9044a1f03d2'
const CONNECT_ERROR = 'The ethers connection could not be established.'

/**
 *
 * @param {String} providerUrl
 * @param {*=} keypair
 * @returns
 */
const initEthersProvider = (providerUrl, keypair) => {
  try {
    let networkName, wallet

    switch (providerUrl) {
      case ETH_NETWORK_PROVIDER.MAINNET:
        networkName = NETWORK_NAME.MAINNET
        break
      case ETH_NETWORK_PROVIDER.GOERLI:
        networkName = NETWORK_NAME.GOERLI
        break
      default:
        networkName = NETWORK_NAME.GOERLI
    }

    const ethersProvider = new ethers.providers.InfuraProvider(networkName, API_KEY)

    if (keypair) {
      wallet = new ethers.Wallet(keypair, ethersProvider)
    }

    return { ethersProvider, wallet }
  } catch (err) {
    console.error(err)
    throw new Error(CONNECT_ERROR)
  }
}

export default initEthersProvider
