// modules
import React, { useState, useEffect, useRef } from 'react'
import ReactTooltip from 'react-tooltip'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

// components
import Select from 'shared/select'

// assets
import DownArrowIcon from 'img/down-arrow-icon.svg'

// services
import { popupAccount } from 'services/account'

// utils
import { getAddressesFromAddressBook } from 'utils'

// svgs
import NoticeIcon from 'img/v2/notice-icon.svg'

const SendTokenForm = ({
  handleSendToken,
  recipient,
  setRecipient,
  selectedAccount,
  setSelectedAccount,
  enoughGas
}) => {
  const [accountOptions, setAccountOptions] = useState([])
  const [addressOptions, setAddressOptions] = useState([])
  const [isShowDropdown, setIsShowDropdown] = useState(false)

  const addressInputRef = useRef()

  useEffect(() => {
    const getAccountOptions = async () => {
      const arAccounts = await popupAccount.getAllMetadata()
      const options = arAccounts.map((account, index) => ({
        id: index,
        value: account.address,
        label: account.accountName,
        address: account.address,
        type: account.type
      }))

      setAccountOptions(options)
    }

    getAccountOptions()
  }, [])

  useEffect(() => {
    const getAddressList = async () => {
      const options = await getAddressesFromAddressBook()
      setAddressOptions(options)
    }

    getAddressList()
  }, [])

  const onChangeAccount = (selected) => {
    const account = find(accountOptions, (v) => v.value == selected)
    setSelectedAccount(account)
  }

  const onChangeRecipientAddress = (e) => {
    setRecipient({ address: e.target.value })
  }

  const onAddressDropdownChange = (account) => {
    if (isEmpty(account)) {
      setRecipient(null)
      addressInputRef.current.focus()
    } else {
      setRecipient(account)
    }

    setIsShowDropdown(false)
  }

  const AddressDropdown = ({ accounts = [], onChange, type }) => {
    return (
      <div className="accounts">
        <div className="different-address" onClick={() => onChange({})}>
          <div className="name">Enter Address Manually</div>
        </div>
        {accounts.map((account) => {
          if (account.type === type) {
            return (
              <div key={account.id} className="account" onClick={() => onChange(account)}>
                <div className="logo">
                  {account.type === TYPE.ARWEAVE && <ArweaveLogo />}
                  {account.type === TYPE.ETHEREUM && <EthereumLogo />}
                </div>
                <div className="info">
                  <div className="name">{account.accountName}</div>
                  <div className="address">{getDisplayAddress(account.address)}</div>
                </div>
              </div>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div className="pt-7.5 flex flex-col items-center">
      {/* SELECT ACCOUNT */}
      <Select
        options={accountOptions}
        placeholder="Select Account"
        onChange={onChangeAccount}
        label="FROM"
        isAccountAddress={true}
      />
      {/* RECIPIENT INPUT */}
      <div className="pt-7 recipient">
        <div className="label">TO</div>
        <div className="recipient-input">
          <input
            ref={(ip) => (addressInputRef.current = ip)}
            value={recipient.address}
            onChange={onChangeRecipientAddress}
            className="recipient-input-field"
            placeholder="Recipient’s Wallet Address"
          />
          <div
            className="address-dropdown"
            data-tip={isEmpty(selectedAccount) ? 'Please choose Sender Account first!' : ''}
            data-for="arrow-button"
          >
            <button
              className="arrow-button"
              disabled={isEmpty(selectedAccount)}
              onClick={(e) => {
                e.preventDefault()
                setIsShowDropdown((isShowDropdown) => !isShowDropdown)
              }}
            >
              <div
                className="arrow-icon"
                style={{ transform: !isShowDropdown ? 'none' : 'rotateX(180deg)' }}
              >
                <DownArrowIcon />
              </div>
            </button>
            <ReactTooltip place="top" effect="float" />
            <ReactTooltip id="arrow-button" place="left" effect="float" />
          </div>
          {isShowDropdown && !isEmpty(selectedAccount) && (
            <AddressDropdown
              accounts={addressOptions}
              onChange={onAddressDropdownChange}
              type={selectedAccount.type}
            />
          )}
        </div>
      </div>

      {!enoughGas && (
        <div
          className="mt-4.5 flex items-center bg-warning font-normal text-sm leading-6 text-center text-indigo rounded-sm"
          type="send-tokens"
          style={{ width: '219px', height: '24px' }}
        >
          <NoticeIcon className="mx-1.75" style={{ width: '17px', height: '17px' }} />
          Not Enough Funds or Gas
        </div>
      )}

      <button
        className="absolute bottom-15 bg-lightBlue font-normal text-sm text-center text-blue-800 leading-4 border border-lightBlue rounded-sm shadow"
        type="send-tokens"
        style={{ width: '200px', height: '38px' }}
        onClick={() => handleSendToken()}
      >
        Send Tokens
      </button>
    </div>
  )
}

export default SendTokenForm
