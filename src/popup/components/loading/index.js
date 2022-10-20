// modules
import React from 'react'
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

export default Loading
