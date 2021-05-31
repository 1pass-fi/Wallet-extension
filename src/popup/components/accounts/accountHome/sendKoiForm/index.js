import React, { useState } from 'react'
import { connect } from 'react-redux'

import InputField from 'shared/inputField'
import Select from 'shared/select'
import Button from 'shared/button'
import TransactionConfirmModal from 'popup/components/modals/transactionConfirmModal'

import WarningIcon from 'img/warning-icon.svg'

import { makeTransfer } from 'actions/koi'
import { setError } from 'actions/error'
import { ERROR_MESSAGE, RATE } from 'koiConstants'

import './index.css'

const SendKoiForm = ({
  koiBalance,
  arBalance,
  setError,
  makeTransfer,
  onSendSuccess,
}) => {
  let options = []
  for (const [key, _] of Object.entries(RATE)) {
    options.push({label: key, value: key})
  }

  const defaultCur = options[0].value

  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currency, setCurrency] = useState(defaultCur)

  const onChangeAddress = (e) => {
    setAddress(e.target.value)
  }

  const onChangeAmount = (e) => {
    setAmount(e.target.value)
  }

  const onChangeCurrency = (newCurr) => {
    setCurrency(newCurr)
  }

  const selectBalance = (cur) => {
    return cur === 'KOI' ? koiBalance : arBalance
  }

  const handleSubmitForm = (e) => {
    e.preventDefault()
    try {
      if (!(address.trim().length > 0 && amount.trim().length > 0)) {
        setError(ERROR_MESSAGE.EMPTY_FIELDS)
      } else if (Number(amount) < 0) {
        setError(ERROR_MESSAGE.INVALID_AMOUNT)
      } else {
        setShowModal(true)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const hanldeTransaction = () => {
    setShowModal(false)
    makeTransfer({ qty: Number(amount), address: address })
    onSendSuccess()
  }

  const numberFormat = (num) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <form className="send-koi-form" onSubmit={handleSubmitForm}>
      <div className="koi-balance">
        <span>Available balance: </span>
        <b>{`${selectBalance(currency)} ${currency}`}</b>
        <div className="amount-in-usd">
          ~ ${numberFormat(selectBalance(currency) * RATE[currency])} USD
        </div>
      </div>
      <Select 
        className='currency-select'
        options={options}
        defaultOption={defaultCur}
        onChange={onChangeCurrency}
      />
      <div className="recipient">
        <InputField
          label="To"
          placeholder="Recipient’s wallet address"
          className="form-input"
          type="text"
          onChange={onChangeAddress}
          value={address}
        />
      </div>
      <div className="warning">
        <div className="warning-icon">
          <WarningIcon />
        </div>
        <div className="warning-message">
          Make sure you have the correct wallet address. There is no way to
          reverse the transaction.
        </div>
      </div>
      <div className="amount">
        <InputField
          label="Amount"
          placeholder={`Amount of ${currency} to send`}
          className="form-input"
          type="number"
          onChange={onChangeAmount}
          value={amount}
        />
        {amount.trim().length > 0 && (
          <div className="amount-in-usd">
            ~ $ {numberFormat(Number(amount) * RATE[currency])} USD
          </div>
        )}
      </div>
      <Button label={`Send ${currency}`} className="send-button" />
      {showModal && (
        <TransactionConfirmModal
          koiAmount={Number(amount)}
          accountAddress={address}
          onClose={() => {
            setShowModal(false)
          }}
          onSubmit={hanldeTransaction}
        />
      )}
    </form>
  )
}

export default connect(null, { setError, makeTransfer })(SendKoiForm)
