import React from 'react'
import AccountImport from '../accountImport'

import './index.css'
import Header from 'shared/header'

export default () => {
  return (
    <div className='seed-file-lock-screen'>
      <Header />
      <div className='content'>
        <div className='get-started'>Let’s get started.</div>
        <AccountImport />
      </div>
    </div>
  )
}
