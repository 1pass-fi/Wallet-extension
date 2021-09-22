import React, { useContext, useState, useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'

import { GalleryContext } from 'options/galleryContext'
import ArweaveOnly from 'options/components/arweaveOnly'

import { popupAccount } from 'services/account'

import UploadZone from './uploadZone'
import UploadForm from './uploadForm'
import './index.css'
import storage from 'services/storage'
import { UploadContext } from '..'

export default () => {
  const { file } = useContext(GalleryContext)
  const { setHasSavedData, hasSavedData } = useContext(UploadContext)
  const [stage, setStage] = useState(1)
  const [showUploadNFT, setShowUploadNFT] = useState(false)

  useEffect(() =>{
    console.log('SHOW UPLOAD NFT:', popupAccount.hasArweave())
    setShowUploadNFT(popupAccount.hasArweave())
  })

  /* 
    Load saved form data if any
  */
  useEffect(() => {
    const loadSavedForm = async () => {
      const payload = await storage.generic.get.savedNFTForm()
      if (!isEmpty(payload)) setHasSavedData(true)
    }
  
    loadSavedForm()
  })
  
  return (
    <div className='uploadNFT-wrapper'>
      {!showUploadNFT && <ArweaveOnly />}

      {showUploadNFT &&!stage && <div className='drop-box-title'>
        Create an Atomic NFT to <span>start earning rewards</span>
      </div>}
      <div className={isEmpty(file) && !hasSavedData ? `uploadNFT dropbox` : `uploadNFT stage${stage}`}>
        {showUploadNFT && isEmpty(file) && !hasSavedData ? <UploadZone /> : <UploadForm stage={stage} setStage={setStage}/>}
      </div>
    </div>
  )
}
