import React from 'react'
import AccountImport from '../accountImport'

import './index.css'
import Header from 'shared/header'

export default () => {
  return (
    <div className='seed-file-lock-screen'>
      <Header />
      <div className='content'>
        <AccountImport />
      </div>
    </div>
  )
}
