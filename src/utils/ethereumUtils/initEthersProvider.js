import { ethers } from 'ethers'
import { getEthereumNetworkProvider } from 'services/getNetworkProvider'

const CONNECT_ERROR = 'The ethers connection could not be established.'

/**
 * 
 * @param {String} providerUrl 
 * @param {*=} keypair
 * @returns 
 */
const initEthersProvider = async (providerUrl, keypair) => {
  try {
    let wallet

    const ethersProvider = await getEthereumNetworkProvider(providerUrl)

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
