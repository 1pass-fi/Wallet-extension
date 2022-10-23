// modules
import React, { useEffect, useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import clsx from 'clsx'
// assets
import DownArrowIcon from 'img/v2/dropdown/down-icon-blue.svg'
// svgs
import NoticeIcon from 'img/v2/notice-icon.svg'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import formatLongString from 'options/utils/formatLongString'
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
  const ref = useRef(null)
  const recipientsRef = useRef(null)

  const accounts = useSelector((state) => state.accounts)
  const [accountOptions, setAccountOptions] = useState([])
  const [addressOptions, setAddressOptions] = useState([])
  const [isShowDropdown, setIsShowDropdown] = useState(false)

  const addressInputRef = useRef()

  useEffect(() => {
    const getAccountOptions = async () => {
      const arAccounts = await popupAccount.getAllMetadata()
      const options = arAccounts.map((account, index) => ({
        id: account.address,
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
      let options = await getAddressesFromAddressBook(selectedAccount.type)
      options = options.concat(accounts.filter((account) => account.type === selectedAccount.type))
      setAddressOptions(options)
    }

    getAddressList()
  }, [selectedAccount])

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

  const AddressDropdown = React.forwardRef(({ accounts = [], onChange, type }, recipientsRef) => {
    return (
      <div
        className="bg-blue-800 border-b-2 border-white z-30 absolute w-full max-h-72 flex flex-col overflow-y-auto rounded-b-finnie select-none"
        ref={recipientsRef}
      >
        <button
          className="text-left pl-2 h-8 text-white text-sm hover:bg-blue-500"
          onClick={() => onChange({})}
        >
          Enter Address Manually
        </button>
        {accounts.map((account) => {
          // if (account.type === type && account.address !== selectedAccount.address) {
          if (account.address !== selectedAccount.address) {
            return (
              <div
                key={account.address}
                className="text-left pl-2 h-8 text-white text-sm hover:bg-blue-500"
                onClick={() => onChange(account)}
              >
                <div>{formatLongString(account.accountName, 40)}</div>
              </div>
            )
          }
        })}
      </div>
    )
  })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (recipientsRef.current && recipientsRef.current.contains(event.target)) {
        return
      } else if (ref.current && !ref.current.contains(event.target)) {
        setIsShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [recipientsRef])

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
          defaultOption={selectedAccount.label}
        />
      </div>
      {/* RECIPIENT INPUT */}
      <div className="mt-7 recipient" style={{ width: '352px' }}>
        <div className="text-sm pl-1.5 mb-1.5 font-semibold">TO</div>
        <div
          className="w-full relative text-left rounded-finnie border-t-2 border-r-2 border-l-2 border-white shadow-lg"
          ref={ref}
        >
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
              ref={recipientsRef}
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
