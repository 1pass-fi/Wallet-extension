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

import { getChromeStorage, removeChromeStorage, saveOriginToChrome } from 'utils'

import { STORAGE, REQUEST, ERROR_MESSAGE } from 'constants'

import './index.css'

export const ConnectToWallet = ({ setError }) => {
  const [checkedList, setCheckedList] = useState([])
  const [address, setAddress] = useState('')
  const accounts = [
    {
      name: 'Account 1',
      address,
      type: 'koi',
    },
    // {
    //   name: 'Account 2',
    //   address: '5678901234567890123456789012345678901234456',
    //   type: 'koi',
    // },
    // {
    //   name: 'Account 3',
    //   address: '9999901234567890123456789012345678901234456',
    //   type: 'koi',
    // },
  ]

  const clearChecked = () => {
    setCheckedList([])
  }

  const checkAll = () => {
    setCheckedList(map(accounts, (account) => account.address))
  }

  const onChecked = (e, address) => {
    if (e.target.checked) {
      setCheckedList(union(checkedList, [address]))
    } else {
      setCheckedList(
        filter(checkedList, (checkedAddress) => checkedAddress !== address)
      )
    }
  }

  const [origin, setOrigin] = useState('')
  const [favicon, setFavicon] = useState('')
  const [step, setStep] = useState(1)

  const history = useHistory()

  const handleOnClick = async (accept) => {
    try {
      if (accept) {
        if (!(await getChromeStorage(STORAGE.PENDING_REQUEST))[STORAGE.PENDING_REQUEST]) throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
        await saveOriginToChrome(origin)
      }
      removeChromeStorage(STORAGE.PENDING_REQUEST)
      history.push('/account')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const loadRequest = async () => {
      const request = (await getChromeStorage(STORAGE.PENDING_REQUEST))[STORAGE.PENDING_REQUEST]
      const address = (await getChromeStorage(STORAGE.KOI_ADDRESS))[STORAGE.KOI_ADDRESS]
      setAddress(address)
      console.log('REQUEST DATA', request)
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
        <div className='connect-with-koi'>Connect with Koi</div>
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
            clearChecked={clearChecked}
            checkAll={checkAll}
            onChecked={onChecked}
            checkedList={checkedList}
            setStep={setStep}
            handleOnClick={handleOnClick}
          />}
          {step === 2 && <AllowPermission handleOnClick={handleOnClick} />}
        </Card>
      </div>
    </div>
  )
}

export default connect(null, { setError })(ConnectToWallet)
