import React, { useContext } from 'react'
import { find } from 'lodash'

import './index.css'
import Modal from 'options/shared/modal'
import { GalleryContext } from 'options/galleryContext'

import storage from 'services/storage'

const SelectAccount = () => {
  const { setAccount, arWallets: wallets, account } = useContext(GalleryContext)

  const onSelectAccount = async (e) => {
    const selectedAccountName = e.target.value
    const selectedAccount = find(wallets, v => v.accountName == selectedAccountName)
    setAccount(selectedAccount)

    // set default account to storage
    await storage.setting.set.activatedAccountAddress(selectedAccount.address)
  }

  return (
    <div className='select-account-modal'>
      <div className='title'>Select your account</div>
      <select defaultValue={account.accountName} onChange={(e) => onSelectAccount(e)} className='select'>
        {wallets.map((wallet, idx) => <option key={wallet.accountName + idx}>{wallet.accountName}</option>)}
      </select>
    </div>
  )
}

export default ({ onClose }) => {
  return (
    <div>
      <Modal onClose={onClose}>
        <SelectAccount />
      </Modal>
    </div>
  )
} 
