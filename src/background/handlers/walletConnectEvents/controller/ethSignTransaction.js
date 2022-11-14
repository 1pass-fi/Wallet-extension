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
    console.log('eth sign transaction')
    console.log('payload', payload)
    console.log('metadata', metadata)
    next({ data: 'example_response' })
  } catch (err) {
    next({ error: err.message })
  }
}
