// modules
import React from 'react'
import isEmpty from 'lodash/isEmpty'

// assets
import KoiIcon from 'img/koi-logo.svg'
import ArweaveIcon from 'img/arweave-icon.svg'

// components
import Button from 'popup/components/shared/button'

// styles
import '../index.css'

const walletIcon = {
  koi: <KoiIcon className='wallet-icon' />,
  arweave: <ArweaveIcon className='wallet-icon' />,
}

const SelectWallet = ({
  accounts,
  onChecked,
  setStep,
  checkedAddress,
  setCheckedAddress,
  handleOnClick,
}) => {
  return (
    <>
      <div className='select-account'>Select accounts</div>
      {/* {accounts.lenght > 1 && (
        <div>
          <button className='unselect-button' onClick={clearChecked}>
            -
          </button>
          <button className='select-all-button' onClick={checkAll}>
            Select all
          </button>
        </div>
      )} */}
      <div className='wallet-options'>
        {accounts.map((account) => (
          <div
            className={`wallet-option ${
              (account.address === checkedAddress) && 'checked'
            }`}
            key={account.address}
            onClick={() => setCheckedAddress(account.address)}
          >
            {/* <Checkbox
              value={account.address==checkedAddress}
              className='check-wallet'
              isDisabled={false}
              onChange={() => setCheckedAddress(account.address)}
            /> */}
            {walletIcon[account.type]}
            <div className='wallet-info'>
              <div className='wallet-name'>{account.accountName}</div>
              <div className='wallet-address'>
                {account.address.substring(0, 6)}
                ...
                {account.address.substring(38, 43)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='trust-sites'>Only connect with sites you trust.</div>
      <div className='button-line'>
        <Button
          className='button connect'
          label='Connect'
          onClick={() => setStep(2)}
          isEnable={!isEmpty(checkedAddress)}
        />
        <Button
          className='button reject'
          type='outline'
          label='Reject'
          onClick={() => handleOnClick(false)}
        />
      </div>
    </>
  )
}

export default SelectWallet
