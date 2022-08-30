// modules
import React from 'react'
// components
import Header from 'shared/header'

import AccountImport from '../accountImport'

// styles
import './index.css'


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
