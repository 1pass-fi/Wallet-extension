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

export const AccountHome = ({ koi, getBalances }) => {
  const [showForm, setShowForm] = useState(false)
  const history = useHistory()

  useEffect(() => {
    getBalances()

    return history.listen((location) => {
      const openSendForm = new URLSearchParams(location.search).get('openSendForm') === 'true'
      setShowForm(openSendForm)
    })
  }, [])

  const onSendSuccess = () => {
    setShowForm(false)
  }
  const onClickGlobalSendButton = () => {
    if (showForm) {
      history.replace('/account')
    } else {
      history.replace('/account?openSendForm=true')
    }
  }
  return (
    <div>
      {koi.address && <GlobalButton onClick={onClickGlobalSendButton} />}
      {showForm && <SendKoiForm
        koiBalance={koi.koiBalance}
        onSendSuccess={onSendSuccess}
      />}
      {koi.address ? <Wallet accountAddress={koi.address} koiBalance={koi.koiBalance} arBalance={koi.arBalance} /> :
        <Link to='/account/import' className="plus-button">
          <PlusIcon />
        </Link>}
    </div>
  )
}

const mapStateToProps = (state) => ({ koi: state.koi })

export default connect(mapStateToProps, { getBalances })(AccountHome)
