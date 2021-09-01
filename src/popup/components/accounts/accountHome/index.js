// modules
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

// components
import GlobalButton from 'shared/globalButton'
import SendKoiForm from './sendKoiForm'
import Wallet from './wallet'

// assets
import PlusIcon from 'img/plus-icon.svg'

// actions
import { getBalances } from 'actions/koi'

// constants
import { RATE } from 'constants/koiConstants'

// styles
import './index.css'

export const AccountHome = ({ koi, ethereum, getBalances, accounts }) => {
  let currencies = []
  for (const [key, _] of Object.entries(RATE)) {
    currencies.push({ label: key, value: key, id: key })
  }

  const defaultCurrency = currencies[0].value

  const [showForm, setShowForm] = useState(false)
  const [currency, setCurrency] = useState(defaultCurrency)
  const history = useHistory()

  useEffect(() => {
    getBalances()

    return history.listen((location) => {
      const openSendForm =
        new URLSearchParams(location.search).get('openSendForm') === 'true'
      setShowForm(openSendForm)
      if (!openSendForm) {
        setCurrency(defaultCurrency)
      }
    })
  }, [])

  const onSendSuccess = () => {
    setShowForm(false)
    setCurrency(defaultCurrency)
  }

  const onChangeCurrency = (newCurrency) => {
    setCurrency(newCurrency)
  }

  const onClickGlobalSendButton = () => {
    if (showForm) {
      setCurrency(defaultCurrency)
      history.replace('/account')
    } else {
      history.replace('/account?openSendForm=true')
    }
  }

  const onAddAccount = () => {
    history.push('/account/welcome')
  }

  return (
    <div>
      {/* {koi.address && <GlobalButton onClick={onClickGlobalSendButton} currency={currency}/>} */}
      <GlobalButton onClick={onClickGlobalSendButton} currency={currency} />
      {showForm && (
        <SendKoiForm
          koiBalance={koi.koiBalance}
          arBalance={koi.arBalance}
          onUpdateCurrency={onChangeCurrency}
          currencies={currencies}
          onSendSuccess={onSendSuccess}
        />
      )}
      {/* {koi.address ? <Wallet accountAddress={koi.address} koiBalance={koi.koiBalance} arBalance={koi.arBalance} /> :
        <Link to='/account/import' className="plus-button">
          <PlusIcon />
        </Link>} */}
      <div className='accounts-wrapper'>
        {accounts.map((account, index) => (
          <Wallet key={index} account={account} />
        ))}
      </div>
      <div
        onClick={onAddAccount}
        className={`home-plus-button-wrapper ${
          accounts.length % 2 === 0 ? 'white' : ''
        }`}
      >
        <div className='button'>
          <PlusIcon />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  koi: state.koi,
  ethereum: state.ethereum,
  accounts: state.accounts,
})

export default connect(mapStateToProps, { getBalances })(AccountHome)
