import React, { useState } from 'react'
import { connect } from 'react-redux'

import GlobalButton from 'shared/globalButton/index'
import SendKoiForm from './sendKoiForm/index'

import PlusIcon from 'img/plus-icon.svg'
import { Link } from 'react-router-dom'
import './index.css'

import Wallet from './wallet/index'

import { RATE } from 'constants'

export const AccountHome = ({ koi }) => {
  const [showForm, setShowForm] = useState(false)
  const onSendSuccess = () => {
    setShowForm(false)
  }
  return (
    <div>
      {koi.address && <GlobalButton onClick={() => setShowForm(prev => !prev)} />}
      {showForm && <SendKoiForm
        koiBalance={koi.koiBalance}
        rate={RATE.KOI}
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

export default connect(mapStateToProps)(AccountHome)
