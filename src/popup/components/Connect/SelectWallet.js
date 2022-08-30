// modules
import React from 'react'
import ArweaveIcon from 'img/arweave-icon.svg'
// assets
import KoiIcon from 'img/koi-logo.svg'
import isEmpty from 'lodash/isEmpty'
// components
import CheckBoxLight from 'options/finnie-v2/components/CheckBox/CheckBoxLight'

const walletIcon = {
  koi: <KoiIcon className="wallet-icon" />,
  arweave: <ArweaveIcon className="wallet-icon" />
}

const SelectWallet = ({
  accounts,
  onChecked,
  setStep,
  checkedAddress,
  setCheckedAddress,
  handleOnClick,
  isKoi
}) => {
  return (
    <div
      className="w-full flex flex-col pl-8 pr-1.5 overflow-y-scroll"
      style={{ maxHeight: '144px' }}
      // style={isKoi ? { maxHeight: '104px' } : { maxHeight: '138px' }}
    >
      {accounts.map((account) => (
        <div
          // className={`wallet-option ${account.address === checkedAddress && 'checked'}`}
          className="flex mb-3 items-start"
          key={account.address}
          onClick={() => {
            if (account.address === checkedAddress) {
              setCheckedAddress('')
            } else {
              setCheckedAddress(account.address)
            }
          }}
        >
          <CheckBoxLight
            checked={account.address === checkedAddress}
            disabled={false}
            onClick={() => {
              if (account.address === checkedAddress) {
                setCheckedAddress('')
              } else {
                setCheckedAddress(account.address)
              }
            }}
          />
          {walletIcon[account.type]}
          <div className="flex flex-col ml-2.75">
            <div className="mb-1 font-semibold text-xs leading-4 tracking-finnieSpacing-wide text-indigo">
              {account.accountName}
              {account.address === checkedAddress && (
                <span className="font-normal text-xs leading-4 tracking-finnieSpacing-wide text-indigo">
                  {' '}
                  (Default)
                </span>
              )}
            </div>
            <div className="font-normal text-xs leading-4 tracking-finnieSpacing-wide text-success-700">
              {account.address.substring(0, 12)}
              ...
              {account.address.substring(32, 43)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SelectWallet
