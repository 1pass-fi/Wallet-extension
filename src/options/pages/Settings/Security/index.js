import React, { useEffect,useState } from 'react'
import { useSelector } from 'react-redux'
import { STORAGE } from 'constants/koiConstants'
import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import {
  AccountManagementExportKey,
  AccountManagementGetPhrase} from 'options/components/AccountManagement'
import ChangePasswordModal from 'options/components/Settings/Security/ChangePasswordModal'
import ExportPrivateKeyModal from 'options/components/Settings/Security/ExportPrivateKeyModal'
import RecoveryPhraseModal from 'options/components/Settings/Security/RecoveryPhraseModal'
import { getArAccounts } from 'options/selectors/accounts'
import { getDisplayAddress } from 'options/utils'
import { getChromeStorage } from 'utils'

import './index.css'

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
        <div className="header">{chrome.i18n.getMessage('SecuritySettings')}</div>
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
            <div className="title">{chrome.i18n.getMessage('ChangeMyPassword')}</div>
            <button
              className="update-password-btn"
              onClick={() => setShowChangePasswordModal(true)}
            >
              {chrome.i18n.getMessage('UpdatePassword')}
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
