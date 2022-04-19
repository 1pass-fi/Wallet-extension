
import Web3 from 'web3'
import { isString, get } from 'lodash'
import axios from 'axios'

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

const useMethod = ({ sender, recipient, value, contractAddress, selectedToken, alchemyAddress, setAlchemyAddress, setIsLoading, setRecipientName, recipientName }) => {
  const onSendTokens = async () => {
    try {
      if (alchemyAddress) recipient = alchemyAddress
      const network = validateAddress(sender)
      if (!network) throw new Error('Invalid address')
  
      const sendValue = selectedToken.decimal === 1 ? value : (10 ** selectedToken.decimal * value)

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
          }, [recipient, `${sendValue}`])

          const transactionPayload = {
            from: sender,
            to: contractAddress,
            data: hex
          }
          const requestPayload = {
            network: 'ETHEREUM',
            requestPayload: transactionPayload,
            recipientName
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
    } catch (err) {
      console.error('send token error: ', err.message)
    }
  }

  const getAlchemyAddress = async () => {
    setIsLoading(true)
    const API_KEY = 'TD3-t3Nv-5Hma3u6LtghPmYWMs-KzSAF'
    const url = `https://unstoppabledomains.g.alchemy.com/domains/${recipient}`

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    })

    setIsLoading(false)
    if (get(response, 'data.meta.owner')) {
      setAlchemyAddress(get(response, 'data.meta.owner'))
      setRecipientName(recipient)
    }
  }

  return { onSendTokens, getAlchemyAddress }
}

export default useMethod
