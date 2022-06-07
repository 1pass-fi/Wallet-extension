import React, { useEffect, useState } from 'react'

import NavBar from './NavBar'
import Content from './Content'
import RevealPhrase from './RevealPhrase'

export const onboardingSteps = [
  'CREATE_PASSWORD',
  'CREATE_OR_IMPORT',
  'GET_A_KEY ',
  'PREPARE_SAVE_PHRASE',
  'HIDDEN_PHRASE',
  'INPUT_PHRASE',
  'REVEAL_PHRASE'
]

const Welcome = () => {
  const [step, setStep] = useState(0)

  return (
    <div className="w-screen h-screen flex text-center">
      {step !== 6 ? (
        <>
          <NavBar step={step} setStep={setStep} />
          <Content step={step} setStep={setStep} />
        </>
      ) : (
        <RevealPhrase />
      )}
    </div>
  )
}

export default Welcome
