import React from 'react'

import GlobalButton from 'popup/components/shared/globalButton'

import './index.css'

const Setting = () => {
  return (
    <div className='setting-container'>
      <GlobalButton type='lock' className='lock'/>
      <div className='setting-mock-content'>
        Mock Setting Page
      </div>
    </div>
  )
}

export default Setting
