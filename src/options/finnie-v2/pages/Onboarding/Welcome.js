import React, { useContext, useEffect, useState } from 'react'

import { GalleryContext } from 'options/galleryContext'

import NavBar from './NavBar'
import Content from './Content'

import LoadingScreen from 'options/pages/StartUp/shared/Loading'

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
  const { isLoading, setIsOnboarding } = useContext(GalleryContext)
  const [step, setStep] = useState(0)

  useEffect(() => {
    setIsOnboarding(true)
  }, [])

  return (
    <div className="w-screen h-screen flex text-center">
      <NavBar step={step} setStep={setStep} />
      <Content step={step} setStep={setStep} />
      {isLoading !== 0 && <LoadingScreen />}
    </div>
  )
}

export default Welcome
