import React, { useState } from 'react'
import { connect } from 'react-redux'

import InputField from 'shared/inputField'
import Select from 'shared/select'
import Button from 'shared/button'
import TransactionConfirmModal from 'popup/components/modals/transactionConfirmModal'

import WarningIcon from 'img/warning-icon.svg'

import { makeTransfer } from 'actions/koi'
import { setError } from 'actions/error'
import { setWarning } from 'actions/warning'
import { ERROR_MESSAGE, WARNING_MESSAGE, RATE, NOTIFICATION } from 'koiConstants'

import './index.css'
import { setIsLoading } from 'popup/actions/loading'
import { setNotification } from 'popup/actions/notification'

const SendKoiForm = ({
  koiBalance,
  arBalance,
  currencies,
  onUpdateCurrency,
  setError,
  setWarning,
  makeTransfer,
  onSendSuccess,
  setIsLoading,
  price,
  setNotification
}) => {
  const defaultCur = currencies[0].value

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
    onUpdateCurrency(newCurr)
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
        if (Number(amount) === 0) {
          setWarning(WARNING_MESSAGE.SEND_ZERO_KOI)
        }
        setShowModal(true)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const hanldeTransaction = async () => {
    setShowModal(false)
    setIsLoading(true)
    await makeTransfer(Number(amount), address, currency)
    setIsLoading(false)
    setNotification(NOTIFICATION.TRANSACTION_SENT)
    // onSendSuccess()
  }

  const numberFormat = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }).format(num)
  }

  return (
    <form className="send-koi-form" onSubmit={handleSubmitForm}>
      <div className="koi-balance">
        <span>Available balance: </span>
        <b>{`${selectBalance(currency)} ${currency}`}</b>
        <div hidden={currency == 'KOI'} className="amount-in-usd">
          ${numberFormat(selectBalance(currency) * price[currency])} USD
        </div>
      </div>
      <Select 
        className='currency-select'
        options={currencies}
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
          <div hidden={currency == 'KOI'} className="amount-in-usd">
            $ {numberFormat(Number(amount) * price[currency])} USD
          </div>
        )}
      </div>
      <Button label={`Send ${currency}`} className="send-button" />
      {showModal && (
        <TransactionConfirmModal
          sentAmount={Number(amount)}
          currency={currency}
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

const mapStateToProps = (state) => ({ price: state.price })

export default connect(mapStateToProps, { setError, setWarning, makeTransfer, setIsLoading, setNotification })(SendKoiForm)
