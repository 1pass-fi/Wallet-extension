// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

// assets
import CheckMarkIcon from 'img/check-mark-white.svg'
import BackIcon from 'img/v2/back-icon.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import ConnectBackgroundLeft from 'img/popup/connect-background-left.svg'
import ConnectBackgroundRight from 'img/popup/connect-background-right.svg'

// components
import AllowPermission from './AllowPermission'
import SelectWallet from './SelectWallet'

// actions
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'

// constants
import { ERROR_MESSAGE } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

// services
import storage from 'services/storage'

// styles
import { popupAccount } from 'services/account'

import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

const ConnectScreen = ({ setError, setIsLoading }) => {
  const [checkedAddress, setCheckedAddress] = useState('')

  const [origin, setOrigin] = useState('')
  const [favicon, setFavicon] = useState('')
  const [step, setStep] = useState(1)
  const [accounts, setAccounts] = useState([])
  const [isKoi, setIsKoi] = useState(true)
  const [requestId, setRequestId] = useState('')

  useEffect(() => {
    if (accounts.length > 0) {
      setCheckedAddress(accounts[0].address)
    }
  }, [accounts])

  useEffect(() => {
    const loadRequest = async () => {
      const request = await storage.generic.get.pendingRequest()
      console.log('pending request', request)

      const requestOrigin = get(request, 'data.origin')
      const requestFavicon = get(request, 'data.favicon')
      const isKoi = get(request, 'data.isKoi')
      const requestId = get(request, 'data.requestId')
      const isEthereum = get(request, 'data.isEthereum')

      let accounts = []
      if (!isEthereum) {
        accounts = (await popupAccount.getAllMetadata(TYPE.ARWEAVE)) || []
      } else {
        accounts = (await popupAccount.getAllMetadata(TYPE.ETHEREUM)) || []
      }

      setOrigin(requestOrigin)
      setFavicon(requestFavicon)
      setIsKoi(isKoi)
      setRequestId(requestId)

      setAccounts(accounts)
    }

    loadRequest()
  }, [])

  const goToTOU = () => {
    const url = 'https://koii.network/TOU_June_22_2021.pdf'
    chrome.tabs.create({ url })
  }

  const handleOnClick = async (accept) => {
    try {
      if (accept) {
        setIsLoading(true)

        if (!(await storage.generic.get.pendingRequest()))
          throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
        // await backgroundRequest.wallet.connect({ origin, confirm: true, address: checkedAddress })
        
        const payload = {
          requestId,
          approved: true,
          checkedAddresses: [checkedAddress]
        }

        chrome.runtime.onMessage.addListener(function(message) {
          if (message.requestId === requestId) {
            setIsLoading(false)
            storage.generic.remove.pendingRequest()
            chrome.browserAction.setBadgeText({ text: '' })
            setStep(3)
          }
        })

        chrome.runtime.sendMessage(payload)

      } else {
        // await backgroundRequest.wallet.connect({ origin, confirm: false })
        const payload = {
          requestId,
          approved: false
        }
        chrome.runtime.sendMessage(payload)
        await storage.generic.remove.pendingRequest()
        chrome.runtime.sendMessage({ requestId, approved: false })
        window.close()
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="w-full h-full z-51 m-auto top-0 left-0 fixed flex flex-col items-center">
      <div
        className="relative bg-white shadow-md rounded m-auto flex flex-col items-center overflow-y-scroll"
        style={{ width: '381px', height: '453px' }}
      >
        {step === 1 && (
          <>
            <div className="text-indigo tracking-finnieSpacing-wide px-6.5 mt-7">
              {isKoi && (
                <div className="text-sm font-semibold leading-5 text-center mb-5.5">
                  Welcome to the Koii Attention Leaderboard
                </div>
              )}
              <div className="text-xs font-normal leading-5">
                Make sure creators are fairly rewarded. While your wallet is connected, every time
                you interact with an NFT the creator will earn attention rewards.
                <br></br>
                This request will <span className="font-semibold">not cost any fees</span> or
                initiate a transaction. <br></br>
                By signing, you agree to accept the{' '}
                <span className="text-success-700 underline cursor-pointer" onClick={goToTOU}>
                  Koii Network Terms of Service.
                </span>
                <br></br>
                Your authentication status resets every 24 hours.
              </div>
            </div>
            <div className="w-full text-indigo">
              <div className="mt-4 mb-3 leading-4 font-semibold text-xs text-center">
                Wallet address:
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
              >
                Reject
              </button>
              <button
                onClick={() => setStep(2)}
                className="bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white"
                style={{ width: '160px', height: '38px' }}
              >
                Select Wallet
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
                onClick={() => setStep(1)}
              />
              <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
                Connect to site
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
              >
                Reject
              </button>
              <button
                onClick={() => handleOnClick(true)}
                className="bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white"
                style={{ width: '160px', height: '38px' }}
              >
                Connect
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
                Connect to site
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
                Your wallet is now connected to <br></br>this site. You can remove this<br></br>{' '}
                connection at anytime in
                <br></br> SETTINGS MENU {'>'} CONNECTED SITES
              </div>
            </div>
            <button
              onClick={() => window.close()}
              className="absolute bottom-7.25 px-4.5 bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white"
              style={{ width: '160px', height: '38px' }}
            >
              OK
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
