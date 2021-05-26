import React from 'react'

import WarningIcon from 'img/warning-icon.svg'

import './index.css'
import InputField from 'shared/inputField'
import Button from 'popup/components/shared/button'

export default () => {
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
        <InputField label='Enter your password' className='enter-password' />
        <div className='button-line'>
          <Button label='Reveal' className='reveal-button' />
          <Button label='Go Back' type='outline' className='go-back-button'   />
        </div>
      </div>
    </div>
  )
}
