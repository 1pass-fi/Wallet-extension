
import axios from 'axios'
import { REQUEST } from 'constants/koiConstants'
import { ethers } from 'ethers'
import { get,isString } from 'lodash'
import storage from 'services/storage'
import { fromArToWinston, fromEthToWei, fromSolToLamp } from 'utils'
import { decodeERC20Transaction } from 'utils/erc20/decodeTxData'
import Web3 from 'web3'


const ETHEREUM = 'ETHEREUM'
const ARWEAVE = 'ARWEAVE'
const SOLANA = 'SOLANA'

import { TYPE } from 'constants/accountConstants'
import ethereumUtils from 'utils/ethereumUtils'

const validateAddress = (address) => {
  if (address?.slice(0, 2) === '0x' && address?.length === 42) return ETHEREUM
  if (address?.length === 43) return ARWEAVE
  else return SOLANA
}

const useMethod = ({
  sender,
  recipient,
  value,
  contractAddress,
  selectedToken,
  alchemyAddress,
  setAlchemyAddress,
  setIsLoading,
  setRecipientName,
  recipientName,
  selectedNetwork
}) => {
  const onSendTokens = async () => {
    try {
      if (alchemyAddress) recipient = alchemyAddress
      const network = selectedNetwork
      if (!network) throw new Error('Invalid address')
  
      const sendValue = selectedToken.decimal === 1 ? value : (10 ** selectedToken.decimal * value)

      const providerUrl = await storage.setting.get.ethereumProvider()
      const maxPriorityFeePerGas = ethers.utils.parseUnits('2.5', 'gwei').toNumber()
      const maxFeePerGas = await ethereumUtils.calculateMaxFeePerGas(providerUrl, '2.5')

      if (network === TYPE.ETHEREUM) {
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
            data: hex,
            maxPriorityFeePerGas,
            maxFeePerGas
          }

          const requestPayload = {
            network: 'ETHEREUM',
            transactionPayload,
            recipientName
          }

          await storage.generic.set.pendingRequest({
            type: REQUEST.ETH_TRANSACTION,
            data: requestPayload
          })
        } else {
          // send origin token
          const transactionPayload = {
            from: sender,
            to: recipient,
            value: fromEthToWei(value).toString(16),
            maxFeePerGas,
            maxPriorityFeePerGas
          }
  
          const requestPayload = {
            network: 'ETHEREUM',
            transactionPayload,
            recipientName
          }
          await storage.generic.set.pendingRequest({
            type: REQUEST.ETH_TRANSACTION,
            data: requestPayload
          })
        }
      }
  
      if (network === TYPE.ARWEAVE) {
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
            transactionPayload,
            recipientName
          }
          await storage.generic.set.pendingRequest({
            type: REQUEST.AR_TRANSACTION,
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
            transactionPayload,
            recipientName
          }
  
          await storage.generic.set.pendingRequest({
            type: REQUEST.AR_TRANSACTION,
            data: requestPayload
          })
        }
      }

      if (network === TYPE.SOLANA) {
        if (contractAddress) {
          // send custom token
          const transactionPayload = {
            from: sender,
            to: recipient,
            value: sendValue,
            contractAddress
          }

          const requestPayload = {
            network: 'SOLANA',
            transactionPayload,
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
            value: fromSolToLamp(value)
          }
  
          const requestPayload = {
            network: 'SOLANA',
            transactionPayload,
            recipientName
          }

          await storage.generic.set.pendingRequest({
            type: REQUEST.TRANSACTION,
            data: requestPayload
          })
        }
      }

      if (network === TYPE.K2) {
        if (contractAddress) {
          // send custom token
          const transactionPayload = {
            from: sender,
            to: recipient,
            value: sendValue,
            contractAddress
          }

          const requestPayload = {
            network: 'K2',
            transactionPayload,
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
            value: fromSolToLamp(value)
          }

          const requestPayload = {
            network: 'K2',
            transactionPayload,
            recipientName
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
    } else {
      setRecipientName(null)
    }
  }

  return { onSendTokens, getAlchemyAddress }
}

export default useMethod
