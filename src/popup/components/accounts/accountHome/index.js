import React from 'react'
import { connect } from 'react-redux'

import PlusIcon from 'img/plus-icon.svg'
import { Link } from 'react-router-dom'
import './index.css'

import Wallet from './wallet/index'

export const AccountHome = ({ koi }) => {
  return (
    <div>
      {koi.address ? <Wallet accountAddress={koi.address} koiBalance={koi.koiBalance} arBalance={koi.arBalance} /> :
        <Link to='/account/import' className="plus-button">
          <PlusIcon />
        </Link>}
    </div>
  )
}

const mapStateToProps = (state) => ({ koi: state.koi })

export default connect(mapStateToProps)(AccountHome)
