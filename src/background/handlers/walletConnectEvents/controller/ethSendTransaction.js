// Constants
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { get, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
// Utils
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'
import Web3 from 'web3'


export default async (payload, metadata, next) => {
  try {
    console.log('eth send transaction')
    console.log('payload', payload)
    console.log('metadata', metadata)

    const exampleTransactionHash = '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331'
    /* TODO walletconnect: Implement send transaction */
    next({ data: exampleTransactionHash })
  } catch (err) {
    next({ error: err.message })
  }
}
