import React, { useState } from 'react'
import { connect } from 'react-redux'

import Input from 'shared/inputField'
import Button from 'shared/button'
import Header from 'shared/header'

import { getOldWallet } from 'utils'
import { setError } from 'actions/error'

import './index.css'

export const Recovery = ({ setError }) => {
  const [password, setPassowrd] = useState('')

  const handleDownloadKey = async () => {
    try {
      const { key, seedphrase } = await getOldWallet(password)

      const result = JSON.stringify(key)

      const url = 'data:application/json;base64,' + btoa(result)
      chrome.downloads.download({
        url: url,
        filename: 'finnie-key.json',
      })

      if (seedphrase) {
        const _url = 'data:text/plain;base64,' + btoa(seedphrase)
        chrome.downloads.download({
          url: _url,
          filename: 'finnie-seedphrase.txt',
        })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <Header />
      <div className='content'>
        <div className='recover-key-wrapper'>
          <div className='title'>Recover my key</div>
          <div>Enter your previous Finnie password to download your secret phrase or key file.</div>
          <div className='recovery-form'>
            <div>Enter your Finnie password</div>
            <div><Input onChange={(e) => setPassowrd(e.target.value)} /></div>
            <div><Button onClick={handleDownloadKey} className='recovery-button' label='Recover My Key'/></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(null, { setError })(Recovery)
