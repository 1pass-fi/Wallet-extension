import React, { useState } from 'react'
import { connect } from 'react-redux'
import { getKeyFile } from 'actions/koi'
import { NOTIFICATION } from 'constants/koiConstants'
import WarningIcon from 'img/warning-icon.svg'
import { setError } from 'popup/actions/error'
import { setNotification } from 'popup/actions/notification'
import Button from 'popup/components/shared/button'
import Modal from 'popup/components/shared/modal/index'
import InputField from 'shared/inputField'

import './index.css'

export const KeyModal = ({ address, getKeyFile, setShowExportKeyModel, setNotification, setError }) => {
  const [password, setPassword] = useState(null)

  const handleOnClick = async () => {
    if (password) {
      try {
        await getKeyFile(password, address)
        setNotification(NOTIFICATION.KEY_EXPORTED)
        setShowExportKeyModel(false)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const onCloseModal = () => {
    setShowExportKeyModel(false)
  }
  
  return (
    <Modal className='export-file-modal' onClose={onCloseModal}>
      <div className='modal-title'>Export Private Key</div>
      <div className='modal-description'>
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
        <Button onClick={handleOnClick} label='Reveal' className='modal-action-button reveal' />
        <Button onClick={onCloseModal} label='Go Back' type='outline' className='modal-action-button close'   />
      </div>
    </Modal>
  )
}

export default connect(null, { getKeyFile, setNotification, setError })(KeyModal)
