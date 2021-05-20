import React from 'react'
import includes from 'lodash/includes'

import Button from 'popup/components/shared/button'
import '../index.css'

const SelectWallet = ({
  accounts,
  checkedList,
  clearChecked,
  checkAll,
  onChecked,
}) => {
  return (
    <>
      <div className='select-account'>Select accounts</div>
      <div>
        <button className='unselect-button' onClick={clearChecked}>
          -
        </button>
        <button className='select-all-button' onClick={checkAll}>
          Select all
        </button>
      </div>
      <div className='wallet-options'>
        {accounts.map((account) => (
          <div
            className={`wallet-option ${includes(checkedList, account.address) && 'checked'
            }`}
            key={account.address}
          >
            <input
              type='checkbox'
              className='check-wallet'
              checked={includes(checkedList, account.address)}
              onChange={(e) => onChecked(e, account.address)}
            />
            {walletIcon[account.type]}
            <div className='wallet-info'>
              <div className='wallet-name'>{account.name}</div>
              <div className='wallet-address'>
                {account.address.substring(0, 6)}
                ...
                {account.address.substring(38, 43)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>Only connect with sites you trust.</div>
      <div className='button-line'>
        <Button className='connect-button' label='Connect' />
        <Button className='reject-button' type='outline' label='Reject' />
      </div>
    </>
  )
}

export default SelectWallet
