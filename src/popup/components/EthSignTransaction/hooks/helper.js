import { get } from 'lodash'
import storage from 'services/storage'
import { decodeERC20Transaction } from 'utils/erc20/decodeTxData'
import Web3 from 'web3'

import { TRANSACTION_TYPE } from './constants'

const isContractAddress = async (address) => {
  const provider = await storage.setting.get.ethereumProvider()
  const web3 = new Web3(provider)
  const code = await web3.eth.getCode(address)

  return code !== '0x'
}

const getTransactionType = async (transactionPayload) => {
  try {
    const value = get(transactionPayload, 'value')
    const to = get(transactionPayload, 'to')
    const data = get(transactionPayload, 'data')

    if (!to && !value) return TRANSACTION_TYPE.CONTRACT_DEPLOYMENT

    const isContract = await isContractAddress(to)
    if (!isContract) return TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER

    const decode = decodeERC20Transaction(data)
    if (get(decode, 'name') === 'transfer') {
      return TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER
    }

    return TRANSACTION_TYPE.CONTRACT_INTERACTION  
  } catch (err) {
    console.error('getTransactionType error: ', err.message)
    return TRANSACTION_TYPE.CONTRACT_INTERACTION
  }
}

export default {
  getEthereumTransactionType: getTransactionType
}
