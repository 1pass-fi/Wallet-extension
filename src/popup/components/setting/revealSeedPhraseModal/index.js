// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

// components
import Modal from 'popup/components/shared/modal'
import Input from 'popup/components/shared/inputField'
import Button from 'popup/components/shared/button'

// assets
import WarningIcon from 'img/warning-icon.svg'

// actions
import { setError } from 'actions/error'

// constants
import { ERROR_MESSAGE, STORAGE } from 'constants/koiConstants'

// services
import { popupAccount } from 'services/account'

// styles
import './index.css'

const NoSeedphrase = ({onClose}) => (
  <div>
    <div className='modal-title'>
      Reveal Seed Phrase
    </div>
    <div className='modal-description'> 
      We cannot find your seed phrase on the storage. 
      To be able to reveal your seed phrase, you have to import your wallet using your seed phrase.
    </div>
    <div className='modal-button-no-seedphrase'>
      <Button label='Got it' type='outline' onClick={onClose} className='modal-action-button close'/>
    </div>
  </div>
)

export const RevealSeedPhraseModal = ({ onReveal, onClose, setError, account }) => {
  const [password, setPassword] = useState('')
  const [hasSeedPhrase, setHasSeedPhrase] = useState(true)

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleReveal = () => {
    if (password.length === 0) {
      setError(ERROR_MESSAGE.EMPTY_FIELDS)
    } else {
      onReveal(password)
    }
  }

  useEffect(() => {
    async function getHasSeedPhrase() {
      const _account = await popupAccount.getAccount({ address: account.address })
      const encryptedSeed = await _account.get.seedPhrase()

      if (!encryptedSeed) setHasSeedPhrase(false)
    }

    getHasSeedPhrase()
  }, [])

  return (
    <Modal onClose={onClose} className='reveal-seed-phrase'>
      {
        hasSeedPhrase ? 
          <div className='wrapper'>
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
          
          </div> :
          <NoSeedphrase onClose={onClose}/>
      }
    </Modal>
  )
}

export default connect(null, { setError })(RevealSeedPhraseModal)
