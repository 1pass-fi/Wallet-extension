import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropsType from 'prop-types'

import Modal from 'popup/components/shared/modal'
import Input from 'popup/components/shared/inputField'
import Button from 'popup/components/shared/button'

import WarningIcon from 'img/warning-icon.svg'

import './index.css'
import { setError } from 'actions/error'
import { ERROR_MESSAGE } from 'constants'

const RevealSeedPhraseModal = ({ onReveal, onClose, setError }) => {
  const [password, setPassword] = useState('')

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleReveal = () => {
    if (password.length === 0) {
      setError(ERROR_MESSAGE.EMPTY_FIELDS)
    } else {
      onReveal()
    }
  }

  return (
    <Modal onClose={onClose} className='reveal-seed-phrase'>
      <div className='modal-title'>Reveal Seed Phrase</div>
      <div className='modal-description'>
        If you change browsers or computers, you will need this seed phrase to access your account.
        <br/>
        <span >{' '} </span>
        Save it somewhere <strong>safe and secret</strong>.
      </div>
      <div className='modal-warning'>
        <div className='warning-icon'>
          <WarningIcon />
        </div>
        <div className='warning-message' >
          Never disclose your backup phrase. Anyone with this phrase can steal your accounts.
        </div>
      </div>
      <Input label='Enter your password' className='password-field' value={password} onChange={onChangePassword}/>
      <div className='buttons-line'>
        <Button label='Reveal' onClick={handleReveal} className='modal-action-button reveal'/>
        <Button label='Go Back' type='outline' onClick={onClose} className='modal-action-button close'/>
      </div>
    </Modal>
  )
}

export default connect(null, { setError })(RevealSeedPhraseModal)
