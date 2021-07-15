import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import { getDisplayAddress } from 'options/utils'

import {
  ExportBackupPhraseModal,
  ExportBackupKeyFileModal,
} from './ExportModal'

import './index.css'

export default () => {
  const [
    showExportBackupPhraseModal,
    setShowExportBackupPhraseModal,
  ] = useState(false)

  const [
    showExportBackupKeyfileModal,
    setShowExportBackupKeyfileModal,
  ] = useState(false)

  const [selectedAccount, setSelectedAccount] = useState()

  const accounts = [
    {
      id: 1,
      name: 'account #1',
      address: '1234567890123456789012345678901234',
      seedPhrase: [
        'shoelace',
        'bookstore',
        ' divulge',
        ' restaurant',
        ' potato',
        ' infant',
        ' leaflet',
        ' solar',
        ' maritime',
        ' photograph',
        ' balloon',
        ' museum',
      ],
      keyfile: { id: '1' },
    },
    {
      id: 2,
      name: 'account #2',
      address: '6789012341234567890123456789012345',
      seedPhrase: [
        'shoelace',
        'bookstore',
        ' divulge',
        ' restaurant',
        ' potato',
        ' infant',
        ' leaflet',
        ' solar',
        ' maritime',
        ' photograph',
        ' balloon',
        ' museum',
      ],
      keyfile: {},
    },
    {
      id: 3,
      name: 'account #3',
      address: '1234567890123456789012345679999999',
      seedPhrase: [],
      keyfile: { id: '2' },
    },
  ]

  const onSeedPharseClick = (account) => {
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
    <div className='security-settings-wrapper'>
      <div
        className='security-settings'
        style={{
          filter: `${
            showExportBackupPhraseModal || showExportBackupKeyfileModal
              ? 'blur(8px)'
              : 'none'
          }`,
        }}
      >
        <div className='header'>Security Settings Settings</div>
        <div className='content'>
          <div className='backup-seedphrase'>
            <div className='title'>Get my Backup (seed) Phrase</div>
            <div className='description'>
              Select a wallet to see its recovery phrase.
            </div>
            <div className='seedphrase'>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className='account'
                  disabled={isEmpty(get(account, 'seedPhrase', ''))}
                  onClick={() => onSeedPharseClick(account)}
                >
                  <div className='name-icon'>
                    <FinnieIcon className='finnie-icon' />
                    <div className='account-name'>{account.name}</div>
                  </div>
                  <div className='account-address'>
                    {getDisplayAddress(account.address)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='backup-keyfile'>
            <div className='title'>Export my Private Key</div>
            <div className='description'>
              Select a wallet to download its private key.
            </div>
            <div className='keyfile'>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className='account'
                  disabled={isEmpty(get(account, 'keyfile', ''))}
                  onClick={() => onKeyFileClick(account)}
                >
                  <div className='name-icon'>
                    <FinnieIcon className='finnie-icon' />
                    <div className='account-name'>{account.name}</div>
                  </div>
                  <div className='account-address'>
                    {getDisplayAddress(account.address)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showExportBackupPhraseModal && (
        <ExportBackupPhraseModal
          account={selectedAccount}
          closeModal={closeModal}
        />
      )}

      {showExportBackupKeyfileModal && (
        <ExportBackupKeyFileModal
          account={selectedAccount}
          closeModal={closeModal}
        />
      )}
    </div>
  )
}
