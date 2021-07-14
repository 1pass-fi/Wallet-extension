import React from 'react'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import { getDisplayAddress } from 'options/utils'

import './index.css'

export default () => {
  const accounts = [
    {
      id: 1,
      name: 'account #1',
      address: '1234567890123456789012345678901234',
      seedPhrase: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
      keyfile: { id: '1' },
    },
    {
      id: 2,
      name: 'account #2',
      address: '6789012341234567890123456789012345',
      seedPhrase: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
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

  const onAccountClick = (id) => {
    console.log(id)
  }

  return (
    <div className='security-settings-wrapper'>
      <div className='security-settings'>
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
                  onClick={() => onAccountClick(account.id)}
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
                  onClick={() => onAccountClick(account.id)}
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
    </div>
  )
}
