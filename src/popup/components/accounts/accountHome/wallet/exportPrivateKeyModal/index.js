import React, { useState } from 'react'
import { connect } from 'react-redux'

import { getKeyFile } from 'actions/koi'

import WarningIcon from 'img/warning-icon.svg'

import './index.css'
import InputField from 'shared/inputField'
import Button from 'popup/components/shared/button'

export const KeyModal = ({ getKeyFile, setShowExportKeyModel }) => {
  const [password, setPassword] = useState(null)

  const handleOnClick = () => {
    if (password) {
      getKeyFile({ password })
      setShowExportKeyModel(false)
    }
  }
  
  return (
    <div className='export-file-popup-wrapper'>
      <div className='export-file-popup'>
        <div className='close-button'>x</div>
        <div className='title'>Export Private Key</div>
        <div className='description'>
          Enter your password to download your private keyfile. Make sure you
          are on a private computer.
        </div>
        <div className='warning'>
          <WarningIcon className='warning-icon' />
          <div className='warning-text'>
            Never share this private key. Anyone with your key can steal any
            assets in this account.
          </div>
        </div>
        <InputField onChange={(e) => setPassword(e.target.value)} label='Enter your password' className='enter-password' />
        <div className='button-line'>
          <Button onClick={handleOnClick} label='Reveal' className='reveal-button' />
          <Button onClick={() => setShowExportKeyModel(false)} label='Go Back' type='outline' className='go-back-button'   />
        </div>
      </div>
    </div>
  )
}

export default connect(null, { getKeyFile })(KeyModal)
