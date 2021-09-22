import React, { useContext, useEffect, useState } from 'react'

import { TYPE } from 'constants/accountConstants'
import { popupAccount } from 'services/account'
import './index.css'
import { GalleryContext } from 'options/galleryContext'

const ArweaveOnly = ({ content }) => {
  return <div class='ar-only-message'>{content}</div>
}

export default (({ children, content, checkingDefaultAccount }) => {
  const [hasArWallet, setHasArWallet] = useState(false)
  const { account } = useContext(GalleryContext)

  useEffect(() => {
    const showArweaveForm = async () => {
      setHasArWallet(await popupAccount.hasArweave())
    }

    showArweaveForm()
  }, [])

  return ((checkingDefaultAccount && account.TYPE !== TYPE.ARWEAVE) || !hasArWallet) ? <ArweaveOnly content={content}/> : children
})
