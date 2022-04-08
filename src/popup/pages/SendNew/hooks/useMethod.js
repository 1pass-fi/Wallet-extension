
import Web3 from 'web3'
import { isString } from 'lodash'

import { decodeERC20Transaction } from 'utils/erc20/decodeTxData'
import storage from 'services/storage'
import { REQUEST } from 'constants/koiConstants'
import { fromEthToWei, fromArToWinston } from 'utils'


const ETHEREUM = 'ETHEREUM'
const ARWEAVE = 'ARWEAVE'

const validateAddress = (address) => {
  if (address?.slice(0, 2) === '0x' && address?.length === 42) return ETHEREUM
  if (address?.length === 43) return ARWEAVE
}

const useMethod = ({ sender, recipient, value, contractAddress }) => {
  const onSendTokens = async () => {
    const network = validateAddress(sender)
    if (!network) throw new Error('Invalid address')

    if (network === 'ETHEREUM') {
      if (contractAddress) {
        // send erc20 token
        console.log('send erc20 token')
        const web3 = new Web3()
        const hex = web3.eth.abi.encodeFunctionCall({
          'constant': false,
          'inputs': [
            {
              'name': '_to',
              'type': 'address'
            },
            {
              'name': '_value',
              'type': 'uint256'
            }
          ],
          'name': 'transfer',
          'outputs': [
            {
              'name': '',
              'type': 'bool'
            }
          ],
          'payable': false,
          'stateMutability': 'nonpayable',
          'type': 'function'
        }, [recipient, 0])

        const transactionPayload = {
          from: sender,
          to: contractAddress,
          data: hex
        }
        const requestPayload = {
          network: 'ETHEREUM',
          requestPayload: transactionPayload
        }
        await storage.generic.set.pendingRequest({
          type: REQUEST.TRANSACTION,
          data: requestPayload
        })
      } else {
        // send origin token
        const transactionPayload = {
          from: sender,
          to: recipient,
          value: fromEthToWei(value).toString(16)
        }

        const requestPayload = {
          network: 'ETHEREUM',
          requestPayload: transactionPayload
        }
        await storage.generic.set.pendingRequest({
          type: REQUEST.TRANSACTION,
          data: requestPayload
        })
      }
    }

    if (network === 'ARWEAVE') {
      if (contractAddress) {
        // send custom token
        const tags = {
          'Contract': contractAddress,
          'Input': {
            'qty': Number(value),
            'target': recipient,
            'function': 'transfer'
          }
        }

        const encodedTags = []

        Object.keys(tags).forEach(tagKey => {
          const tagValue = tags[tagKey]
          const encode = { name: Buffer.from(tagKey).toString('base64'), value: Buffer.from(!isString(tagValue) ? JSON.stringify(tagValue) : tagValue).toString('base64') }
          encodedTags.push(encode)
        })

        const transactionPayload = {
          from: sender,
          data: [],
          tags: encodedTags
        }

        const requestPayload = {
          network: 'ARWEAVE',
          requestPayload: transactionPayload
        }
        await storage.generic.set.pendingRequest({
          type: REQUEST.TRANSACTION,
          data: requestPayload
        })

      } else {
        // send origin token
        const transactionPayload = {
          from: sender,
          to: recipient,
          value: fromArToWinston(value)
        }

        const requestPayload = {
          network: 'ARWEAVE',
          requestPayload: transactionPayload
        }

        await storage.generic.set.pendingRequest({
          type: REQUEST.TRANSACTION,
          data: requestPayload
        })
      }
    }
  }

  return { onSendTokens }
}

export default useMethod
