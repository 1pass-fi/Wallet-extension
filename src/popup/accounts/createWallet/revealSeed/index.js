import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import KeyIcon from 'img/key-icon.svg'
import WarningIcon from 'img/warning-icon.svg'
import QuestionMarkIcon from 'img/question-mark-icon.svg'
import LockIcon from 'img/lock-icon.svg'
import CopyIcon from 'img/copy-icon.svg'
import Card from 'shared/card'
import Button from 'shared/button'
import './index.css'

const LockScreen = ({ onClick }) => {
  return (
    <div className='lock-screen' onClick={onClick}>
      <LockIcon className='icon' />
      <div className='text'>Click to reveal secret words.</div>
    </div>
  )
}

export default ({ seedPhrase, setStage }) => {
  const [isShowSeePhrase, setIsShowSeedPhrase] = useState(false)

  const handleOnClick = () => {
    setStage(3)
  }

  return (
    <div>
      <Card className='backup-phrase'>
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
          {isShowSeePhrase ? (
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
          type={isShowSeePhrase ? '' : 'outline'}
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
