import React, { useEffect, useState } from 'react'

import UploadNFT from './uploadNFT'

import './index.css'

export const UploadContext = React.createContext(null)

export default ({ choosenTxid = '' }) => {
  const [tags, setTags] = useState([])
  const [transactionId, setTransactionId] = useState('txId')
  const [createdAt, setCreatedAt] = useState(Date.now())
  const [isFriendCodeValid, setIsFriendCodeValid] = useState(false)
  const [price, setPrice] = useState(null)

  useEffect(() => {
    window.scroll({ top: 0, behavior: 'smooth' })
  }, [choosenTxid])

  return (
    <UploadContext.Provider
      value={{
        tags,
        setTags,
        transactionId,
        setTransactionId,
        createdAt,
        setCreatedAt,
        isFriendCodeValid,
        setIsFriendCodeValid,
        price,
        setPrice
      }}
    >
      <div className='app-content'>
        <UploadNFT />
      </div>
    </UploadContext.Provider>
  )
}
