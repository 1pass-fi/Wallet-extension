import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { lockWallet } from 'actions/koi'

import GlobalButton from 'popup/components/shared/globalButton'

import './index.css'

const Setting = ({ lockWallet }) => {
  const history = useHistory()
  return (
    <div className='setting-container'>
      <GlobalButton type='lock' className='lock' onClick={() => lockWallet({ history })} />
      <div className='setting-mock-content'>
        Setting Page
      </div>
    </div>
  )
}

export default connect(null, { lockWallet })(Setting)
