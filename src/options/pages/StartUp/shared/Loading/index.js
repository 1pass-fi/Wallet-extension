import React, { useEffect, useState } from 'react'
import loadingIcon from 'img/loading-icon.gif'

import './index.css'

export default ({ show }) => {
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoadingScreen(true)
    }, 300)
    return () => clearTimeout(timeout)
  }, [show])

  return !showLoadingScreen ? null : (
    <div className="create-wallet-loading-screen">
      <img className="create-wallet-loading-icon" src={loadingIcon} />
    </div>
  )
}
