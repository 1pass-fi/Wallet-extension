// modules
import React, { useState } from 'react'
import { connect } from 'react-redux'

// assets
import Fish from 'img/koi-logo-bg.svg'
import Ethereum from 'img/ethereum-logo.svg'
import EditIcon from 'img/edit-icon.svg'

// components
import Button from 'popup/components/shared/button'
import RevealSeedPhraseModal from '../revealSeedPhraseModal'
import EditAccountNameModal from 'popup/components/modals/editAccountNameModal'
import { SeedPhraseModal } from '../seedPhraseModal'

// utils
import { decryptSeedPhraseFromChrome } from 'utils'

// actions
import { setError } from 'actions/error'
import { setNotification } from 'actions/notification'
import { changeAccountName } from 'actions/koi'

// constants
import { NOTIFICATION } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

// styles
import './index.css'


const AccountSettingRow = ({ account, setError, setNotification, changeAccountName }) => {
  const [seedPhrase, setSeedPhrase] = useState('')
  const [showRevealModal, setShowRevealModal] = useState(false)
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  const onClose = () => {
    setOpenEditModal(false)
  }

  const changeName = async (newName) => {
    await changeAccountName(account.address, newName)
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
            {account.type === TYPE.ARWEAVE ?
              <Fish />
              :
              <Ethereum />
            }
          </div>
        </div>
        <div className="display-row account-info">
          <div className="account-name-line">
            <div className="name">{account.accountName}</div>
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
      {openEditModal && <EditAccountNameModal onClose={onClose} onSubmit={changeName}  account={account}/>}
      {showRevealModal && <RevealSeedPhraseModal onClose={() => {setShowRevealModal(false)}} onReveal={onRevealSeedPhare} />}
      {showSeedPhraseModal && <SeedPhraseModal onClose={() => {setShowSeedPhraseModal(false)}} seedPhrase={seedPhrase}/>}
    </>
  )
}

export default connect(null, { setError, setNotification, changeAccountName })(AccountSettingRow)
