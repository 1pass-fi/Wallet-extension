import React, { useState } from 'react'

import PreUpload from './PreUpload'
import Confirm from './Confirm'
import Success from '../shared/Success'

import './index.css'

export default () => {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState({})
  const [walletType, setWalletType] = useState(null)

  const nextStep = () => {
    setStep(step + 1)
  }

  return (
    <div className='start-up'>
      <div className='upload-file-wrapper'>
        {step === 1 && (
          <PreUpload 
            file={file} 
            setFile={setFile} 
            nextStep={nextStep} 
            walletType={walletType}
            setWalletType={setWalletType}
          />
        )}

        {step === 2 && <Confirm walletType={walletType} nextStep={nextStep} file={file} />}

        {step === 3 && <Success />}
      </div>
    </div>
  )
}
