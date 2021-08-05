import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

import getSymbolFromCurrency from 'currency-symbol-map'

import InputField from 'shared/inputField'
import Select from 'shared/select'
import Button from 'shared/button'
import TransactionConfirmModal from 'popup/components/modals/transactionConfirmModal'
import { getDisplayAddress } from 'options/utils'

import WarningIcon from 'img/warning-icon2.svg'
import EditIcon from 'img/edit-icon.svg'
import { makeTransfer, setKoi } from 'actions/koi'
import { setError } from 'actions/error'
import { setWarning } from 'actions/warning'
import { ERROR_MESSAGE, WARNING_MESSAGE, RATE, NOTIFICATION, PATH } from 'koiConstants'

import './index.css'
import { setIsLoading } from 'popup/actions/loading'
import { setNotification } from 'popup/actions/notification'

import { popupAccount } from 'account'
import { TYPE } from 'account/accountConstants'

const SendKoiForm = ({
  arBalance,
  setError,
  setWarning,
  makeTransfer,
  setIsLoading,
  price,
  setNotification,
  currency: moneyCurrency,
  accounts
}) => {
  const history = useHistory()

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [balance, setBalance] = useState(null)
  const [koiBalance, setKoiBalance] = useState(null)

  const [accountOptions, setAccountOptions] = useState([])
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

  const onChangeAmount = (e) => {
    setAmount(e.target.value)
  }


  const handleSubmitForm = (e) => {
    e.preventDefault()
    // validations
    try {
      if (!(recipient.trim().length > 0 && amount.trim().length > 0)) {
        setError(ERROR_MESSAGE.EMPTY_FIELDS)
      } else if (Number(amount) < 0) {
        setError(ERROR_MESSAGE.INVALID_AMOUNT)
      } else if (!selectedAccount) {
        setError(ERROR_MESSAGE.SELECT_ACCOUNT)
      } else if (!selectedToken) {
        setError(ERROR_MESSAGE.SELECT_TOKEN)
      } else {
        if (Number(amount) === 0) {
          setWarning(WARNING_MESSAGE.SEND_ZERO_KOI)
        }
        setShowModal(true)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSendTransaction = async () => {
    try {
      setShowModal(false)
      setIsLoading(true)
      await makeTransfer(selectedAccount, Number(amount), recipient, selectedToken)
      setIsLoading(false)
      setNotification(NOTIFICATION.TRANSACTION_SENT)
      history.push(PATH.ACTIVITY)
    } catch (err) {
      setIsLoading(false)
      setError(err.message)
    } 
  }



  useEffect(() => {
    const getAccountOptions = async () => {
      const options = accounts.map((account, index) => ({
        id: index,
        value: account.accountName,
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
          console.log(selectedAccount)
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
  console.log(selectedAccount)

  return (
    <form className='send-koi-form' onSubmit={handleSubmitForm}>
      {/* AVAILABLE BALANCE */}
      {/* <div className="koi-balance">
        <b>{`${(selectedToken == 'KOII' ? koiBalance : !!selectedToken && balance) || '___'} ${selectedToken ? selectedToken : 'token'}`}</b>
      </div> */}
      {!isEmpty(selectedAccount) && (
        <div className='selected-account'>
          <div className='selected-account-left'>
            <div className='selected-account-label'>
              {selectedAccount.label}
            </div>
            <div className='selected-account-address'>
              {getDisplayAddress(selectedAccount.address, 4, 4)}
              <EditIcon
                className='edit-icon'
                onClick={() => setSelectedAccount({})}
              />
            </div>
          </div>
          <div className='selected-account-right'>{`${0.0} KOII avalable`}</div>
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
      {selectedAccount && (
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
        <InputField
          label='To'
          placeholder='Recipient’s wallet address'
          className='form-input'
          type='text'
          onChange={onChangeRecipientAddress}
          value={recipient}
        />
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
          placeholder={`Amount of ${selectedToken} to send`}
          className='form-input'
          type='number'
          onChange={onChangeAmount}
          value={amount}
        />
        {/* {amount.trim().length > 0 && (
          <div hidden={token == 'KOII'} className="amount-in-usd">
            {getSymbolFromCurrency(moneyCurrency) || ''} {numberFormat(Number(amount) * price[token])} {moneyCurrency}
          </div>
        )} */}
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
        />
      )}
    </form>
  )
}

const mapStateToProps = (state) => ({ 
  price: state.price, 
  currency: state.currency,
  accounts: state.accounts
})

const mapDispatchToProps = { 
  setError, 
  setWarning, 
  makeTransfer, 
  setIsLoading, 
  setNotification 
}

export default connect(mapStateToProps, mapDispatchToProps)(SendKoiForm)
