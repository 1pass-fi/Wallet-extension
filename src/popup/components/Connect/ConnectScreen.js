// modules
import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
// actions
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
// assets
import CheckMarkIcon from 'img/check-mark-white.svg'
import ConnectBackgroundLeft from 'img/popup/connect-background-left.svg'
import ConnectBackgroundRight from 'img/popup/connect-background-right.svg'
import BackIcon from 'img/v2/back-icon.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
// styles
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
// services
import storage from 'services/storage'

// components
import AllowPermission from './AllowPermission'
import SelectWallet from './SelectWallet'

const ConnectScreen = ({
  setError,
  setIsLoading,
  startedStep = 1,
  popupConnectedModal = false,
  setAcceptSite = () => {},
  close = () => {}
}) => {
  const defaultAccount = useSelector((state) => state.defaultAccount)
  const [checkedAddress, setCheckedAddress] = useState('')

  const [origin, setOrigin] = useState('')
  const [favicon, setFavicon] = useState('')
  const [step, setStep] = useState(startedStep)
  const [accounts, setAccounts] = useState([])
  const [isKoi, setIsKoi] = useState(true)
  const [requestId, setRequestId] = useState('')

  useEffect(() => {
    if (accounts.length > 0) {
      switch (accounts[0].type) {
        case TYPE.ARWEAVE:
          setCheckedAddress(defaultAccount.AR?.address)
          break
        case TYPE.K2:
          setCheckedAddress(defaultAccount.K2?.address)
          break
        case TYPE.ETHEREUM:
          setCheckedAddress(defaultAccount.ETH?.address)
          break
        case TYPE.SOLANA:
          setCheckedAddress(defaultAccount.SOL?.address)
          break
      }
    }
  }, [accounts, isKoi])

  useEffect(() => {
    const loadRequest = async () => {
      const request = await storage.generic.get.pendingRequest()

      const requestOrigin = get(request, 'data.origin')
      const requestFavicon = get(request, 'data.favicon')
      const requestId = get(request, 'data.requestId')
      const isEthereum = get(request, 'data.isEthereum')
      const isSolana = get(request, 'data.isSolana')
      const isK2 = get(request, 'data.isK2')

      let accounts = []
      if (!isEthereum && !isSolana && !isK2) {
        accounts = (await popupAccount.getAllMetadata(TYPE.ARWEAVE)) || []
        setIsKoi(true)
      } else if (isEthereum) {
        accounts = (await popupAccount.getAllMetadata(TYPE.ETHEREUM)) || []
        setIsKoi(false)
      } else if (isSolana) {
        accounts = (await popupAccount.getAllMetadata(TYPE.SOLANA)) || []
        setIsKoi(false)
      } else if (isK2) {
        accounts = (await popupAccount.getAllMetadata(TYPE.K2)) || []
        setIsKoi(false)
      }

      setOrigin(requestOrigin)
      setFavicon(requestFavicon)
      setRequestId(requestId)

      setAccounts(accounts)
    }

    loadRequest()
  }, [])

  const goToTOU = () => {
    const url = 'https://koii.network/Koii_TOU_Oct_24_2023.pdf'
    chrome.tabs.create({ url })
  }

  const handleOnClick = async (accept) => {
    try {
      if (popupConnectedModal) {
        if (accept) {
          setAcceptSite(true)
          setStep(3)
        } else {
          close()
        }
        return
      }

      if (accept) {
        setIsLoading(true)
        if (!(await storage.generic.get.pendingRequest()))
          throw new Error(chrome.i18n.getMessage('requestNotExist'))

        const payload = {
          requestId,
          approved: true,
          checkedAddresses: [checkedAddress]
        }

        chrome.runtime.onMessage.addListener(function (message) {
          if (message.requestId === requestId) {
            if (message.error) {
              setError(message.error)
              setIsLoading(false)
              return
            }
            setIsLoading(false)
            storage.generic.remove.pendingRequest()
            chrome.action.setBadgeText({ text: '' })
            setStep(3)
          }
        })

        chrome.runtime.sendMessage(payload)
      } else {
        const payload = {
          requestId,
          approved: false
        }
        chrome.runtime.sendMessage(payload)
        await storage.generic.remove.pendingRequest()
        chrome.runtime.sendMessage({ requestId, approved: false })

        if (popupConnectedModal) {
          close()
        } else {
          window.close()
        }
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="w-full h-full z-51 m-auto top-0 left-0 fixed flex flex-col items-center">
      <div
        className={clsx('relative bg-white shadow-md rounded m-auto flex flex-col items-center')}
        style={{
          width: popupConnectedModal ? '381px' : '100%',
          height: popupConnectedModal ? '453px' : '100%'
        }}
      >
        {step === 1 && (
          <>
            <div className="text-indigo pt-10 tracking-finnieSpacing-wide px-6.5 mt-7">
              {isKoi && (
                <div className="text-sm font-semibold leading-5 text-center mb-5.5">
                  {chrome.i18n.getMessage('welcomeToKoiiLeaderBoard')}
                </div>
              )}
              <div className="text-xs font-normal leading-5">
                {chrome.i18n.getMessage('connectWalletMsg')}
                <br></br>
                {chrome.i18n.getMessage('thisRequestWill')}{' '}
                <span className="font-semibold">{chrome.i18n.getMessage('notCostAnyFeesLc')}</span>{' '}
                {chrome.i18n.getMessage('orLc')}
                {chrome.i18n.getMessage('initiateATransaction')}. <br></br>
                {chrome.i18n.getMessage('bySigning')}{' '}
                <span className="text-success-700 underline cursor-pointer" onClick={goToTOU}>
                  {chrome.i18n.getMessage('koiiTos')}
                </span>
                <br></br>
                {chrome.i18n.getMessage('authenticationStatus24Hours')}
              </div>
            </div>
            <div className="w-full text-indigo">
              <div className="mt-4 mb-3 leading-4 font-semibold text-xs text-center">
                {chrome.i18n.getMessage('walletAddress')}:
              </div>
              <SelectWallet
                accounts={accounts}
                checkedAddress={checkedAddress}
                setCheckedAddress={setCheckedAddress}
                setStep={setStep}
                handleOnClick={handleOnClick}
                isKoi={isKoi}
              />
            </div>
            <div className="absolute bottom-7.25 w-full flex justify-between px-4.5">
              <button
                onClick={() => handleOnClick(false)}
                className="bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800"
                style={{ width: '160px', height: '38px' }}
                data-testid="reject-wallet-button"
              >
                {chrome.i18n.getMessage('reject')}
              </button>
              <button
                disabled={isEmpty(checkedAddress)}
                onClick={() => setStep(2)}
                className="bg-blue-800 text-white rounded-sm shadow text-base leading-4 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ width: '160px', height: '38px' }}
                data-testid="select-wallet-button"
              >
                {chrome.i18n.getMessage('selectWallet')}
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div
              className="relative bg-blue-800 w-full flex items-center justify-center"
              style={{ height: '67px' }}
            >
              <BackIcon
                style={{ width: '30px', height: '30px' }}
                className="absolute top-4 left-4 cursor-pointer"
                onClick={() => {
                  startedStep !== 1 ? handleOnClick(false) : setStep(1)
                }}
              />
              <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
                {chrome.i18n.getMessage('connectToSite')}
              </div>
              <CloseIcon
                style={{ width: '30px', height: '30px' }}
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => handleOnClick(false)}
              />
            </div>
            <AllowPermission handleOnClick={handleOnClick} />
            <div className="absolute bottom-7.25 w-full flex justify-between px-4.5">
              <button
                onClick={() => handleOnClick(false)}
                className="bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800"
                style={{ width: '160px', height: '38px' }}
                data-testid="reject-connect-button"
              >
                {chrome.i18n.getMessage('reject')}
              </button>
              <button
                onClick={() => handleOnClick(true)}
                className="bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white"
                style={{ width: '160px', height: '38px' }}
                data-testid="connect-button"
              >
                {chrome.i18n.getMessage('connectUc')}
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div
              className="z-10 relative bg-blue-800 w-full flex items-center justify-center"
              style={{ height: '67px' }}
            >
              <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
                {chrome.i18n.getMessage('connectToSite')}
              </div>
            </div>
            <div className="mt-16.75">
              <ConnectBackgroundLeft className="absolute top-13.5 left-0" />
              <ConnectBackgroundRight className="absolute top-13.5 right-0" />
              <div
                className="bg-blue-800 rounded-full mb-12.5 mx-auto flex items-center justify-center"
                style={{ width: '61px', height: '61px' }}
              >
                <CheckMarkIcon style={{ width: '32px', height: '22px' }} />
              </div>
              <div
                style={{ width: '316px' }}
                className="font-normal text-base text-center tracking-finnieSpacing-wide text-indigo"
              >
                {chrome.i18n.getMessage('connectWalletMsgStart')} <br></br>
                {chrome.i18n.getMessage('connectWalletMsgMiddle')}
                <br></br> {chrome.i18n.getMessage('connectWalletMsgEnd')}
                <br></br> {chrome.i18n.getMessage('settingsMenuUc')} {'>'}{' '}
                {chrome.i18n.getMessage('connectedSitesUc')}
              </div>
            </div>
            <button
              onClick={() => {
                if (popupConnectedModal) {
                  close()
                } else {
                  window.close()
                }
              }}
              className="absolute bottom-7.25 px-4.5 bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white"
              style={{ width: '160px', height: '38px' }}
            >
              {chrome.i18n.getMessage('okUc')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export const mapStateToProps = (state) => ({
  accountName: state.accountName,
  accounts: state.accounts
})

export default connect(mapStateToProps, { setError, setIsLoading })(ConnectScreen)
