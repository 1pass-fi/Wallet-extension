import React, { useState } from 'react'
import { connect } from 'react-redux'

import Fish from 'img/fish.svg'
import EditIcon from 'img/edit-icon.svg'
import Button from 'popup/components/shared/button'
import RevealSeedPhraseModal from '../revealSeedPhraseModal'
import { decryptSeedPhraseFromChrome } from 'utils'

import './index.css'
import { setError } from 'popup/actions/error'
import { SeedPhraseModal } from '../seedPhraseModal'

const AccountSettingRow = ({ accountName, setError }) => {
  const [seedPhrase, setSeedPhrase] = useState('')
  const [showRevealModal, setShowRevealModal] = useState(false)
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false)

  const onRevealSeedPhare = async (password) => {
    try {
      const phrase = await decryptSeedPhraseFromChrome(password)
      if (!phrase) {
        setShowRevealModal(false)
        setError('Seed Phrase not found.')
      } else { 
        setSeedPhrase(phrase)
        setShowRevealModal(false)
        setShowSeedPhraseModal(true)
      }
    } catch (err) {
      setError(err.message)
      setShowRevealModal(false)
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
            <div className="name">{accountName}</div>
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
      {showSeedPhraseModal && <SeedPhraseModal onClose={() => {setShowSeedPhraseModal(false)}} seedPhrase={seedPhrase}/>}
    </>
  )
}

export default connect(null, { setError })(AccountSettingRow)