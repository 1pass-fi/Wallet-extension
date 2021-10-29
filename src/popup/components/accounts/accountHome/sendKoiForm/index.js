// modules
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

// components
import InputField from 'shared/inputField'
import Select from 'shared/select'
import Button from 'shared/button'
import TransactionConfirmModal from 'popup/components/modals/transactionConfirmModal'

// assets
import DownArrowIcon from 'img/down-arrow-icon.svg'
import EditIcon from 'img/edit-icon.svg'
import WarningIcon from 'img/warning-icon-outline-orange.svg'
import ArweaveLogo from 'img/arweave-icon.svg'
import EthereumLogo from 'img/ethereum-logo-18.svg'

// actions
import { makeTransfer } from 'actions/koi'
import { setError } from 'actions/error'
import { setWarning } from 'actions/warning'
import { setIsLoading } from 'popup/actions/loading'
import { setNotification } from 'popup/actions/notification'

// constants
import { ERROR_MESSAGE, NOTIFICATION, PATH } from 'constants/koiConstants'

import { TYPE } from 'constants/accountConstants'

// services
import { popupAccount } from 'services/account'
import storage from 'services/storage'

// utils
import { getDisplayAddress, formatNumber } from 'options/utils'
import { fiatCurrencyFormat, getAddressesFromAddressBook } from 'utils'

// styles
import './index.css'


const SendKoiForm = ({
  setError,
  makeTransfer,
  setIsLoading,
  setNotification,
  accounts,
  price
}) => {
  const history = useHistory()

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [balance, setBalance] = useState(null)
  const [koiBalance, setKoiBalance] = useState(null)

  const [accountOptions, setAccountOptions] = useState([])
  const [addressOptions, setAddressOptions] = useState([])
  const [isShowDropdown, setIsShowDropdown] = useState(false)
  const addressInputRef = useRef()

  const [tokenOptions, setTokenOptions] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [selectedToken, setSelectedToken] = useState(null)

  const onChangeAccount = (selected) => {
    const account = find(accountOptions, v => v.value == selected)
    setSelectedAccount(account)
  }

  const onChangeToken = (selectedToken) => {
    setSelectedToken(selectedToken)
  }

  const onChangeRecipientAddress = (e) => {
    setRecipient(e.target.value)
  }

  const onAddressDropdownChange = (account) => {
    if (isEmpty(account)) {
      setRecipient('')
      addressInputRef.current.focus()
    } else {
      setRecipient(account.address)
    }

    setIsShowDropdown(false)
  }

  const onChangeAmount = (e) => {
    setAmount(e.target.value)
  }

  const handleSubmitForm = (e) => {
    e.preventDefault()
    // validations
    if (!(recipient.trim().length > 0 && amount.trim().length > 0)) {
      setError(ERROR_MESSAGE.EMPTY_FIELDS)
      return
    }
    if (Number(amount) < 0) {
      setError(ERROR_MESSAGE.INVALID_AMOUNT)
      return
    }
    if (isEmpty(selectedAccount)) {
      setError(ERROR_MESSAGE.SELECT_ACCOUNT)
      return
    } 
    if (isEmpty(selectedToken)) {
      setError(ERROR_MESSAGE.SELECT_TOKEN)
      return
    } 
    if (Number(amount) === 0) {
      setError(ERROR_MESSAGE.SEND_ZERO_KOI)
      return
    }
    setShowModal(true)
  }

  const handleSendTransaction = async () => {
    try {
      setShowModal(false)
      setIsLoading(true)
      if (selectedAccount.type === TYPE.ETHEREUM) {
        const account = await popupAccount.getAccount({ address: selectedAccount.address })
        const provider = await account.get.provider()
        if (provider.includes('mainnet')) {
          // setError(ERROR_MESSAGE.SEND_WITH_ETH)
          // setIsLoading(false)
          // return
        }
      }
      await makeTransfer(selectedAccount, Number(amount), recipient, selectedToken)
      setIsLoading(false)
      setNotification(NOTIFICATION.TRANSACTION_SENT)
      history.push(PATH.ACTIVITY)
    } catch (err) /* istanbul ignore next */ {
      setIsLoading(false)
      setError(err.message)
    } 
  }

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
    const getTokenOptions = async () => {
      setSelectedToken(null)
      const account = await popupAccount.getAccount({ address: selectedAccount.address })
      let options
      switch (selectedAccount.type) {
        case TYPE.ARWEAVE:
          options = [{ value: 'AR', label: 'AR' }, { value: 'KOII', label: 'KOII' }]
          setTokenOptions(options)
          setBalance(await account.get.balance())
          setKoiBalance(await account.get.koiBalance())
          break
        case TYPE.ETHEREUM:
          options = [{ value: 'ETH', label: 'ETH' }]
          setTokenOptions(options)
          setBalance(await account.get.balance())
      }
    }

    if (selectedAccount) getTokenOptions()
  }, [selectedAccount])

  useEffect(() => {
    const getAddressList = async () => {
      const options = await getAddressesFromAddressBook()
      setAddressOptions(options)
    }

    getAddressList()
  }, [])

  const AddressDropdown = ({ accounts = [], onChange, type }) => {
    return (
      <div className='accounts'>
        <div className='different-address' onClick={() => onChange({})}>
          <div className='name'>Enter Address Manually</div>
        </div>
        {accounts.map((account) => {
          if (account.type === type) {
            return (
              <div
                key={account.id}
                className='account'
                onClick={() => onChange(account)}
              >
                <div className='logo'>
                  {account.type === TYPE.ARWEAVE && <ArweaveLogo />}
                  {account.type === TYPE.ETHEREUM && <EthereumLogo />}
                </div>
                <div className='info'>
                  <div className='name'>{account.accountName}</div>
                  <div className='address'>{getDisplayAddress(account.address)}</div>
                </div>
              </div>
            )
          }
        })}
      </div>
    )
  }

  return (
    <form className='send-koi-form' onSubmit={handleSubmitForm}>
      {/* AVAILABLE BALANCE */}
      {!isEmpty(selectedAccount) && (
        <div className='selected-account'>
          <div className='selected-account-left'>
            <div className='selected-account-label'>
              {selectedAccount.label}
            </div>
            <div className='selected-account-address'>
              {getDisplayAddress(selectedAccount.address, 4, 4)}
              <div className='edit-icon'><EditIcon
                data-testid='editBtn'
                className='edit-icon'
                onClick={() => {
                  setSelectedAccount({})
                  setIsShowDropdown(false)
                }}
              /></div>
            </div>
          </div>
          <div className='selected-account-right'>{selectedToken ? 
            `${selectedToken == 'KOII' ? formatNumber(koiBalance, 2) : formatNumber(balance, 6)} ${selectedToken} available` : ''}</div>
        </div>
      )}
      {/* SELECT ACCOUNT */}
      {isEmpty(selectedAccount) && <Select
        className='currency-select'
        options={accountOptions}
        placeholder='Select your account'
        onChange={onChangeAccount}
        label='From'
      />}
      {/* SELECT TOKEN */}
      {!isEmpty(selectedAccount) && (
        <Select
          className='currency-select'
          options={tokenOptions}
          label={'Select Currency'}
          placeholder='Select token'
          onChange={onChangeToken}
        />
      )}

      {/* RECIPIENT INPUT */}
      <div className='recipient'>
        <div className='label'>To</div>
        <div className='recipient-input'>
          <input
            ref={(ip) => (addressInputRef.current = ip)}
            value={recipient}
            onChange={onChangeRecipientAddress}
            className='recipient-input-field'
            placeholder='Recipient’s wallet address'
          />
          <div className='address-dropdown' 
            data-tip={isEmpty(selectedAccount) ? 'Please choose Sender Account first!' : ''}
            data-for='arrow-button'>
            <button 
              className='arrow-button'
              disabled={isEmpty(selectedAccount)}
              onClick={(e) => {
                e.preventDefault()
                setIsShowDropdown(isShowDropdown => !isShowDropdown)
              }}
            >
              <div className='arrow-icon' style={{transform: !isShowDropdown ? 'none' : 'rotateX(180deg)'}}>
                <DownArrowIcon />
              </div>
            </button>
            <ReactTooltip place='top' effect='float' />
            <ReactTooltip id='arrow-button' place='left' effect='float' />
          </div>
          {(isShowDropdown && !isEmpty(selectedAccount)) && (
            <AddressDropdown
              accounts={addressOptions}
              onChange={onAddressDropdownChange}
              type={selectedAccount.type}
            />
          )}
        </div>
      </div>

      {/* HINT */}
      <div className='warning'>
        <div className='warning-icon'>
          <WarningIcon />
        </div>
        <div className='warning-message'>
          Make sure you have the correct wallet address. There is no way to
          reverse the transaction.
        </div>
      </div>

      {/* AMOUNT INPUT */}
      <div className='amount'>
        <InputField
          label='Amount'
          placeholder={`Amount ${selectedToken ? 'of ' + selectedToken + ' ' : ''}to send`}
          className='form-input'
          type='number'
          onChange={onChangeAmount}
          value={amount}
        />
        {selectedToken === 'AR' && <div className='amount-exchanged'>${fiatCurrencyFormat(amount * price.AR)} USD</div>}
      </div>

      <Button
        label={`Send ${selectedToken ? selectedToken : 'token'}`}
        className='send-button'
      />
      {showModal && (
        <TransactionConfirmModal
          sentAmount={Number(amount)}
          currency={selectedToken}
          accountAddress={recipient}
          onClose={() => {
            setShowModal(false)
          }}
          onSubmit={handleSendTransaction}
          selectedAccount={selectedAccount}
        />
      )}
    </form>
  )
}

const mapStateToProps = (state) => ({ 
  price: state.price, 
  currency: state.currency,
  accounts: state.accounts,
})

const mapDispatchToProps = { 
  setError, 
  makeTransfer, 
  setIsLoading, 
  setNotification 
}

export default connect(mapStateToProps, mapDispatchToProps)(SendKoiForm)
