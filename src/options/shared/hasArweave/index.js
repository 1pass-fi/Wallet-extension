import React, { useContext } from 'react'

import { GalleryContext } from 'options/galleryContext'
import './index.css'
import { TYPE } from 'constants/accountConstants'

const ArweaveOnly = ({ content }) => {
  return <div className="ar-only-message">{content}</div>
}

export default ({ children, content, hasArweaveAccounts = false }) => {
  const { displayingAccount } = useContext(GalleryContext)

  return displayingAccount.type === TYPE.ARWEAVE || hasArweaveAccounts ? (
    children
  ) : (
    <ArweaveOnly content={content} />
  )
}
