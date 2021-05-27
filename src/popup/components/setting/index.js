import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { lockWallet } from 'actions/koi'
import { setError } from 'actions/error'

import GlobalButton from 'popup/components/shared/globalButton'
import AccountSettingRow from './accountSettingRow'

import { STORAGE } from 'koiConstants'
import { getChromeStorage } from 'utils'

import './index.css'

const Setting = ({ lockWallet, setError }) => {
  const history = useHistory()
  const handleOnClick = async () => {
    const address = (await getChromeStorage(STORAGE.KOI_ADDRESS))[STORAGE.KOI_ADDRESS]
    if (address) {
      lockWallet({ history })
    } else {
      setError('Cannot lock wallet.')
    }
  }

  return (
    <div className='setting-container'>
      <GlobalButton type='lock' className='lock' onClick={handleOnClick} />
      <div className='setting-mock-content'>
        <AccountSettingRow accountName='Account 1' /> 
      </div>
    </div>
  )
}

export default connect(null, { lockWallet, setError })(Setting)
