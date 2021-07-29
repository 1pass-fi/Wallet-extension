import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import GlobalButton from 'shared/globalButton'
import SendKoiForm from './sendKoiForm'

import PlusIcon from 'img/plus-icon.svg'
import { Link } from 'react-router-dom'
import './index.css'

import Wallet from './wallet'
import { getBalances } from 'actions/koi'
import { RATE, STORAGE } from 'koiConstants'

export const AccountHome = ({ koi, ethereum, getBalances, accounts }) => {
  let currencies = []
  for (const [key, _] of Object.entries(RATE)) {
    currencies.push({label: key, value: key, id: key})
  }

  const defaultCurrency = currencies[0].value

  const [showForm, setShowForm] = useState(false)
  const [currency, setCurrency] = useState(defaultCurrency)
  const history = useHistory()

  useEffect(() => {
    getBalances()

    return history.listen((location) => {
      const openSendForm = new URLSearchParams(location.search).get('openSendForm') === 'true'
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
      <GlobalButton onClick={onClickGlobalSendButton} currency={currency}/>
      {showForm && <SendKoiForm
        koiBalance={koi.koiBalance}
        arBalance={koi.arBalance}
        onUpdateCurrency={onChangeCurrency}
        currencies={currencies}
        onSendSuccess={onSendSuccess}
      />}
      {/* {koi.address ? <Wallet accountAddress={koi.address} koiBalance={koi.koiBalance} arBalance={koi.arBalance} /> :
        <Link to='/account/import' className="plus-button">
          <PlusIcon />
        </Link>} */}
      <div className='accounts-wrapper'>
        {accounts.map((account, index) => <Wallet key={index} account={account}/>)}
      </div>
      <div onClick={onAddAccount} className='home-plus-button-wrapper'>
        <div className='button'><PlusIcon /></div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({ koi: state.koi, ethereum: state.ethereum, accounts: state.accounts })

export default connect(mapStateToProps, { getBalances })(AccountHome)
