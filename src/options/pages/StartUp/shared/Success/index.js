import React, { useContext, useEffect } from 'react'

import WarningIcon from 'img/startup/warning.svg'
import ElectronIcon from 'img/startup/electron.svg'
import Dropfile from '../Dropfile'
import { GalleryContext } from 'options/galleryContext'

import './index.css'

export default () => {
  const { file, importedAddress, setNewAddress, setFile } = useContext(GalleryContext)

  const openFaucet = () => {
    chrome.tabs.create({ url: 'https://koi.rocks/faucet' })
  }

  useEffect(() => {
    return () => {
      setNewAddress(importedAddress)
    }
  }, [])

  return (
    <div className='success-page'>
      <div className='title'>Your key was successfully imported!</div>

      <div className='warning'>
        <div className='warning-title'>
          <WarningIcon className='warning-icon' />
          Keep your key safe
        </div>
        <div className='warning-items'>
          <li className='warning-item'>
            Save a backup copy on several devices
          </li>
          <li className='warning-item'>Never share your keyfile with anyone</li>
          <li className='warning-item'>
            Stay safe from phishing scams— Koii will never ask you for your
            keyfile or seed phrase
          </li>
          <li className='warning-item'>
            If you have questions or see something suspicious, email us at
            security@koii.network
          </li>
        </div>
      </div>

      
      <div className='get-koi-text'>
        Get some&nbsp;<span>free KOII</span>&nbsp;from the faucet.
      </div>
      {/* GET FREE KOI BUTTON */}
      <div className='get-koi-button' onClick={openFaucet}>Get Free KOII</div>


      <div className='create-nft-text'>
        If you already have KOII,&nbsp;<span>create an NFT</span>&nbsp;to earn
        attention rewards!
      </div>

      <Dropfile
        Icon={ElectronIcon}
        file={file}
        setFile={setFile}
        fileType={['image/*', 'video/*', 'audio/*']}
        className='drag-media'
        description='Drag a media file here to get started.'
        type='image'
      />
    </div>
  )
}
