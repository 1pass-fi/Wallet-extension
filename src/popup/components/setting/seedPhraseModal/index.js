// modules
import React from 'react'
import { connect } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// assets
import KeyIcon from 'img/key-icon.svg'
import WarningIcon from 'img/warning-icon.svg'
import InfoIcon from 'img/info.svg'
import CopyIcon from 'img/copy-icon.svg'

// components
import Modal from 'shared/modal'
import Button from 'shared/button'

// actions
import { setNotification } from 'actions/notification'

// constants
import { NOTIFICATION } from 'constants/koiConstants'

// styles
import './index.css'


export const SeedPhraseModal = ({ seedPhrase, setNotification, onClose }) => {
  return (
    <Modal className='seed-phrase-modal' onClose={onClose}>
      <div className='backup-phrase' >
        <div className='title'>
          <KeyIcon className='icon' />
          <div className='text'>Seed Phrase</div>
        </div>
        <div className='warning'>
          <WarningIcon className='warning-icon' />
          <div className='warning-text'>
            Your secret backup phrase makes it easy to back up and restore your
            account.
          </div>
        </div>
        <div className='phrase-display-box'>
          {seedPhrase}
          <CopyToClipboard  text={seedPhrase}>
            <div className='copy-button' onClick={() => setNotification(NOTIFICATION.SEED_PHRASE_COPIED)}>
              copy phrase
              <CopyIcon className='copy-icon' />
            </div>
          </CopyToClipboard>
        </div>
        <Button
          className='confirm-button'
          label={'Close'}
          onClick={onClose}
        />
        <div className='qa'>
          <div className='qa-icon'>
            <InfoIcon />
          </div>
          <div>
            <div className='qa-item'>
            Store your backup phrase in a password manager.
            </div>
            <div className='qa-item'>
            Write the phrase on a piece of paper and keep it in a safe location
            (or multiple).
            </div>
            <div className='qa-item'>Memorize this phrase</div>
            <div className='qa-item'>Koii cannot recover this phrase for you.</div>
          </div>
        </div>
      </div>
    </Modal>   
  )
}

export default connect(null, { setNotification })(SeedPhraseModal)
