import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsOnboarding } from 'options/actions/onboardingProcessing'
import { GalleryContext } from 'options/galleryContext'
import LoadingScreen from 'options/pages/StartUp/shared/Loading'

import Content from './Content'
import NavBar from './NavBar'

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
  const dispatch = useDispatch()

  const isOnboardingProcessing = useSelector((state) => state.onboarding.isProcessing)

  const [step, setStep] = useState(0)

  useEffect(() => {
    dispatch(setIsOnboarding(true))
  }, [])

  return (
    <div className="w-screen h-screen flex text-center">
      <NavBar step={step} setStep={setStep} />
      <Content step={step} setStep={setStep} />
      {isOnboardingProcessing !== 0 && <LoadingScreen />}
    </div>
  )
}

export default Welcome
