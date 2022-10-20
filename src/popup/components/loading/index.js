// modules
import React from 'react'
import { connect } from 'react-redux'
// assets
import loadingIcon from 'img/loading-icon.gif'

// styles
import './index.css'

const Loading = () => {
  return (
    <div className="loading-screen">
      <img className="loading-icon" src={loadingIcon} />
    </div>
  )
}

const mapStateToProps = (state) => ({ creatingWallet: state.creatingWallet })

export default connect(mapStateToProps)(Loading)
