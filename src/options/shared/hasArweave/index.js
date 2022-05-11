import React, { useContext } from 'react'

import { GalleryContext } from 'options/galleryContext'
import './index.css'
import { TYPE } from 'constants/accountConstants'

const ArweaveOnly = ({ content }) => {
  return <div className="ar-only-message">{content}</div>
}

export default ({ children, content }) => {
  const { displayingAccount } = useContext(GalleryContext)

  return displayingAccount.type === TYPE.ARWEAVE ? children : <ArweaveOnly content={content} />
}
