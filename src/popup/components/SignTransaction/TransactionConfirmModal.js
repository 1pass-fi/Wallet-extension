// modules
import React, { useEffect, useState } from 'react'
import { useSelector, connect } from 'react-redux'
import { get,isEmpty } from 'lodash'
import Web3 from 'web3'
import clsx from 'clsx'
import ReactTooltip from 'react-tooltip'

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
import useSendValue from './hooks/useSendValue'

import { TRANSACTION_TYPE, TAB } from './hooks/constants'

const TransactionConfirmModal = ({ onClose, setIsLoading, setError, setShowSigning }) => {
  const [tab, setTab] = useState(TAB.DETAIL)

  const price = useSelector((state) => state.price)
  const {
    transactionPayload,
    network,
    origin,
    requestId,
    favicon,
    transactionType,
    dataString
  } = useLoadRequest()

  const [Fee] = useGetFee({ network, transactionPayload })
  const { onSubmitTransaction, onRejectTransaction } = useMethod({
    setIsLoading,
    requestId,
    setError,
    setShowSigning,
    transactionPayload,
    network
  })
  const { SendValue, TokenIcon, customTokenRecipient } = useSendValue({
    network,
    transactionPayload,
    transactionType
  })

  return (
    <div className="w-full h-full z-51 m-auto top-0 left-0 fixed flex flex-col items-center">
      <div
        className="relative bg-white shadow-md rounded m-auto flex flex-col items-center"
        style={{ width: '381px', height: '453px' }}
      >
        <div className="w-full flex flex-col">
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

          {/* NAVIGATION TAB */}
          <div className="w-full flex text-base">
            <div 
              style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)'}} className={
                clsx(
                  'w-47.5 h-9.5 flex justify-center items-center cursor-pointer',
                  tab === TAB.DETAIL && 'bg-lightBlue font-semibold'
                )

              } 
              onClick={() => setTab(TAB.DETAIL)} 
              data-tip={isEmpty(dataString) && `This transaction doesn't contain data`}
            >Details</div>
            <div style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)'}} className={
              clsx(
                'w-47.5 h-9.5 flex justify-center items-center cursor-pointer',
                tab === TAB.DATA && 'bg-lightBlue font-semibold',
                isEmpty(dataString) && 'cursor-not-allowed'
              ) 
            } onClick={() => {
              if (!isEmpty(dataString)) setTab(TAB.DATA)
            }}>Data</div>
          </div>
        </div>

        {/* TRANSACTION DATA */}
        {tab === TAB.DATA && <div
          className="overflow-y-scroll flex flex-col items-center justify-center w-full px-4.5 py-4.5"
          style={{ height: '348px' }}
        >
          <div style={{
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)'
          }} className='overflow-y-scroll h-36 w-full'>{dataString}</div>
        </div>}

        {/* TRANSACTION DETAIL */}
        {tab === TAB.DETAIL && <div
          className="overflow-y-scroll flex flex-col items-center w-full px-4.5"
          style={{ height: '348px' }}
        >
          <div className="w-full mt-5 text-base leading-6 tracking-finnieSpacing-wide text-indigo text-center">
            Double check the details. This transaction cannot be undone.
          </div>

          {/* TRANSACTION TITLE */}
          <div className="w-full mt-3 text-sm leading-6 tracking-finnieSpacing-wide text-indigo text-center">
            {transactionType === TRANSACTION_TYPE.CONTRACT_DEPLOYMENT && 'Contract Deployment'}
            {transactionType === TRANSACTION_TYPE.CONTRACT_INTERACTION && 'Contract Interaction'}
            {transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER &&
              network === 'ETHEREUM' &&
              'Transfer ETH'}
            {transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER &&
              network === 'ARWEAVE' &&
              'Transfer AR'}
            {transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER && 'Transfer Token'}
          </div>

          {/* TRANSACTION DATA */}
          <div className="mt-4 grid grid-cols-2 gap-5">
            {/* SENDER */}
            <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
              <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
                From:
              </div>
              <div className="text-2xs tracking-finnieSpacing-tightest text-success-700">
                {getDisplayAddress(get(transactionPayload, 'from'))}
              </div>
            </div>

            {/* VALUE */}
            {(transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER ||
              transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER) && (
              <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
                <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
                  Sending:
                </div>
                <div>
                  <div className="flex items-center text-lg leading-10 tracking-finnieSpacing-tightest text-blue-800">
                    <SendValue />
                    <div className="ml-1 w-4 h-4">
                      <TokenIcon />
                    </div>
                    {/* <EthereumIcon className="ml-1 w-4 h-4" /> */}
                  </div>
                  {/* <div className="text-2xs tracking-finnieSpacing-tightest text-blueGray-800">
                  ${fiatCurrencyFormat(qty * price.ETH)} USD
                </div> */}
                </div>
              </div>
            )}

            {/* RECIPIENT */}
            {(transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER ||
              transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER) && (
              <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
                <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
                  To:
                </div>
                <div className="text-2xs tracking-finnieSpacing-tightest text-success-700">
                  {getDisplayAddress(customTokenRecipient || get(transactionPayload, 'to'))}
                </div>
              </div>
            )}

            {/* TRANSACTION FEE */}
            <div className="flex flex-col" style={{ width: '155px', height: '70px' }}>
              <div className="font-semibold text-base leading-6 tracking-finnieSpacing-wide text-blue-800">
                Estimated Costs:
              </div>
              <div className="text-11px leading-5 text-blue-800">
                <Fee />
              </div>
              <div className="text-2xs leading-3 tracking-finnieSpacing-wider text-success-700">
                Transaction Fee
              </div>
            </div>
          </div>

        </div>}

        {/* BUTTONS */}
        <div className="w-full flex justify-between mt-2 mb-4">
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
      <ReactTooltip place="top" effect="float" />
    </div>
  )
}

export default connect(null, { setIsLoading, setError })(TransactionConfirmModal)
