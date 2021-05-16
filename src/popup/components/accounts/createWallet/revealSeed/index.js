import React, { useState } from 'react'
import { connect } from 'react-redux'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import KeyIcon from 'img/key-icon.svg'
import WarningIcon from 'img/warning-icon.svg'
import QuestionMarkIcon from 'img/question-mark-icon.svg'
import LockIcon from 'img/lock-icon.svg'
import CopyIcon from 'img/copy-icon.svg'
import CancelIcon from 'img/x-icon.svg'

import Card from 'shared/card'
import Button from 'shared/button'
import './index.css'

import { setCreateWallet } from 'actions/createWallet'

const LockScreen = ({ onClick }) => {
  return (
    <div className='lock-screen' onClick={onClick}>
      <LockIcon className='icon' />
      <div className='text'>Click to reveal secret words.</div>
    </div>
  )
}

export const RevealSeed = ({ seedPhrase, setCreateWallet, handleCancel }) => {
  const [isShowSeedPhrase, setIsShowSeedPhrase] = useState(false)

  const handleOnClick = () => {
    setCreateWallet({ stage: 3 })
  }

  return (
    <div className='backup-phrase-wrapper'>
      <Card className='backup-phrase'>
        <div onClick={handleCancel} className='cancel-icon'>
          <CancelIcon />
        </div>
        <div className='title'>
          <KeyIcon className='icon' />
          <div className='text'>Secret Backup Phrase</div>
        </div>
        <div className='description'>
          Your secret backup phrase makes it easy to back up and restore your
          account.
        </div>
        <div className='warning'>
          <WarningIcon className='warning-icon' />
          <div className='warning-text'>
            Your secret backup phrase makes it easy to back up and restore your
            account.
          </div>
        </div>
        <div className='phrase-display-box'>
          {isShowSeedPhrase ? (
            <>
              {seedPhrase}
              <CopyToClipboard className='copy-button' text={seedPhrase}>
                <div>
                  copy phrase
                  <CopyIcon className='copy-icon' />
                </div>
              </CopyToClipboard>
            </>
          ) : (
            <LockScreen onClick={() => setIsShowSeedPhrase(true)} />
          )}
        </div>
        <Button
          className='confirm-button'
          label={'Continue'}
          type={isShowSeedPhrase ? '' : 'outline'}
          onClick={handleOnClick}
        />
        <div className='qa'>
          <div className='qa-icon'>
            <QuestionMarkIcon />
          </div>
          <div className='qa-item'>
            Store your backup phrase in a password manager.
          </div>
          <div className='qa-item'>
            Write the phrase on a piece of paper and keep it in a safe location
            (or multiple).
          </div>
          <div className='qa-item'>Memorize this phrase</div>
          <div className='qa-item'>Koi cannot recover this phrase for you.</div>
        </div>
      </Card>
    </div>
  )
}

export default connect(null, { setCreateWallet })(RevealSeed)
