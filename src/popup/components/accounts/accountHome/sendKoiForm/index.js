import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { find } from 'lodash'

import getSymbolFromCurrency from 'currency-symbol-map'

import InputField from 'shared/inputField'
import Select from 'shared/select'
import Button from 'shared/button'
import TransactionConfirmModal from 'popup/components/modals/transactionConfirmModal'

import WarningIcon from 'img/warning-icon.svg'

import { makeTransfer, setKoi } from 'actions/koi'
import { setError } from 'actions/error'
import { setWarning } from 'actions/warning'
import { ERROR_MESSAGE, WARNING_MESSAGE, RATE, NOTIFICATION, PATH } from 'koiConstants'

import './index.css'
import { setIsLoading } from 'popup/actions/loading'
import { setNotification } from 'popup/actions/notification'

import { Account } from 'account'
import { TYPE } from 'account/accountConstants'

const SendKoiForm = ({
  arBalance,
  setError,
  setWarning,
  makeTransfer,
  setIsLoading,
  price,
  setNotification,
  currency: moneyCurrency
}) => {
  const history = useHistory()

  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [wallets, setWallets] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [koiBalance, setKoiBalance] = useState(null)
  const [tokens, setTokens] = useState([])
  const [token, setToken] = useState(null)

  const onChangeAddress = (e) => {
    setAddress(e.target.value)
  }

  const onChangeAmount = (e) => {
    setAmount(e.target.value)
  }

  const onChangeToken = (selectedToken) => {
    setToken(selectedToken)
  }

  const selectBalance = (cur) => {
    return cur === 'KOII' ? koiBalance : arBalance
  }

  const handleSubmitForm = (e) => {
    e.preventDefault()

    // validations
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
    try {
      setShowModal(false)
      setIsLoading(true)
      await makeTransfer(selectedAccount, Number(amount), address, token)
      setIsLoading(false)
      setNotification(NOTIFICATION.TRANSACTION_SENT)
      history.push(PATH.ACTIVITY)
    } catch (err) {
      setIsLoading(false)
      setError(err.message)
    } 
  }

  const numberFormat = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }).format(num)
  }

  const onChangeAccount = (selected) => {
    const wallet = find(wallets, v => v.value == selected)
    setSelectedAccount(wallet)
  }

  useEffect(() => {
    const loadAccounts = async () => {
      let allWallets = await Account.getAllWallets()
      allWallets = await Promise.all(allWallets.map(async (wallet, index) => {
        const type = await Account.getTypeOfWallet(wallet.address)
        const _account = await Account.get(wallet, type)
        const name = await _account.get.accountName()
        return {value: name, id: index, label: name, ...wallet}
      }))
      console.log('allWallets', allWallets)
      setWallets(allWallets)
    }

    loadAccounts()
  }, [])


  useEffect(() => {
    const loadBalances = async () => {
      setToken(null)
      const type = await Account.getTypeOfWallet(selectedAccount.address)
      if (type == TYPE.ARWEAVE) setTokens([{value: 'AR', label: 'AR'}, {value: 'KOII', label: 'KOII'}])
      if (type == TYPE.ETHEREUM) setTokens([{value: 'ETH', label: 'ETH'}])
      console.log('selectedAccount: ', selectedAccount)
      const _account = await Account.get(selectedAccount, type)
      console.log(await _account.get.address())
      const { koiBalance, balance } = await _account.method.getBalances()
      console.log(koiBalance, balance)
      setKoiBalance(koiBalance)
      setBalance(balance)
    }

    if (selectedAccount) loadBalances()
  }, [selectedAccount])


  return (
    <form className="send-koi-form" onSubmit={handleSubmitForm}>
      <div className="koi-balance">
        <span>Available balance: </span>
        <b>{`${(token == 'KOII' ? koiBalance : !!token && balance) || '___'} ${token ? token : 'token'}`}</b>
        {/* <div hidden={token == 'KOII'} className="amount-in-usd">
          {getSymbolFromCurrency(moneyCurrency) || ''}{numberFormat(selectBalance(token) * price[token])} {moneyCurrency}
        </div> */}
      </div>
      <Select 
        className='currency-select'
        options={wallets}
        placeholder='Select your account'
        onChange={onChangeAccount}
      />
      {selectedAccount && <Select
        className='currency-select'
        options={tokens}
        placeholder='Select token'
        onChange={onChangeToken}
      />}
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
          placeholder={`Amount of ${token} to send`}
          className="form-input"
          type="number"
          onChange={onChangeAmount}
          value={amount}
        />
        {/* {amount.trim().length > 0 && (
          <div hidden={token == 'KOII'} className="amount-in-usd">
            {getSymbolFromCurrency(moneyCurrency) || ''} {numberFormat(Number(amount) * price[token])} {moneyCurrency}
          </div>
        )} */}
      </div>
      <Button label={`Send ${token ? token : 'token'}`} className="send-button" />
      {showModal && (
        <TransactionConfirmModal
          sentAmount={Number(amount)}
          currency={token}
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

const mapStateToProps = (state) => ({ price: state.price, currency: state.currency })

export default connect(mapStateToProps, { setError, setWarning, makeTransfer, setIsLoading, setNotification })(SendKoiForm)
