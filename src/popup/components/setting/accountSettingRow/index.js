import React, { useState } from 'react'

import Fish from 'img/fish.svg'
import EditIcon from 'img/edit-icon.svg'
import Button from 'popup/components/shared/button'
import RevealSeedPhraseModal from '../revealSeedPhraseModal'
import {decryptSeedPhraseFromChrome} from 'utils/index.js'

import './index.css'
import { setError } from 'popup/actions/error'
import { SeedPhraseModal } from '../seedPhraseModal'

const AccountSettingRow = ({ accountName }) => {
  let key = null
  const [showRevealModal, setShowRevealModal] = useState(false)
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false)

  const onRevealSeedPhare = async (password) => {
    try {
      key = await decryptSeedPhraseFromChrome(password)
      if (!key) {
        setError('Empty seed phrase !')
      } else { 
        setShowRevealModal(false)
        setShowSeedPhraseModal(true)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div className="account-setting-row">
        <div className="display-row icon">
          <div className="logo-icon">
            <Fish />
          </div>
        </div>
        <div className="display-row account-info">
          <div className="account-name-line">
            <div class="name">{accountName}</div>
            <div className="edit-icon">
              <EditIcon />
            </div>
          </div>
          <Button
            type="outline"
            label="Get Seed Phrase"
            className="get-seed-phrase-button"
            onClick={() => {setShowRevealModal(true)}}
          />
        </div>
      </div>
      {showRevealModal && <RevealSeedPhraseModal onClose={() => {setShowRevealModal(false)}} onReveal={onRevealSeedPhare} />}
      {showSeedPhraseModal && <SeedPhraseModal onClose={() => {setShowSeedPhraseModal(false)}} seedPhrase={key}/>}
    </>
  )
}

export default AccountSettingRow
