// modules
import React, { useEffect, useState } from 'react'
import { useSelector, connect } from 'react-redux'
import { get } from 'lodash'
import Web3 from 'web3'

// utils
import { numberFormat, fiatCurrencyFormat, calculateGasFee, winstonToAr } from 'utils'
import { getDisplayAddress } from 'options/utils'

// styles
// import './index.css'
import { popupAccount } from 'services/account'

import arweave from 'services/arweave'
import { TYPE } from 'constants/accountConstants'

import { setIsLoading } from 'actions/loading'

import BackIcon from 'img/v2/back-icon.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import storage from 'services/storage'

const TransactionConfirmModal = ({
  onClose,
  onSubmit,
  setIsLoading,
  recipient
}) => {
  const price = useSelector((state) => state.price)

  const [sourceAddress, setSourceAddress] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [qty, setQty] = useState(null)
  const [gasLimit, setGasLimit] = useState(null)
  const [currency, setCurrency] =  useState('AR')

  const [isEthereum, setIsEthereum] = useState(false)
  const [fee, setFee] = useState(null)

  const [requestLoaded, setRequestLoaded] = useState(false)
  const [isContractDeployment, setIsContractDeployment] = useState(false)
  const [isMintCollectibles, setIsMintCollectibles] = useState(false)

  const [transactionData, setTransactionData] = useState(null)

  const [estimatedGas, setEstimatedGas] = useState(null)

  const [maxFeePerGas, setMaxFeePerGas] = useState(null)
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState(null)



  const [transactionInputError, setTransactionInputError] = useState({})

  const accountAddress = recipient?.address

  useEffect(() => {
    const loadRequest = async () => {
      setIsLoading(true)
      const request = await storage.generic.get.pendingRequest()
      const { requestPayload, origin, favicon, requestId, isEthereum, network } = request.data

      const provider = await storage.setting.get.ethereumProvider()
      const web3 = new Web3(provider)

      if (network === 'ETHEREUM') {
        setIsEthereum(true)
        setCurrency('ETH')
        setSourceAddress(get(requestPayload, 'from'))
        setRecipientAddress(get(requestPayload, 'to'))
        setTransactionData(get(requestPayload, 'data'))
        setEstimatedGas(get(requestPayload, 'gas'))
        setMaxFeePerGas(get(requestPayload, 'maxFeePerGas'))
        setMaxPriorityFeePerGas(get(requestPayload, 'maxPriorityFeePerGas'))

        const latestBlock = await web3.eth.getBlockNumber()
        const latestBlockData = await web3.eth.getBlock(latestBlock)

        console.log('latest block data', latestBlockData)
        let baseFeePerGas = get(latestBlockData, 'baseFeePerGas')
        let maxFeePerGas = get(requestPayload, 'maxFeePerGas')
        baseFeePerGas = web3.utils.hexToNumber(baseFeePerGas)
        maxFeePerGas = web3.utils.hexToNumber(maxFeePerGas)

        console.log('baseFeePerGas', baseFeePerGas)
        console.log('maxFeePerGas', maxFeePerGas)

        if (!get(requestPayload, 'value')) {
          setIsMintCollectibles(true)
        }

        if (!get(requestPayload, 'to') && !get(requestPayload, 'value')) {
          setIsContractDeployment(true)
        }

        let _gasLimit = get(requestPayload, 'gasLimit')
        _gasLimit = Web3.utils.hexToNumber(_gasLimit)
        setGasLimit(_gasLimit)

        let value = get(requestPayload, 'value')
        value = parseInt(value, 16)
        console.log('value', value)
        setQty(value / 1000000000000000000)

      }

      if (network === 'ARWEAVE') {

      }

      setRequestLoaded(true)
      setIsLoading(false)
    }

    loadRequest()
  }, [])

  const estimateGasFee = async () => {
    const provider = await storage.setting.get.ethereumProvider()
    const web3 = new Web3(provider)

    const rawTx = {}
    if (recipientAddress) rawTx.to = recipientAddress
    if (qty) rawTx.value = qty * 1000000000000000000
    if (transactionData) rawTx.data = transactionData
    if (maxFeePerGas) rawTx.maxFeePerGas = maxFeePerGas
    if (maxPriorityFeePerGas) rawTx.maxPriorityFeePerGas = maxPriorityFeePerGas 

    rawTx.from = sourceAddress

    const gasPrice = await web3.eth.getGasPrice()
    console.log('gasPrice', gasPrice)

    return (await web3.eth.estimateGas(rawTx)) / 1000000000000000000 * gasPrice
  }

  useEffect(() => {
    const loadGasFee = async () => {
      const provider = await storage.setting.get.ethereumProvider()
      const fee = await estimateGasFee()
      console.log('GAS FEE', fee)

      setFee(fee)
    }

    const loadArFee = async () => {
      if (currency === 'AR') {
        const tx = await arweave.createTransaction({
          quantity: `${qty * 1000000000000}`,
          target: accountAddress
        })

        const fee = await arweave.transactions.getPrice(0, accountAddress)

        setFee(0.0008) // TODO: find for a proper way to get the exact ar fee
      }

      if (currency === 'KOII') setFee(0.00005)
    }

    let loadGasFeeInterval
    if (isEthereum && requestLoaded) {
      loadGasFee()
      loadGasFeeInterval = setInterval(() => {
        loadGasFee()
      }, 3000)
    }

    if (!isEthereum && requestLoaded) loadArFee()

    return () => clearInterval(loadGasFeeInterval)
  }, [requestLoaded])

  return (
    <div className="w-full h-full z-51 m-auto top-0 left-0 fixed flex flex-col items-center">
      <div
        className="relative bg-white shadow-md rounded m-auto flex flex-col items-center"
        style={{ width: '381px', height: '453px' }}
      >
        <div
          className="relative bg-blue-800 w-full flex items-center justify-center"
          style={{ height: '67px' }}
        >
          <BackIcon
            style={{ width: '30px', height: '30px' }}
            className="absolute top-4 left-4 cursor-pointer"
            onClick={onClose}
          />
          <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
            Confirm Transaction
          </div>
          <CloseIcon
            style={{ width: '30px', height: '30px' }}
            className="absolute top-4 right-4 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div
          className="mt-7 text-base leading-6 tracking-finnieSpacing-wide text-indigo text-center"
          style={{
            width: '288px'
          }}
        >
          Double check the details. This transaction cannot be undone.
        </div>
        <div
          className="mt-3 text-base leading-6 tracking-finnieSpacing-wide text-indigo text-center"
          style={{
            width: '288px'
          }}
        >
          {isContractDeployment && 'Transaction Deployment'}
          {isMintCollectibles && !isContractDeployment && 'Mint Collectibles'}
          {!isContractDeployment && !isMintCollectibles && 'Transfer ETH'} 
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5">
          <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
            <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              From:
            </div>
            {/* <div className="text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
              accountName
            </div> */}
            <div className="text-2xs tracking-finnieSpacing-tightest text-success-700">
              {getDisplayAddress(sourceAddress)}
            </div>
          </div>

          {!isContractDeployment && !isMintCollectibles &&
            <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
              <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              Sending:
              </div>
              {currency === 'AR' && (
              <>
                <div className="flex items-center text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
                  {qty} AR
                  <ArweaveIcon className="ml-1 w-4 h-4" />
                </div>
                <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
                  ${fiatCurrencyFormat(qty * price.AR)} USD
                </div>
              </>
              )}
              {currency === 'ETH' && (
              <>
                <div className="flex items-center text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
                  {qty} ETH
                  <EthereumIcon className="ml-1 w-4 h-4" />
                </div>
                <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
                  ${fiatCurrencyFormat(qty * price.ETH)} USD
                </div>
              </>
              )}
            </div>  
          }
          {!isContractDeployment && !isMintCollectibles &&
            <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
              <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              To:
              </div>
              <div className="text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
                {recipient.name}
              </div>
              <div className="text-2xs tracking-finnieSpacing-tightest text-success-700">
                {getDisplayAddress(recipientAddress)}
              </div>
            </div>  
          }

          <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
            <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              Estimated Costs:
            </div>
            {fee !== 0 && currency === 'ETH' && (
              <div className="text-11px leading-5 text-blue-800">{numberFormat(fee, 8)} ETH</div>
            )}
            {fee !== 0 && (currency === 'KOII' || currency === 'AR') && (
              <div className="text-base leading-5 text-blue-800">{fee} AR</div>
            )}
            <div className="text-2xs leading-3 tracking-finnieSpacing-wider text-success-700">
              Gas Fee
            </div>
          </div>
        </div>
        <div className="absolute bottom-7.25 w-full flex justify-between px-4.5">
          <button
            onClick={onClose}
            className="bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800"
            style={{ width: '160px', height: '38px' }}
          >
            Reject
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white"
            style={{ width: '160px', height: '38px' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default connect(null, { setIsLoading })(TransactionConfirmModal)
