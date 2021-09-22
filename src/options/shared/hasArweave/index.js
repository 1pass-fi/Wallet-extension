import React, { useState, useEffect } from 'react'

import { popupAccount } from 'services/account'
import './index.css'

const ArweaveOnly = ({ content }) => {
  return <div class='ar-only-message'>{content}</div>
}

export default (({ children, content }) => {
  const [hasArWallet, setHasArWallet] = useState(false)
  useEffect(() => {
    const showArweaveForm = async () => {
      setHasArWallet(await popupAccount.hasArweave())
    }

    showArweaveForm()
  }, [])

  useEffect(() => {
    console.log('HAS AR WALLET', hasArWallet)
  }, [hasArWallet])


  return !hasArWallet ? <ArweaveOnly content={content}/> : children
})
