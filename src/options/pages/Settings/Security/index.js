import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import EthereumIcon from 'img/ethereum-logo.svg'
import { getDisplayAddress } from 'options/utils'
import { getChromeStorage } from 'utils'
import { STORAGE } from 'constants/koiConstants'
import { getArAccounts } from 'options/selectors/accounts'

import { ExportBackupPhraseModal, ExportBackupKeyFileModal } from './ExportModal'

import './index.css'
import { TYPE } from 'constants/accountConstants'

export default () => {
  const [seedPhrase, setSeedPhrase] = useState('')
  const [hasSeedPhrase, setHasSeedPhrase] = useState(false)

  const accounts = useSelector((state) => state.accounts)
  const arAccounts = useSelector(getArAccounts)

  const [showExportBackupPhraseModal, setShowExportBackupPhraseModal] = useState(false)

  const [showExportBackupKeyfileModal, setShowExportBackupKeyfileModal] = useState(false)

  const [selectedAccount, setSelectedAccount] = useState()

  useEffect(() => {
    const checkSeedPhrase = async () => {
      const storage = await getChromeStorage(STORAGE.KOI_PHRASE)
      if (storage[STORAGE.KOI_PHRASE]) setHasSeedPhrase(true)
    }

    checkSeedPhrase()
  }, [])

  const onSeedPhraseClick = (account) => {
    setSelectedAccount(account)
    setShowExportBackupPhraseModal(true)
  }

  const onKeyFileClick = (account) => {
    setSelectedAccount(account)
    setShowExportBackupKeyfileModal(true)
  }

  const closeModal = () => {
    setSelectedAccount({})
    setShowExportBackupKeyfileModal(false)
    setShowExportBackupPhraseModal(false)
  }

  return (
    <div className="security-settings-wrapper">
      <div
        className="security-settings"
        style={{
          filter: `${
            showExportBackupPhraseModal || showExportBackupKeyfileModal ? 'blur(8px)' : 'none'
          }`
        }}
      >
        <div className="header">Security Settings</div>
        <div className="content">
          <div className="backup-seedphrase">
            <div className="title">Get my Backup (seed) Phrase</div>
            <div className="description">Select a wallet to see its recovery phrase.</div>
            <div className="seedphrase">
              {accounts.map((account) => {
                if (account.seedPhrase)
                  return (
                    <div
                      key={account.id}
                      className="account"
                      onClick={() => onSeedPhraseClick(account)}
                    >
                      <div className="name-icon">
                        {account.type === TYPE.ARWEAVE && (
                          <div className="finnie-icon">
                            <FinnieIcon />
                          </div>
                        )}
                        {account.type === TYPE.ETHEREUM && (
                          <div className="finnie-icon">
                            <EthereumIcon />
                          </div>
                        )}
                        <div className="account-name">{account.accountName}</div>
                      </div>
                      <div className="account-address">{getDisplayAddress(account.address)}</div>
                    </div>
                  )
              })}
            </div>
          </div>

          <div className="backup-keyfile">
            <div className="title">Export my Private Key</div>
            <div className="description">Select a wallet to download its private key.</div>
            <div className="keyfile">
              {arAccounts.map((account) => (
                <div
                  key={account.address}
                  className="account"
                  onClick={() => onKeyFileClick(account)}
                >
                  <div className="name-icon">
                    <FinnieIcon className="finnie-icon" />
                    <div className="account-name">{account.accountName}</div>
                  </div>
                  <div className="account-address">{getDisplayAddress(account.address)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showExportBackupPhraseModal && (
        <ExportBackupPhraseModal account={selectedAccount} closeModal={closeModal} />
      )}

      {showExportBackupKeyfileModal && (
        <ExportBackupKeyFileModal account={selectedAccount} closeModal={closeModal} />
      )}
    </div>
  )
}
