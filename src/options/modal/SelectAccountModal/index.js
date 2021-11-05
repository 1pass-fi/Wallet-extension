import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { find } from 'lodash'

import './index.css'
import Modal from 'options/shared/modal'
import { GalleryContext } from 'options/galleryContext'
import { getArAccounts } from 'options/selectors/accounts'

import storage from 'services/storage'

const SelectAccount = () => {
  const { setAccount, account } = useContext(GalleryContext)
  const arAccounts = useSelector(getArAccounts)

  const onSelectAccount = async (e) => {
    const selectedAccountName = e.target.value
    const selectedAccount = find(arAccounts, v => v.accountName == selectedAccountName)
    setAccount(selectedAccount)

    // set default account to storage
    await storage.setting.set.activatedAccountAddress(selectedAccount.address)
  }

  return (
    <div className='select-account-modal'>
      <div className='title'>Select your account</div>
      <select defaultValue={account.accountName} onChange={(e) => onSelectAccount(e)} className='select'>
        {arAccounts.map((wallet, idx) => <option key={wallet.accountName + idx}>{wallet.accountName}</option>)}
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
