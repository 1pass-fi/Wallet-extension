import axios from 'axios'
import get from 'lodash/get'

import Arweave from 'arweave/node'
import { smartweave } from 'smartweave'

import storage from 'services/storage'

const contractMap = {
  'QA7AIFVx1KBBmzC7WUNhJbDsHlSJArUT0jWrhZMZPS8': {
    logo: 'KOII.svg'
  },
  '-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ': {
    logo: 'ardrive.png'
  },
  'fE2OcfjlS-sHqG5K8QvxE8wHtcqKxS-YV0bDEgxo-eI': {
    logo: 'verto_1.svg'
  }
}

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

const getArweaveTokenData = async (contractAddress, userAddress) => {
  try {
    const logo = getIconPath(contractAddress)

    const arweave = Arweave.init({ host: 'arweave.net', protocol: 'https', port: 443, })
    const contractData = await smartweave.loadContract(arweave, contractAddress)

    const contractInitData = JSON.parse(get(contractData, 'initState'))
  
    const name = get(contractInitData, 'name')
    const decimal = 1
    const symbol = get(contractInitData, 'ticker')
    const balance = 100
  
    const price = 1
  
    return {
      logo,
      balance,
      price,
      name,
      symbol,
      decimal
    }
  } catch (err) {
    console.error('getArweaveTokenData error: ', err.message)
  }
}

export default getArweaveTokenData
