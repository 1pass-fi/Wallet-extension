import React from 'react'
import { connect } from 'react-redux' 

import loadingIcon from 'img/loading-icon.gif'
import './index.css'

const Loading = ({ creatingWallet }) => {
  return (
    <div className="loading-screen">
      <img className="loading-icon" src={loadingIcon} />
      {creatingWallet && <div className='creating-wallet-statement'>
        We are building a highly encrypted key for you to use, this can take up to a minute.
      </div>}
    </div>
  )
}

const mapStateToProps = (state) => ({ creatingWallet: state.creatingWallet })

export default connect(mapStateToProps)(Loading)
