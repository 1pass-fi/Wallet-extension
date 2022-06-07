import React from 'react'
import clsx from 'clsx'

import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'

import CreatePassword from './CreatePassword'
import AddAKey from './AddAKey'

import { onboardingSteps } from '../Welcome'
const Content = ({ step, setStep }) => {
  return (
    <div
      className={clsx(
        'w-2/3 h-full relative bg-gradient-to-r from-blue-300 to-indigo shadow-lg',
        'flex flex-col items-center justify-center overflow-hidden'
      )}
    >
      {step > 1 && <KoiIcon className="w-18 h-18 absolute top-2.25 right-3.75" />}
      {step === 0 && <CreatePassword step={step} setStep={setStep} />}
      {step === 1 && <AddAKey step={step} setStep={setStep} />}
    </div>
  )
}

export default Content
