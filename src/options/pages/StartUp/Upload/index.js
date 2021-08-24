import React, { useState } from 'react'

import PreUpload from './PreUpload'
import Confirm from './Confirm'
import Success from '../shared/Success'
import UploadFile from './UploadFile'

import './index.css'

export default () => {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState({})
  const [walletType, setWalletType] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)

  const nextStep = () => {
    setStep(step + 1)
  }

  return (
    <div className='start-up'>
      <div className='upload-file-wrapper'>
        {step === 1 && (
          <PreUpload  
            nextStep={nextStep}
            setWalletType={setWalletType}
          />
        )}

        {step === 2 && <UploadFile 
          file={file} 
          setFile={setFile}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          walletType={walletType}
          nextStep={nextStep} />}

        {step === 3 && <Confirm 
          walletType={walletType} 
          nextStep={nextStep} 
          selectedNetwork={selectedNetwork} 
          file={file} />}

        {step === 4 && <Success />}
      </div>
    </div>
  )
}
