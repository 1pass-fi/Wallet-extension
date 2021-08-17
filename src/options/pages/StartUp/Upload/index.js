import React, { useState } from 'react'

import PreUpload from './PreUpload'
import Confirm from './Confirm'
import Success from '../shared/Success'

import './index.css'

export default () => {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState({})

  const nextStep = () => {
    setStep(step + 1)
  }

  return (
    <div className='upload-file-wrapper'>
      {step === 1 && (
        <PreUpload file={file} setFile={setFile} nextStep={nextStep} />
      )}

      {step === 2 && <Confirm nextStep={nextStep} file={file} />}

      {step === 3 && <Success />}
    </div>
  )
}
