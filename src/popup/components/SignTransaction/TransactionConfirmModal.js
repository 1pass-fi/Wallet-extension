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
import { setError } from 'actions/error'

import BackIcon from 'img/v2/back-icon.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import storage from 'services/storage'

import useGetFee from './hooks/useGetFee'
import useLoadRequest from './hooks/useLoadRequest'
import useMethod from './hooks/useMethod'

const TransactionConfirmModal = ({
  onClose,
  setIsLoading,
  setError,
  recipient
}) => {
  const price = useSelector((state) => state.price)
  const { 
    transactionPayload, 
    network, 
    origin, 
    requestId, 
    favicon, 
    isContractDeployment, 
    isMintCollectibles 
  } = useLoadRequest()
  const [Fee] = useGetFee({ network: 'ETHEREUM', transactionPayload })
  const { onSubmitTransaction, onRejectTransaction } = useMethod({ setIsLoading, requestId, setError })

  return (
    <div className="w-full h-full z-51 m-auto top-0 left-0 fixed flex flex-col items-center">
      <div
        className="relative bg-white shadow-md rounded m-auto flex flex-col items-center"
        style={{ width: '381px', height: '453px' }}
      >
        {/* TOP BUTTONS */}
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


        {/* TEXT */}
        <div
          className="mt-7 text-base leading-6 tracking-finnieSpacing-wide text-indigo text-center"
          style={{
            width: '288px'
          }}
        >
          Double check the details. This transaction cannot be undone.
        </div>


        {/* TRANSACTION TITLE */}
        <div
          className="mt-3 text-sm leading-6 tracking-finnieSpacing-wide text-indigo text-center"
          style={{
            width: '288px'
          }}
        >
          Transaction Deployment
          {/* {isContractDeployment && 'Transaction Deployment'} */}
          {/* {isMintCollectibles && !isContractDeployment && 'Mint Collectibles'}
          {!isContractDeployment && !isMintCollectibles && 'Transfer ETH'}  */}
        </div>

        
        {/* TRANSACTION DATA */}
        <div className="mt-8 grid grid-cols-2 gap-5">

          {/* SENDER */}
          <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
            <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              From:
            </div>
            <div className="text-2xs tracking-finnieSpacing-tightest text-success-700">
              {/* {getDisplayAddress(sourceAddress)} */}
              example_address
            </div>
          </div>


          {/* VALUE */}
          {!isContractDeployment && !isMintCollectibles &&
            <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
              <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              Sending:
              </div>

              {/* TODO useHook */}
              <div>
                <div className="flex items-center text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
                  {/* {qty} ETH */}
                  0.01 ETH
                  <EthereumIcon className="ml-1 w-4 h-4" />
                </div>
                <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
                  {/* ${fiatCurrencyFormat(qty * price.ETH)} USD */}
                  100 USD
                </div>
              </div>
            </div>  
          }


          {/* RECIPIENT */}
          {!isContractDeployment && !isMintCollectibles &&
            <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
              <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              To:
              </div>
              <div className="text-2xs tracking-finnieSpacing-tightest text-success-700">
                {/* {getDisplayAddress(recipientAddress)} */}
                example_recipient_address
              </div>
            </div>  
          }


          {/* TRANSACTION FEE */}
          <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
            <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
              Estimated Costs:
            </div>
            <div className="text-11px leading-5 text-blue-800"><Fee /></div>
            {/* {fee !== 0 && currency === 'ETH' && (
              <div className="text-11px leading-5 text-blue-800">{numberFormat(fee, 8)} ETH</div>
            )}
            {fee !== 0 && (currency === 'KOII' || currency === 'AR') && (
              <div className="text-base leading-5 text-blue-800">{fee} AR</div>
            )} */}
            <div className="text-2xs leading-3 tracking-finnieSpacing-wider text-success-700">
              Transaction Fee
            </div>
          </div>
        </div>


        {/* BUTTONS */}
        <div className="absolute bottom-7.25 w-full flex justify-between px-4.5">
          <button
            onClick={onRejectTransaction}
            className="bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800"
            style={{ width: '160px', height: '38px' }}
          >
            Reject
          </button>
          <button
            onClick={onSubmitTransaction}
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

export default connect(null, { setIsLoading, setError })(TransactionConfirmModal)
