import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { setIsOnboarding, setOnboardingPath } from 'options/actions/onboardingProcessing'

import Content from './Content'
import LoadingScreen from './Loading'
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

const Onboarding = ({ ignoreSetPath = false, path = '' }) => {
  const dispatch = useDispatch()
  const location = useLocation()

  const isOnboardingProcessing = useSelector((state) => state.onboarding.isProcessing)

  const [step, setStep] = useState(0)

  useEffect(() => {
    dispatch(setIsOnboarding(true))
    if (!ignoreSetPath) dispatch(setOnboardingPath(path))
  }, [])

  const shouldShowSidebar = useMemo(() => {
    return step < 13 && location.pathname !== '/upload-json'
  }, [step, location.pathname])

  return (
    <div className="w-screen h-screen flex text-center">
      {shouldShowSidebar && <NavBar step={step} setStep={setStep} />}
      <Content step={step} setStep={setStep} path={path} />
      {isOnboardingProcessing !== 0 && <LoadingScreen show={true} />}
    </div>
  )
}

export default Onboarding
