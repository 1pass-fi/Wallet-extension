// modules
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
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

import ViewBlockIcon from 'img/v2/view-block.svg'
import OkBtn from 'img/v2/popup-tx-detail-ok.svg'

const TransactionConfirmModal = ({ onClose, setIsLoading, setError, setShowSigning }) => {
  const [tab, setTab] = useState(TAB.DETAIL)
  const [showReceipt, setShowReceipt] = useState(true)

  const price = useSelector((state) => state.price)
  const {
    transactionPayload,
    network,
    origin,
    requestId,
    favicon,
    transactionType,
    dataString
  } = useLoadRequest({ setIsLoading })

  const [Fee] = useGetFee({ network, transactionPayload })

  const {
    SendValue,
    TokenIcon,
    customTokenRecipient,
    contractAddress,
    value,
    rawValue
  } = useSendValue({
    network,
    transactionPayload,
    transactionType,
    setIsLoading
  })

  const { onSubmitTransaction, onRejectTransaction } = useMethod({
    setIsLoading,
    requestId,
    setError,
    setShowSigning,
    transactionPayload,
    network,
    transactionType,
    contractAddress,
    value,
    rawValue,
    customTokenRecipient
  })

  return (
    <div className="w-full h-full bg-white z-51 m-auto top-0 left-0 fixed flex flex-col justify-center items-center">
      {!showReceipt ? (
        <div className="w-full h-full relative bg-white shadow-md rounded m-auto flex flex-col items-center">
          <div className="w-full flex flex-col">
            {/* TOP BUTTONS */}
            <div
              className="relative bg-blue-800 w-full flex items-center justify-center"
              style={{ height: '67px' }}
            >
              <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
                Confirm Transaction
              </div>
            </div>

            {/* NAVIGATION TAB */}
            <div className="w-full grid grid-cols-2 text-base">
              <div
                style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)' }}
                className={clsx(
                  'h-9.5 flex justify-center items-center cursor-pointer',
                  tab === TAB.DETAIL && 'bg-lightBlue font-semibold'
                )}
                onClick={() => setTab(TAB.DETAIL)}
              >
                Details
              </div>
              <div
                style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)' }}
                className={clsx(
                  'h-9.5 flex justify-center items-center cursor-pointer',
                  tab === TAB.DATA && 'bg-lightBlue font-semibold',
                  isEmpty(dataString) && 'cursor-not-allowed'
                )}
                onClick={() => {
                  if (!isEmpty(dataString)) setTab(TAB.DATA)
                }}
                data-tip={isEmpty(dataString) ? `This transaction doesn't contain data` : ''}
              >
                Data
              </div>
            </div>
          </div>

          {/* TRANSACTION DATA */}
          {tab === TAB.DATA && (
            <div
              className="flex flex-col items-center justify-center w-full px-4.5 py-4.5"
              style={{ height: '348px' }}
            >
              <div
                className="h-56 w-full break-words overflow-y-scroll"
                style={{
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)',
                  padding: '12px'
                }}
              >
                {dataString}
              </div>
            </div>
          )}

          {/* TRANSACTION DETAIL */}
          {tab === TAB.DETAIL && (
            <div
              className="overflow-y-scroll flex flex-col items-center w-full px-4.5"
              style={{ height: '348px' }}
            >
              <div className="w-full mt-5 text-base leading-6 tracking-finnieSpacing-wide text-indigo text-center">
                Double check the details. This transaction cannot be undone.
              </div>

              {/* TRANSACTION TITLE */}
              <div className="w-full mt-3 text-sm leading-6 tracking-finnieSpacing-wide text-indigo text-center">
                {transactionType === TRANSACTION_TYPE.CONTRACT_DEPLOYMENT && 'Contract Deployment'}
                {transactionType === TRANSACTION_TYPE.CONTRACT_INTERACTION &&
                  'Contract Interaction'}
                {transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER &&
                  network === 'ETHEREUM' &&
                  'Transfer ETH'}
                {transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER &&
                  network === 'ARWEAVE' &&
                  'Transfer AR'}
                {transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER && 'Transfer Token'}
              </div>

              {/* TRANSACTION INFO */}
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
            </div>
          )}

          {/* BUTTONS */}
          <div
            style={{ width: '350px' }}
            className="absolute bottom-10 w-full flex justify-between"
          >
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
          <ReactTooltip place="top" effect="float" />
        </div>
      ) : (
        /* RECEIPT */
        <div className="w-full relative bg-white rounded m-auto pt-9 text-blue-800 flex flex-col items-center tracking-finnieSpacing-tighter">
          <div className="text-success-700 font-semibold text-xl">Your tokens are on the way!</div>
          <div className="w-full text-base px-12 flex gap-x-15.75 mt-6.5">
            <div style={{ width: '132px' }}>
              <div className="font-semibold">From:</div>
              <div>example_account</div>
              <div className="text-2xs text-success-700">
                {getDisplayAddress('sdfkjsdhfkhsdkjfhksjdhkfhjssadasdasd')}
              </div>
            </div>
            <div>
              <div className="font-semibold">Amount:</div>
              <div>100 KOII</div>
            </div>
          </div>
          <div className="w-full text-base px-12 flex gap-x-15.75 mt-5.5">
            <div style={{ width: '132px' }}>
              <div className="font-semibold">To:</div>
              <div>example_recipient</div>
              <div className="text-2xs text-success-700">
                {getDisplayAddress('skdjfhkjshdfkjhskjdfhksjhdfkjhskdhfjs')}
              </div>
            </div>
            <div>
              <div className="font-semibold">Transaction Fee:</div>
              <div className="text-base leading-5 text-blue-800">100 AR</div>
              <div className="text-2xs text-success-700">Storage Fee</div>
            </div>
          </div>
          <div className="w-full text-base px-12 flex gap-x-15.75 mt-5.5">
            <div style={{ width: '132px' }}>
              <div className="font-semibold">Status:</div>
              <div className="text-success-700">Confirmed</div>
            </div>
            <div>
              <a href={`https://viewblock.io/arweave/tx/example_txid`} target="_blank">
                <button
                  style={{ width: '128px', height: '29px' }}
                  className="bg-lightBlue shadow-md text-xs flex items-center justify-center rounded-sm"
                >
                  <ViewBlockIcon className="w-5 mr-2" />
                  Explore Block
                </button>
              </a>
            </div>
          </div>
          <div className="mt-5.5 text-blue-800 text-lg flex items-start justify-center">
            <div className="font-semibold leading-5">Total Cost: </div>
            <div className="ml-2">
              <div className="leading-5">example_ar_fee AR</div>
              <div className="text-2xs text-success-700">${fiatCurrencyFormat(1000)} USD</div>
            </div>
          </div>
          <Link className="mt-1" to="/">
            <OkBtn className="cursor-pointer" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default connect(null, { setIsLoading, setError })(TransactionConfirmModal)
