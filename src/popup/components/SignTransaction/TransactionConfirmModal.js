// modules
import React, { useEffect, useState } from 'react'
import { useSelector, connect } from 'react-redux'
import { get } from 'lodash'
import Web3 from 'web3'
import clsx from 'clsx'

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
    transactionType
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
            <div style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)'}} className={
              clsx(
                'w-47.5 h-9.5 flex justify-center items-center cursor-pointer',
                tab === TAB.DETAIL && 'bg-lightBlue font-semibold'
              )

            } onClick={() => setTab(TAB.DETAIL)}>Details</div>
            <div style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)'}} className={
              clsx(
                'w-47.5 h-9.5 flex justify-center items-center cursor-pointer',
                tab === TAB.DATA && 'bg-lightBlue font-semibold'
              ) 
            } onClick={() => setTab(TAB.DATA)}>Data</div>
          </div>
        </div>

        {/* TRANSACTION DATA */}
        {tab === TAB.DATA && <div 
          className="overflow-y-scroll flex flex-col w-full px-4.5 py-4.5"
          style={{ height: '348px' }}
        >
          <div>DATA:</div>
          <div className='overflow-y-scroll'>384a3a19627f4bfa8daa4d4bb821e9cd624c6cfe03c437b7ad2a963b78918d71765957c92c5730c26c27930e57e9e1360b6671caa0423a56321ffde53bad283efdbf7a34eb4dba507bf28bb397935e5dcbdfdec7b3570467df04a2d8f59640f5b71363bd44503eec0db1b3922f7c6ab3aa9e9ed0e53b950481dc94415984e4fdc03e07b94b67d9ae9d821c7e10a319b6b2936f68ccce0204906e943206ff1353bcd75
 fe2f4bb4d356f1c842286178c336b14bc2c5ab3b45c2b88c3c2ebb1ae7d6f72be9092dd6a0f5e1e0c9f75125f16aa688aea4c58a6f7f613ae91a0e001042cade29a7117742282e62df3fcf9d6e319b166a37af011a789569eaf5df514b0158f7cf814ea454dfaacb0920b4d79cc3d6ca1a909fcb030eda0ffa5604a9b45cf61ce56f4f94a0b750dc447d68deb9ecb257fc2eb4e6fc47f1eb3e145f4a4fca944af39e3
 ea2fb3e6705614845340d23aed18955661eed405df070f0ccba44c939033adb7518f090a6a84643cc09cfc6a77070294c9d07b4c83cf2936494e2ba6d7d7f436a3b2c6a6f411420ed9873a6a04c3ed73161d7d315603dec464d43c7b97da0730310985a70047272c450718563ae439ba92f88e9a1247d8f0a8b92012a4f506ff79033d20fa028a619d09655eb05ffe766a1e018073a065c762d28f903ba2995c43e44
 c3f5860d76736465733e11ade151aa2305921521dd6fa4c2a274c4ef4b901e664635b577b67fb54bb34f781f342104101ddeb0b58a16dd91dce9d71440dcbc3f4bb86d91323ac0fc77df547de39c937c842988172c5ab1b56b53a073d6eab31533589fed59103628d7033cce3a10754960aafbdb8601cf004d3092aa5829b1cced3e375f2e7691380205c15e588acaa3e107cf9e0001faecd639c300ceb27b379dc54
 f2bf933484fde922cb0de181d77f6e2e089a4aaac4ffded53bac25c356f57c0783bc1421c6819472e67e86bb0f80a1c66f22df461e45b7c308a647a7acef20f97c734822a0b35b711c3625792b3815dcb7d14bfc0633cee6d5957a91df52771789e483772cc9aca40626f5d590e8f60d30802f570b6dcfe0c54c70e9b521dd7bb06de24ac5cfa69826c0ea8dabfcd7e9861618049af2d71f119665966a32bd0891ac9
          </div>
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
    </div>
  )
}

export default connect(null, { setIsLoading, setError })(TransactionConfirmModal)
