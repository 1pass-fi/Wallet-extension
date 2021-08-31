import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import union from 'lodash/union'
import filter from 'lodash/filter'
import map from 'lodash/map'
import { get } from 'lodash'

import Card from 'popup/components/shared/card'

import AllowPermission from './allowPermission'
import SelectWallet from './selectWallet'

import { setError } from 'actions/error'
import { connectSite } from 'actions/koi'

import { getChromeStorage, removeChromeStorage } from 'utils'

import { STORAGE, REQUEST, ERROR_MESSAGE } from 'koiConstants'


import './index.css'
import storage from 'storage'

export const ConnectToWallet = ({ setError, connectSite, accounts }) => {
  const [checkedAddress, setCheckedAddress] = useState('')

  const [origin, setOrigin] = useState('')
  const [favicon, setFavicon] = useState('')
  const [step, setStep] = useState(1)

  const history = useHistory()

  const handleOnClick = async (accept) => {
    try {
      if (accept) {
        if (!(await storage.generic.get.pendingRequest())) throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
        console.log('ORIGIN POPUP', origin)
        connectSite({ origin, confirm: true, address: checkedAddress })
        await storage.generic.remove.pendingRequest()
      } else {
        // action koi
        connectSite({ origin, confirm: false })
        await storage.generic.remove.pendingRequest()
        window.close()
      }
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const loadActivatedAccount = async () => {
      const connectSiteAccountAddress = await storage.setting.get.connectSiteAccountAddress()
      if (!connectSiteAccountAddress) {
        setCheckedAddress(accounts[0].address)
      } else {
        setCheckedAddress(connectSiteAccountAddress)
      }
    }

    loadActivatedAccount()
  }, [])

  useEffect(() => {
    const loadRequest = async () => {
      const request = await storage.generic.get.pendingRequest()
      console.log('pending request', request)

      const requestOrigin = get(request, 'data.origin')
      const requestFavicon = get(request, 'data.favicon')
      setOrigin(requestOrigin)
      setFavicon(requestFavicon)
    }

    loadRequest()
  }, [])

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
      </div>
    </div>
  )
}

export const mapStateToProps = (state) => ({accountName: state.accountName, accounts: state.accounts})

export default connect(mapStateToProps, { setError, connectSite })(ConnectToWallet)
