import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import { TYPE } from 'constants/accountConstants'
import { popupAccount } from 'services/account'
import './index.css'

const ArweaveOnly = ({ content }) => {
  return <div className='ar-only-message'>{content}</div>
}

export default (({ children, content, checkingDefaultAccount }) => {
  const [hasArWallet, setHasArWallet] = useState(false)

  const defaultArweaveAccount = useSelector(state => state.defaultAccount.AR)


  useEffect(() => {
    const showArweaveForm = async () => {
      setHasArWallet(await popupAccount.hasArweave())
    }

    showArweaveForm()
  }, [])

  return ((checkingDefaultAccount && isEmpty(defaultArweaveAccount)) || !hasArWallet) ? <ArweaveOnly content={content} /> : children
})
