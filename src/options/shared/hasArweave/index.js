import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { TYPE } from 'constants/accountConstants'
import { popupAccount } from 'services/account'
import './index.css'

const ArweaveOnly = ({ content }) => {
  return <div className='ar-only-message'>{content}</div>
}

export default (({ children, content, checkingDefaultAccount }) => {
  const [hasArWallet, setHasArWallet] = useState(false)

  const defaultAccount = useSelector(state => state.defaultAccount)


  useEffect(() => {
    const showArweaveForm = async () => {
      setHasArWallet(await popupAccount.hasArweave())
    }

    showArweaveForm()
  }, [])

  return ((checkingDefaultAccount && defaultAccount.type !== TYPE.ARWEAVE) || !hasArWallet) ? <ArweaveOnly content={content} /> : children
})
