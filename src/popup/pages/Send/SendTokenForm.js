// modules
import React, { useEffect, useRef,useState } from 'react'
import ReactTooltip from 'react-tooltip'
import clsx from 'clsx'
// assets
import DownArrowIcon from 'img/v2/dropdown/down-icon-blue.svg'
// svgs
import NoticeIcon from 'img/v2/notice-icon.svg'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
// services
import { popupAccount } from 'services/account'
// components
import Select from 'shared/select'
// utils
import { getAddressesFromAddressBook } from 'utils'

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
      addressInputRef.current.focus()
    } else {
      setRecipient(account)
    }

    setIsShowDropdown(false)
  }

  const AddressDropdown = ({ accounts = [], onChange, type }) => {
    return (
      <div className="bg-blue-800 border-b-2 border-white z-40 absolute w-full max-h-72 flex flex-col overflow-y-auto rounded-b-finnie select-none">
        <button
          className="text-left pl-2 h-8 text-white text-sm hover:bg-blue-500"
          onClick={() => onChange({})}
        >
          Enter Address Manually
        </button>
        {accounts.map((account) => {
          if (account.type === type) {
            return (
              <div
                key={account.id}
                className="text-left pl-2 h-8 text-white text-sm hover:bg-blue-500"
                onClick={() => onChange(account)}
              >
                <div>{account.accountName}</div>
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
      <div style={{ width: '352px' }}>
        <Select
          options={accountOptions}
          placeholder="Select Account"
          onChange={onChangeAccount}
          label="FROM"
          isAccountAddress={true}
        />
      </div>
      {/* RECIPIENT INPUT */}
      <div className="mt-7 recipient" style={{ width: '352px' }}>
        <div className="text-sm pl-1.5 mb-1.5 font-semibold">TO</div>
        <div className="w-full relative text-left rounded-finnie border-t-2 border-r-2 border-l-2 border-white shadow-lg">
          <div
            className="border-b-2 rounded-finnie border-white text-white h-8 flex"
            data-tip={isEmpty(selectedAccount) ? 'Please choose Sender Account first!' : ''}
          >
            <input
              ref={(ip) => (addressInputRef.current = ip)}
              value={recipient.address}
              onChange={onChangeRecipientAddress}
              className={clsx(
                isEmpty(selectedAccount) ? 'cursor-not-allowed' : 'cursor-pointer',
                'text-white border-b-2 text-sm font-semibold border-white bg-blue-800 h-8 pl-2 flex-grow rounded-l-finnie focus:outline-none placeholder-trueGray-400'
              )}
              placeholder="Recipient’s Wallet Address"
              disabled={isEmpty(selectedAccount)}
            />
            <div className="w-8 h-8 rounded-r-finnie" data-for="arrow-button">
              <button
                className={clsx(
                  isEmpty(selectedAccount) ? 'cursor-not-allowed' : 'cursor-pointer',
                  'border-b-2 border-white flex items-center justify-center bg-white w-8 h-8 rounded-r-finnie'
                )}
                disabled={isEmpty(selectedAccount)}
                onClick={(e) => {
                  e.preventDefault()
                  setIsShowDropdown((isShowDropdown) => !isShowDropdown)
                }}
              >
                <DownArrowIcon
                  className="h-1.75 w-3.25"
                  style={{ transform: !isShowDropdown ? 'none' : 'rotateX(180deg)' }}
                />
              </button>
            </div>
          </div>
          <ReactTooltip place="top" effect="float" />
          <ReactTooltip id="arrow-button" place="left" effect="float" />
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
        className="absolute bottom-12 bg-lightBlue font-normal text-sm text-center text-blue-800 leading-4 border border-lightBlue rounded-sm shadow-lg"
        type="send-tokens"
        style={{ width: '200px', height: '38px' }}
        onClick={() => {
          setIsShowDropdown(false)
          handleSendToken()
        }}
      >
        Send Tokens
      </button>
    </div>
  )
}

export default SendTokenForm
