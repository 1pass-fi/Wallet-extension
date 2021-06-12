import React, { useState } from 'react'
import { connect } from 'react-redux'

import Fish from 'img/fish.svg'
import EditIcon from 'img/edit-icon.svg'
import Button from 'popup/components/shared/button'
import RevealSeedPhraseModal from '../revealSeedPhraseModal'
import EditAccountNameModal from 'popup/components/modals/editAccountNameModal'
import { SeedPhraseModal } from '../seedPhraseModal'
import { decryptSeedPhraseFromChrome, updateAccountName } from 'utils'

import './index.css'
import { setError } from 'popup/actions/error'
import { setNotification } from 'popup/actions/notification'
import { setAccountName } from 'popup/actions/accountName'
import { NOTIFICATION } from 'koiConstants'


const AccountSettingRow = ({ accountName, setError, setNotification, setAccountName }) => {
  const [seedPhrase, setSeedPhrase] = useState('')
  const [showRevealModal, setShowRevealModal] = useState(false)
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  const onClose = () => {
    setOpenEditModal(false)
  }

  const onSubmit = async (newName) => {
    await updateAccountName(newName)
    setAccountName(newName)
    setNotification(NOTIFICATION.ACCOUNT_NAME_UPDATED)
    setOpenEditModal(false)
  }

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
            <div className="edit-icon" onClick={() => setOpenEditModal(true)}>
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
      {openEditModal && <EditAccountNameModal onClose={onClose} onSubmit={onSubmit} currentName={accountName}/>}
      {showRevealModal && <RevealSeedPhraseModal onClose={() => {setShowRevealModal(false)}} onReveal={onRevealSeedPhare} />}
      {showSeedPhraseModal && <SeedPhraseModal onClose={() => {setShowSeedPhraseModal(false)}} seedPhrase={seedPhrase}/>}
    </>
  )
}

export const mapStateToProps = (state) => ({accountName: state.accountName})

export default connect(mapStateToProps, { setError, setNotification, setAccountName })(AccountSettingRow)
