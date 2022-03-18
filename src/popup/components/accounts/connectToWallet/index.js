// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'

// components
import Card from 'popup/components/shared/card'
import AllowPermission from './allowPermission'
import SelectWallet from './selectWallet'

// actions
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'

// constants
import { ERROR_MESSAGE } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

// services
import storage from 'services/storage'

// styles
import './index.css'
import { popupAccount } from 'services/account'
import disableOrigin from 'utils/disableOrigin'
import { ChromeStorage } from 'services/storage/ChromeStorage'

import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'


export const ConnectToWallet = ({ setError, setIsLoading }) => {
  const [checkedAddress, setCheckedAddress] = useState('')

  const [origin, setOrigin] = useState('')
  const [favicon, setFavicon] = useState('')
  const [step, setStep] = useState(1)
  const [accounts, setAccounts] = useState([])
  const [isKoi, setIsKoi] = useState(true)
  const [requestId, setRequestId] = useState('')
  const [isEthereum, setIsEthereum] = useState(false)

  const handleOnClick = async (accept) => {
    try {
      if (accept) {
        setIsLoading(true)
        if (!(await storage.generic.get.pendingRequest())) throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
        await backgroundRequest.wallet.connect({ origin, confirm: true, address: checkedAddress })
        chrome.runtime.sendMessage({requestId, approved: true, checkedAddresses: [checkedAddress]})
        
        storage.generic.remove.pendingRequest()
        chrome.browserAction.setBadgeText({ text: '' })
        setTimeout(() => {
          window.close()
        }, 1000)
      } else {
        await backgroundRequest.wallet.connect({ origin, confirm: false })
        await storage.generic.remove.pendingRequest()
        chrome.runtime.sendMessage({requestId, approved: false})
        window.close()
      }
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (accounts.length > 0){
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
        accounts = await popupAccount.getAllMetadata(TYPE.ARWEAVE) || []
      } else {
        accounts = await popupAccount.getAllMetadata(TYPE.ETHEREUM) || []
      }
      
      setOrigin(requestOrigin)
      setFavicon(requestFavicon)
      setIsKoi(isKoi)
      setRequestId(requestId)
      setAccounts(accounts)
    }

    loadRequest()
  }, [])

  const handleDisableFinnie = async () => {
    await disableOrigin.addDisabledOrigin(origin)
    window.close()
  }

  return (
    <div className='select-wallet'>
      <header className='header'>
        <div className='connect-with-koi'>Connect with Koii</div>
        <div className='title'>
          {favicon && <img src={favicon} className='logo' />}
          <a className='company-url' target='_blank' href={origin}>
            {origin}
          </a>
        </div>

      </header>
      <div className='content'>
        <Card className='card-content'>
          {step === 1 && <SelectWallet
            accounts={accounts}
            checkedAddress={checkedAddress}
            setCheckedAddress={setCheckedAddress}
            setStep={setStep}
            handleOnClick={handleOnClick}
          />}
          {step === 2 && <AllowPermission handleOnClick={handleOnClick} />}
        </Card>

        {!isKoi && step === 1 && <div className='disable-finnie'>
          <button onClick={handleDisableFinnie}>Pause Finnie</button>
          <div>Finnie will no longer inject code into this page</div>
          <div>You might need to refresh the page</div>
        </div>}
      </div>

    </div>
  )
}

export const mapStateToProps = (state) => ({accountName: state.accountName, accounts: state.accounts})

export default connect(mapStateToProps, { setError, setIsLoading })(ConnectToWallet)
