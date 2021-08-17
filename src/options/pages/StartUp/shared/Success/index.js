import React, { useState } from 'react'

import WarningIcon from 'img/startup/warning.svg'
import ElectronIcon from 'img/startup/electron.svg'
import Dropfile from '../Dropfile'

import './index.css'

export default () => {
  const [file, setFile] = useState()

  const openFaucet = () => {
    chrome.tabs.create({ url: 'https://koi.rocks/faucet' })
    window.close()
  }
  
  const openCreateNFTPage = () => {
    const path = '/options.html#/create'
    const url = chrome.extension.getURL(path)
    chrome.tabs.create({ url })
    window.close()
  }

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

      {/* GET FREE KOI BUTTON */}
      <div className='get-koi-text'>
        Get some&nbsp;<span>free KOII</span>&nbsp;from the faucet.
      </div>
      <div className='get-koi-button' onClick={openFaucet}>Get Free KOII</div>

      {/* CREATE NFT BUTTON */}
      <div className='create-nft-text'>
        If you already have KOII,&nbsp;<span>create an NFT</span>&nbsp;to earn
        attention rewards!
      </div>
      <div className='get-koi-button' onClick={openCreateNFTPage}>Create an NFT</div>
      {/* 
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
      /> */}
    </div>
  )
}