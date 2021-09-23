import React, { useContext, useState, useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import { GalleryContext } from 'options/galleryContext'

import UploadZone from './uploadZone'
import UploadForm from './uploadForm'
import './index.css'
import storage from 'services/storage'
import { UploadContext } from '..'

export default () => {
  const { file, account } = useContext(GalleryContext)
  const { setHasSavedData, hasSavedData } = useContext(UploadContext)
  const [stage, setStage] = useState(1)

  /* 
    Load saved form data if any
  */
  useEffect(() => {
    const loadSavedForm = async () => {
      const payload = await storage.generic.get.savedNFTForm()
      if (!isEmpty(payload)) setHasSavedData(true)
    }
  
    if (!isEmpty(account)) loadSavedForm()
  }, [account])

  return (
    <div className='uploadNFT-wrapper'>
      {!get(file, 'type') && <div className='drop-box-title'>
        Create an Atomic NFT to <span>start earning rewards</span>
      </div>}
      {/* <div className={stage === 3 ? 'uploadNFT stage3' : 'uploadNFT'}> */}
      <div className={!get(file, 'type') && !hasSavedData ? `uploadNFT dropbox` : `uploadNFT stage${stage}`}>
        {!get(file, 'type') && !hasSavedData ? <UploadZone /> : <UploadForm stage={stage} setStage={setStage}/>}
      </div>
    </div>
  )
}
