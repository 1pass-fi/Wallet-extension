import React, { useEffect, useState } from 'react'

import UploadNFT from './uploadNFT'

import './index.css'

export const UploadContext = React.createContext(null)

export default ({ choosenTxid = '' }) => {  
  const [tags, setTags] = useState([])

  useEffect(() => {
    window.scroll({ top: 0, behavior: 'smooth' })
  }, [choosenTxid])


  return (
    <UploadContext.Provider 
      value={{
        tags,
        setTags
      }}
    >
      <div className='app-content'>
        <UploadNFT />
      </div>
    </UploadContext.Provider>
  )
}
