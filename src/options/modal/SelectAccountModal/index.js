import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'lodash'

import './index.css'
import Modal from 'options/shared/modal'
import { getArAccounts } from 'options/selectors/accounts'
import { setDefaultAccount } from 'options/actions/defaultAccount'

import storage from 'services/storage'
import { setActivatedAccountAddress } from 'utils'

const SelectAccount = () => {
  const dispatch = useDispatch()
  const defaultAccount = useSelector(state => state.defaultAccount)
  const arAccounts = useSelector(getArAccounts)

  const onSelectAccount = async (e) => {
    const selectedAccountName = e.target.value
    const selectedAccount = find(arAccounts, v => v.accountName == selectedAccountName)
    dispatch(setDefaultAccount(selectedAccount))

    // set default account to storage
    await setActivatedAccountAddress(selectedAccount.address)
  }

  return (
    <div className='select-account-modal'>
      <div className='title'>Select your account</div>
      <select defaultValue={defaultAccount.accountName} onChange={(e) => onSelectAccount(e)} className='select'>
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
