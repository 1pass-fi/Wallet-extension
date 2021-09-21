// modules
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

// components
import GlobalButton from 'shared/globalButton'
import Button from 'shared/button'
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

export const AccountHome = ({ getBalances, accounts }) => {
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

  const goToGallery = () => {
    const url = chrome.extension.getURL('options.html')
    chrome.tabs.create({ url })
  }

  return (
    <div>
      <GlobalButton onClick={onClickGlobalSendButton} currency={currency} />
      {showForm && <SendKoiForm />}
      <div className="accounts-wrapper">
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
        <div className="button">
          <PlusIcon />
        </div>
      </div>
      <div className={'home-gallery-button-wrapper'}>
        <button onClick={goToGallery} className="gallery-button">
          Go to My Gallery
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  accounts: state.accounts,
})

export default connect(mapStateToProps, { getBalances })(AccountHome)
