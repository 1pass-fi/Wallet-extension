import React, { useContext } from 'react'
import { find } from 'lodash'

import './index.css'
import Modal from 'options/shared/modal'
import { GalleryContext } from 'options/galleryContext'

const SelectAccount = () => {
  const { setAccount, wallets } = useContext(GalleryContext)

  const onSelectAccount = (e) => {
    const selectedAccountName = e.target.value
    const selectedAccount = find(wallets, v => v.accountName == selectedAccountName)
    setAccount(selectedAccount)
  }

  return (
    <div className='select-account-modal'>
      <div className='title'>Select your account</div>
      <select onChange={(e) => onSelectAccount(e)} className='select'>
        {wallets.map((wallet) => <option>{wallet.accountName}</option>)}
      </select>
    </div>
  )
}

export default () => {
  return (
    <div>
      <Modal onClose={onClose}>
        <SelectAccount />
      </Modal>
    </div>
  )
} 
