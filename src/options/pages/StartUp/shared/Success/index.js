import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import WarningIcon from 'img/startup/warning.svg'
import ElectronIcon from 'img/startup/electron.svg'
import GoBackIcon from 'img/goback-icon.svg'
import Dropfile from '../Dropfile'
import { GalleryContext } from 'options/galleryContext'
import Button from '../Button'

import './index.css'

export default () => {
  const [step, setStep] = useState(1)
  const { file, importedAddress, setNewAddress, setFile } = useContext(GalleryContext)
  const history = useHistory()

  const openFaucet = () => {
    chrome.tabs.create({ url: 'https://koi.rocks/faucet' })
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const previousStep = () => {
    if (step !== 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className='success-page'>
      {step === 1 && (
        <>
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

            <Button className='got-it-button' onClick={() => nextStep()} >I Got It</Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className='goback-button' onClick={previousStep}>
            <div data-tip='Back'>
              <GoBackIcon />
            </div>
          </div>
          <div className='title'>Now let’s make something.</div>

          <div className='content'>
            <div className='content-message'>
              KOII tokens are the way to interact with the Koii Network.
              Do you need KOII? Get &nbsp;<span>free tokens</span>&nbsp; from the faucet.
            </div>
            <div className='faucet-buttons'>
              <Button className='faucet-button faucet' onClick={() => {
                openFaucet()
                nextStep()
              }} >I need KOII! Go to the Faucet.</Button>
              <Button className='faucet-button skip' onClick={() => nextStep()} >I have KOII already, skip this.</Button>
            </div>
          </div>
          <ReactTooltip place='top' type="dark" effect="float" />
        </>
      )}

      {step == 3 && (
        <>
          <div className='goback-button' onClick={previousStep}>
            <div data-tip='Back'>
              <GoBackIcon />
            </div>
          </div>
          <div className='title'>Now let’s make something.</div>


          <div className='content'>
            <div className='create-nft-text'>
              &nbsp;<span>Create an NFT</span>&nbsp; to earn attention rewards!
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
            <div className='create-kid-text'>
              Or make your decentralized Koii ID (kID) to connect cross-chain assets.
            </div>

            <Button className='go-to-kid' onClick={() => history.push('/settings/k-id')} >Create my kID</Button>
          </div>
          <ReactTooltip place='top' type="dark" effect="float" />
        </>
      )}
    </div>
  )
}
