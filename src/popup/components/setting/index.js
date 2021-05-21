import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { lockWallet } from 'actions/koi'
import { setError } from 'actions/error'

import GlobalButton from 'popup/components/shared/globalButton'

import { STORAGE } from 'constants'
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
        Setting Page
      </div>
    </div>
  )
}

export default connect(null, { lockWallet, setError })(Setting)
