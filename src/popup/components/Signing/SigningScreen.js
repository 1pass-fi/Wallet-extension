// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'

// components
import AllowPermission from './allowPermission'
import SelectWallet from './selectWallet'

// actions
import { setError } from 'actions/error'
import { connectSite } from 'actions/koi'

// constants
import { ERROR_MESSAGE } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

// services
import storage from 'services/storage'

// styles
import { popupAccount } from 'services/account'
import disableOrigin from 'utils/disableOrigin'

import BackIcon from 'img/v2/back-icon.svg'
import CloseIcon from 'img/v2/close-icon-white.svg'
import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

const SigningScreen = ({ setError, connectSite }) => {
  const [checkedAddress, setCheckedAddress] = useState('')

  const [origin, setOrigin] = useState('')
  const [favicon, setFavicon] = useState('')
  const [step, setStep] = useState(1)
  const [accounts, setAccounts] = useState([])
  const [isKoi, setIsKoi] = useState(true)

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
      setOrigin(requestOrigin)
      setFavicon(requestFavicon)
      setIsKoi(isKoi)
    }

    const loadArAccounts = async () => {
      const arAccounts = (await popupAccount.getAllMetadata(TYPE.ARWEAVE)) || []
      setAccounts(arAccounts)
    }

    loadRequest()
    loadArAccounts()
  }, [])

  // TODO LongP - ask for disable Finnie
  const handleDisableFinnie = async () => {
    await disableOrigin.addDisabledOrigin(origin)
    window.close()
  }

  const handleOnClick = async (accept) => {
    console.log('connectWallet', accept)
    try {
      if (accept) {
        if (!(await storage.generic.get.pendingRequest()))
          throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
        console.log('ORIGIN POPUP', origin)
        connectSite({ origin, confirm: true, address: checkedAddress })
        await storage.generic.remove.pendingRequest()

        // TODO LongP
        setStep(3)
      } else {
        // action koi
        // connectSite({ origin, confirm: false })
        await storage.generic.remove.pendingRequest()
        console.log('connectWallet - CLOSE')
        // window.close()
      }
    } catch (err) {
      console.log('connectWallet - Error: ', err.message)
      // setError(err.message)
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
              <div className="text-sm font-semibold leading-5 text-center">
                Welcome to the Koii Attention Leaderboard
              </div>
              <div className="mt-5.5 text-xs font-normal leading-4 ">
                Make sure creators are fairly rewarded. While your wallet is connected, every time
                you interact with an NFT the creator will earn attention rewards. This request will
                not cost any fees or initiate a transaction. By signing, you agree to accept the
                Koii Network Terms of Service. Your authentication status resets every 24 hours.
              </div>
            </div>
            <div className="text-indigo">
              <div className="mt-4 leading-4 font-semibold text-xs">Wallet address:</div>
              <SelectWallet
                accounts={accounts}
                checkedAddress={checkedAddress}
                setCheckedAddress={setCheckedAddress}
                setStep={setStep}
                handleOnClick={handleOnClick}
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
                SelectWallet
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
              className="relative bg-blue-800 w-full flex items-center justify-center"
              style={{ height: '67px' }}
            >
              <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
                Connect to site
              </div>
            </div>
            <div>
              {
                'Your wallet is now connected to this site. You can remove this connection at anytime in Settings Menu > Connected sites'
              }
            </div>
            <button
              onClick={() => {
                console.log('connectWallet - DONE')
                // window.close()
              }}
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

export default connect(mapStateToProps, { setError, connectSite })(SigningScreen)
