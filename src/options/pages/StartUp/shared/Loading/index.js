import React from 'react'
import loadingIcon from 'img/loading-icon.gif'
import './index.css'

export default () => {
  return (
    <div className="create-wallet-loading-screen">
      <img className="create-wallet-loading-icon" src={loadingIcon} />
    </div>
  )
}
