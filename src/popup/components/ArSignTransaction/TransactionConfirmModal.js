// modules
import React, { useEffect, useMemo, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'
import clsx from 'clsx'
import { NETWORK } from 'constants/koiConstants'
import BackBtn from 'img/popup/back-button.svg'
import CheckMarkIcon from 'img/popup/check-mark-icon.svg'
import WarningIcon from 'img/popup/close-icon-red.svg'
import WaitingIcon from 'img/popup/waiting-icon.svg'
import WarningRedIcon from 'img/popup/warning-icon-red.svg'
import CheckMarkIconBlue from 'img/v2/check-mark-icon-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import OkBtn from 'img/v2/popup-tx-detail-ok.svg'
import SunriseLogo from 'img/v2/sunrise-logo/sunrise-logo.svg'
import { get, isEmpty, isNumber } from 'lodash'
import { getDisplayAddress } from 'options/utils'
// styles
import storage from 'services/storage'
// utils
import { numberFormat } from 'utils'
import { decodeTxMethod } from 'utils/index'

import ConnectScreen from 'components/Connect/ConnectScreen'

import { TAB, TRANSACTION_METHOD, TRANSACTION_TYPE } from './hooks/constants'
import useGetFee from './hooks/useGetFee'
import useLoadRequest from './hooks/useLoadRequest'
import useMethod from './hooks/useMethod'
import useSecurityStatus from './hooks/useSecurityStatus'
import useSendValue from './hooks/useSendValue'
import useSimulation from './hooks/useSimulation'

const TransactionConfirmModal = ({ setIsLoading, setError, setShowSigning }) => {
  const [tab, setTab] = useState(TAB.DETAIL)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showConnectedSites, setShowConnectedSites] = useState(false)
  const [acceptSite, setAcceptSite] = useState(false)

  const {
    transactionPayload,
    network,
    origin,
    requestId,
    favicon,
    transactionType,
    dataString,
    senderName,
    recipientName,
    signWithoutSend
  } = useLoadRequest({ setIsLoading })

  const { trustStat } = useSecurityStatus({ setIsLoading, url: origin })

  const { Fee, tokenSymbol, totalFee } = useGetFee({ network, transactionPayload })

  const { simulationData } = useSimulation({ network, transactionPayload })

  const sender = useMemo(() => {
    return get(transactionPayload, 'from')
  }, [transactionPayload])

  const transactionMethod = useMemo(() => {
    if (transactionType === TRANSACTION_TYPE.CONTRACT_INTERACTION && !isEmpty(dataString)) return decodeTxMethod(dataString)
    return null
  }, [dataString])

  const {
    SendValue,
    TokenIcon,
    customTokenRecipient,
    contractAddress,
    value,
    rawValue,
    symbol,
    originBalance,
    originSymbol
  } = useSendValue({
    network,
    transactionPayload,
    transactionType,
    setIsLoading,
    userAddress: sender
  })

  const { onSubmitTransaction, onRejectTransaction } = useMethod({
    setIsLoading,
    requestId,
    setError,
    setShowSigning,
    transactionPayload,
    transactionType,
    contractAddress,
    value,
    rawValue,
    customTokenRecipient,
    setShowReceipt,
    totalFee
  })

  const recipient = useMemo(() => {
    if (customTokenRecipient) return customTokenRecipient
    return get(transactionPayload, 'to')
  }, [customTokenRecipient, transactionPayload])


  /* 
    Hard return false -> temporary disable security function
    since sunrise services has been down
    Looking for an substitute vendor
  */
  const isScamOrigin = useMemo(() => {
    // return isNumber(trustStat) && trustStat < 0 && !acceptSite
    return false
  }, [trustStat, acceptSite])

  useEffect(() => {
    return () => {
      storage.generic.set.pendingRequest({})
    }
  }, [])

  return (
    <div className="w-full h-full bg-white z-51 m-auto top-0 left-0 fixed flex flex-col justify-center items-center">
      {!showReceipt ? (
        <div className="w-full h-full relative bg-white shadow-md rounded m-auto flex flex-col items-center">

          {/* NAVIGATION TAB */}
          <div className="w-full flex flex-col">
            <div
              style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)' }}
              className={clsx(
                'h-9.5 flex justify-center items-center cursor-pointer',
                tab === TAB.DETAIL && 'bg-lightBlue font-semibold'
              )}
              onClick={() => setTab(TAB.DETAIL)}
            >
              {chrome.i18n.getMessage('Details')}
            </div>
          </div>

          {/* TRANSACTION DETAIL */}
          {tab === TAB.DETAIL && (
            <div className="flex flex-col items-center w-full h-full mt-2 mb-22 overflow-y-auto overflow-x-hidden">
              <BackBtn
                onClick={onRejectTransaction}
                className="w-7.5 h-7.5 z-20 absolute top-15 left-3.75 cursor-pointer bg-white bg-opacity-70 rounded-full"
              />
              <div className="mt-5 font-semibold text-base text-indigo leading-5 text-center tracking-finnieSpacing-wide">
                {chrome.i18n.getMessage('ConfirmTransaction')}
              </div>

              {/* TRANSACTION TITLE */}
              <div className="mt-4.5 font-semibold text-sm text-indigo text-center tracking-finnieSpacing-wide">
                {transactionType === TRANSACTION_TYPE.CONTRACT_DEPLOYMENT && 'Contract Deployment'}
                {transactionType === TRANSACTION_TYPE.CONTRACT_INTERACTION &&
                  'Contract Interaction'}
                {transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER && 'Transfer AR'}
                {transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER && 'Transfer Token'}
              </div>
              {transactionType === TRANSACTION_TYPE.CONTRACT_INTERACTION &&
                !isEmpty(transactionMethod) && (
                  <>
                    {transactionMethod === TRANSACTION_METHOD.SET_APPROVAL_FOR_ALL && (
                      <div className="flex items-center justify-center w-auto h-5 mt-1 mb-3 px-1 text-sm text-indigo font-semibold tracking-finnieSpacing-wide border border-turquoiseBlue rounded-xs bg-cyan">
                        setApprovalForAll
                      </div>
                    )}
                    {transactionMethod === TRANSACTION_METHOD.MINT_COLLECTIBLES && (
                      <div className="flex items-center justify-center w-auto h-5 mt-1 mb-3 px-1 text-sm text-indigo font-semibold tracking-finnieSpacing-wide border border-turquoiseBlue rounded-xs bg-cyan">
                        mintCollectibles
                      </div>
                    )}
                    {transactionMethod === TRANSACTION_METHOD.APPROVE && (
                      <div className="flex items-center justify-center w-auto h-5 mt-1 mb-3 px-1 text-sm text-indigo font-semibold tracking-finnieSpacing-wide border border-turquoiseBlue rounded-xs bg-cyan">
                        approve
                      </div>
                    )}
                  </>
              )}

              {/* NFT SECURITY */}
              {isNumber(trustStat) &&
                (trustStat === 2 ? (
                  <div
                    className="w-full mt-3 flex items-center justify-center text-indigo bg-success bg-opacity-50 text-xs font-normal"
                    style={{ height: '36px' }}
                  >
                    <CheckMarkIcon style={{ width: '24px', height: '24px' }} />
                    <div className="mx-2" style={{ width: '300px ' }}>
                      Website verified by Sunrise NFT Scam Detector
                    </div>
                    <SunriseLogo style={{ width: '21px', height: '21px' }} />
                  </div>
                ) : 0 <= trustStat && trustStat < 2 ? (
                  <div
                    className="w-full mt-3 flex items-center justify-center text-indigo bg-warning-200 bg-opacity-50 text-xs font-normal"
                    style={{ height: '45px' }}
                  >
                    <WaitingIcon style={{ width: '24px', height: '24px' }} />
                    <div className="mx-2" style={{ width: '300px ' }}>
                      This website hasn’t been verified by Sunrise NFT Scam Detector. Make sure
                      you’re on the right site.
                    </div>
                    <SunriseLogo style={{ width: '21px', height: '21px' }} />
                  </div>
                ) : (
                  trustStat < 0 && (
                    <div
                      className="w-full mt-3 flex items-center justify-center text-indigo bg-warning-300 bg-opacity-50 text-xs font-normal"
                      style={{ height: '106px' }}
                    >
                      <WarningIcon style={{ width: '24px', height: '24px' }} />
                      <div
                        className="mx-2 flex flex-col items-center justify-center"
                        style={{ width: '300px ' }}
                      >
                        According to Sunrise NFT Scam Detector, this site might be impersonating a
                        popular NFT site. Double check that you are minting from the correct site to
                        keep your assets secure.
                        <div
                          className="leading-6 bg-blue-800 rounded-sm mt-0.5 flex items-center justify-center text-white cursor-pointer"
                          style={{ width: '100px', height: '20px' }}
                          onClick={() => setShowConnectedSites(true)}
                        >
                          I Understand
                        </div>
                      </div>
                      <SunriseLogo style={{ width: '21px', height: '21px' }} />
                    </div>
                  )
                ))}

              <div className="mt-5 px-9 w-full flex flex-col font-semibold text-sm text-indigo tracking-finnieSpacing-wide">
                {origin && (
                  <div
                    className={clsx(
                      'flex mb-2',
                      isScamOrigin && 'text-red-finnie'
                    )}
                  >
                    <div style={{ width: '176px' }}>Origin</div>
                    <div
                      className={clsx(
                        'flex font-normal text-xs items-center truncate',
                        isScamOrigin && 'text-red-finnie'
                      )}
                    >
                      {origin}
                    </div>
                    {isScamOrigin && <WarningRedIcon className="w-6 h-6" />}
                  </div>
                )}
                {(transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER ||
                  transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER) && (
                  <div className="flex mb-2">
                    <div style={{ width: '176px' }}>{chrome.i18n.getMessage('Sending')}</div>
                    <div className="flex font-normal text-xs items-center">
                      <SendValue />
                      <div className="ml-1 w-4 h-4">
                        <TokenIcon />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex mb-2">
                  <div style={{ width: '176px' }}>{chrome.i18n.getMessage('TotalBalance')}</div>
                  <div className="flex font-normal text-xs items-center text-success-700">
                    {numberFormat(originBalance, 6)} {originSymbol}
                  </div>
                </div>

                <div className="flex">
                  <div style={{ width: '176px' }}>{chrome.i18n.getMessage('TransactionFees')}</div>
                  <div className="flex font-normal text-xs items-center">
                    <Fee />
                  </div>
                </div>
              </div>

              <div className="mt-5 px-9 w-full flex flex-col font-semibold text-sm text-indigo tracking-finnieSpacing-wide">
                <div style={{ width: '176px' }}>{chrome.i18n.getMessage('FromLc')}</div>
                {senderName && <div className="mt-2 font-semibold text-xs">{senderName}</div>}
                <div className="mt-2 font-normal text-xs text-success-700">
                  {get(transactionPayload, 'from')}
                </div>
              </div>

              {(transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER ||
                transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER &&
                recipient
              ) && (
                <div className="mt-5 px-9 w-full flex flex-col font-semibold text-sm text-indigo tracking-finnieSpacing-wide">
                  <div style={{ width: '176px' }}>{chrome.i18n.getMessage('ToLc')}</div>
                  {recipientName && (
                    <div className="mt-2 font-semibold text-xs">{recipientName}</div>
                  )}
                  <div className="mt-2 font-normal text-xs text-success-700">
                    {customTokenRecipient || get(transactionPayload, 'to')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TRANSACTION SIMULATION */}
          {tab === TAB.SIMULATION && network === NETWORK.ETHEREUM && (
            <div className="flex flex-col items-center w-full h-full mt-2 overflow-y-auto overflow-x-hidden text-indigo">
              <div className="mt-5 font-semibold text-base text-indigo leading-5 text-center tracking-finnieSpacing-wide">
                1 transaction in queue
              </div>
              <div className="mt-2 text-sm text-indigo">
                <span className="font-bold">{origin}</span> requested{' '}
                <span className="font-bold">just now</span>
              </div>
              <div className="mt-2 text-xl text-indigo font-semibold">Simulated Changes:</div>
              <div className="w-full px-8 mt-4.5 flex flex-col">
                <div className="font-normal text-sm">You give:</div>
                <div
                  className="mt-1 w-full flex items-center justify-between px-4 rounded-lg"
                  style={{ backgroundColor: '#EBEEF7', height: '56px' }}
                >
                  <div className="flex items-center">
                    <EthereumIcon className="w-10 h-10" />
                    <div className="ml-1.5 font-normal text-base tracking-finnieSpacing-tight">
                      ETH
                    </div>
                  </div>
                  <div className="font-semibold text-sm" style={{ color: '#DB1B1B' }}>
                    - ={simulationData.data.givenTokenAmount / Math.pow(10, 18)}
                  </div>
                </div>
                <div className="mt-2.5 font-normal text-sm">You get:</div>
                {simulationData.type === TRANSACTION_METHOD.MINT_COLLECTIBLES && (
                  <div
                    className="mt-1 w-full flex items-center justify-between px-4 rounded-lg"
                    style={{ backgroundColor: '#EBEEF7', height: '56px' }}
                  >
                    <div className="flex items-center">
                      <img src={simulationData.data.nft.image_url} className="max-w-10 max-h-10" />
                    </div>
                    <div className="font-semibold text-sm" style={{ color: '#087980' }}>
                      + {simulationData.data.nft.name}
                    </div>
                  </div>
                )}

                {simulationData.type === TRANSACTION_METHOD.TOKEN_TRANSFER && (
                  <div
                    className="mt-1 w-full flex items-center justify-between px-4 rounded-lg"
                    style={{ backgroundColor: '#EBEEF7', height: '56px' }}
                  >
                    <div className="flex items-center">
                      <img src={simulationData.data.tokenInfo.logo} className="max-w-10 max-h-10" />
                      <div className="ml-1.5 font-normal text-base tracking-finnieSpacing-tight">
                        {simulationData.data.tokenInfo.name}
                      </div>
                    </div>
                    <div className="font-semibold text-sm" style={{ color: '#087980' }}>
                      +{' '}
                      {simulationData.data.receiveTokenAmount /
                        Math.pow(10, simulationData.data.tokenInfo.decimals)}{' '}
                      {simulationData.data.tokenInfo.symbol}
                    </div>
                  </div>
                )}

                <div
                  className="flex flex-col items-center justify-evenly mt-4 w-full bg-success rounded-lg"
                  style={{ height: '58px' }}
                >
                  <div className="flex items-center font-semibold text-base">
                    <CheckMarkIconBlue className="mr-1" style={{ width: '18px', height: '18px' }} />
                    Approved
                  </div>
                  <div className="font-normal text-sm">This transaction appears to be in order</div>
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
              className={clsx(
                'bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800',
                isScamOrigin && 'cursor-not-allowed opacity-50'
              )}
              style={{ width: '160px', height: '38px' }}
              disabled={isScamOrigin}
            >
              {chrome.i18n.getMessage('Reject')}
            </button>
            <button
              onClick={onSubmitTransaction}
              className={clsx(
                'bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white',
                isScamOrigin && 'cursor-not-allowed opacity-50'
              )}
              style={{ width: '160px', height: '38px' }}
              disabled={isScamOrigin}
            >
              {signWithoutSend ? chrome.i18n.getMessage('Sign') : chrome.i18n.getMessage('Send')}
            </button>
          </div>
          <ReactTooltip place="top" effect="float" />
          {showConnectedSites && (
            <ConnectScreen
              startedStep={2}
              popupConnectedModal={true}
              close={() => setShowConnectedSites(false)}
              setAcceptSite={setAcceptSite}
            />
          )}
        </div>
      ) : (
        /* RECEIPT */
        <div className="w-full relative bg-white rounded m-auto pt-9 text-blue-800 flex flex-col items-center tracking-finnieSpacing-tighter">
          <div className="font-semibold text-lg leading-5 text-indigo">
            Your tokens are on the way!
          </div>
          <div className="px-9 mt-8 w-full flex flex-col font-semibold text-sm text-indigo tracking-finnieSpacing-wide">
            {transactionType !== TRANSACTION_TYPE.CONTRACT_DEPLOYMENT &&
              transactionType !== TRANSACTION_TYPE.CONTRACT_INTERACTION && (
              <div className="flex mb-4">
                <div style={{ width: '142px' }}>{chrome.i18n.getMessage('AmountLc')}</div>
                <div className="flex font-normal text-sm items-center">
                  {value} {symbol}
                  <div className="ml-1 w-4 h-4">
                    <TokenIcon />
                  </div>
                </div>
              </div>
            )}
            <div className="flex mb-4">
              <div style={{ width: '142px' }}>{chrome.i18n.getMessage('FromLc')}</div>
              <div className="flex flex-col font-normal text-sm items-start">
                {senderName && <div>{senderName}</div>}
                <div className="font-normal text-xs text-success-700">
                  {getDisplayAddress(sender, 20)}
                </div>
              </div>
            </div>
            <div className="flex mb-4">
              <div style={{ width: '142px' }}>{chrome.i18n.getMessage('ToLc')}</div>
              <div className="flex flex-col font-normal text-sm items-start">
                {recipientName && <div>{recipientName}</div>}
                <div className="font-normal text-xs text-success-700">
                  {getDisplayAddress(recipient, 20)}
                </div>
              </div>
            </div>
            <div className="flex mb-4">
              <div style={{ width: '142px' }}>{chrome.i18n.getMessage('TransactionFees')}</div>
              <div className="font-normal text-sm">
                {numberFormat(totalFee, 6)} {tokenSymbol}
              </div>
            </div>
            <div className="flex mb-4">
              <div style={{ width: '142px' }}>{chrome.i18n.getMessage('Status')}</div>
              <div className="font-normal text-sm">{chrome.i18n.getMessage('Confirmed')}</div>
            </div>
            <div className="flex">
              <div style={{ width: '142px' }}>{chrome.i18n.getMessage('TotalCost')}</div>
              <div className="flex flex-col font-normal text-sm items-start">
                <div className="leading-5">
                  {value} {symbol}
                </div>
                <div className="leading-5">
                  {numberFormat(totalFee)} {tokenSymbol}
                </div>
              </div>
            </div>
          </div>

          <Link onClick={() => setShowSigning(false)} className="mt-10" to="/">
            <OkBtn className="cursor-pointer" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default connect(null, { setIsLoading, setError })(TransactionConfirmModal)
