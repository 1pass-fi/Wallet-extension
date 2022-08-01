import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import { getDisplayAddress } from 'options/utils'
import { getChromeStorage } from 'utils'
import { STORAGE } from 'constants/koiConstants'
import { getArAccounts } from 'options/selectors/accounts'

import {
  AccountManagementGetPhrase,
  AccountManagementExportKey
} from 'finnie-v2/components/AccountManagement'

import './index.css'
import ChangePasswordModal from 'finnie-v2/components/Settings/Security/ChangePasswordModal'
import ExportPrivateKeyModal from 'finnie-v2/components/Settings/Security/ExportPrivateKeyModal'
import RecoveryPhraseModal from 'finnie-v2/components/Settings/Security/RecoveryPhraseModal'

export default () => {
  const [hasSeedPhrase, setHasSeedPhrase] = useState(false)

  const accounts = useSelector((state) => state.accounts)
  const arAccounts = useSelector(getArAccounts)

  const [showExportBackupPhraseModal, setShowExportBackupPhraseModal] = useState(false)

  const [showExportBackupKeyfileModal, setShowExportBackupKeyfileModal] = useState(false)

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  const [selectedAccount, setSelectedAccount] = useState()

  useEffect(() => {
    const checkSeedPhrase = async () => {
      const storage = await getChromeStorage(STORAGE.KOI_PHRASE)
      if (storage[STORAGE.KOI_PHRASE]) setHasSeedPhrase(true)
    }

    checkSeedPhrase()
  }, [])

  const closeModal = () => {
    setSelectedAccount({})
    setShowExportBackupKeyfileModal(false)
    setShowExportBackupPhraseModal(false)
    setShowChangePasswordModal(false)
  }

  return (
    <div className="security-settings-wrapper">
      <div className="security-settings">
        <div className="header">Security Settings</div>
        <div className="content">
          {/* <div className="backup-seedphrase">
            <div className="title">Get my Secret Phrase</div>
            <div className="description">
              Select a wallet to see its secret phrase (sometimes called a ‘seed phrase’).
            </div>
            <AccountManagementGetPhrase
              accounts={accounts}
              setSelectedAccount={setSelectedAccount}
              setShowExportBackupPhraseModal={setShowExportBackupPhraseModal}
            />
          </div>

          <div className="backup-keyfile">
            <div className="title">Export my Private Key</div>
            <div className="description">Select an account to download the private key.</div>
            <AccountManagementExportKey
              accounts={accounts}
              setSelectedAccount={setSelectedAccount}
              setShowExportBackupKeyfileModal={setShowExportBackupKeyfileModal}
            />
          </div> */}

          <div className="change-password">
            <div className="title">Change my password</div>
            <button
              className="update-password-btn"
              onClick={() => setShowChangePasswordModal(true)}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {showExportBackupPhraseModal && (
        <RecoveryPhraseModal account={selectedAccount} close={closeModal} />
      )}

      {showExportBackupKeyfileModal && (
        <ExportPrivateKeyModal account={selectedAccount} close={closeModal} />
      )}

      {showChangePasswordModal && <ChangePasswordModal close={closeModal} />}
    </div>
  )
}
