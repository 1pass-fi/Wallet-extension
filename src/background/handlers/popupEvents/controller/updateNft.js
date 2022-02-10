import { isUndefined } from 'lodash'
import { smartweave } from 'smartweave'

import { backgroundAccount } from 'services/account'
import arweave from 'services/arweave'

export default async (payload, next) => {
  try {
    const { isPrivate, address, txId } = payload.data
    console.log('INPUT', { isPrivate, address, txId })
    if (!address) {
      next({ error: 'Address not found' })
      return
    }
    if (!txId) {
      next({ error: 'Transaction ID not found' })
    }
    const credential = await backgroundAccount.getCredentialByAddress(address)

    if (!isUndefined(isPrivate)) {
      // await smartweave.interactWrite(arweave, credential.key, txId, {
      //   function: 'setIsPrivate',
      //   isPrivate
      // })
    }

    // create pending transaction
    await sleep()
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}

const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })
}
