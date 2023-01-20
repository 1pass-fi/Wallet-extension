import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import BackIcon from 'img/v2/back-icon.svg'
import EditIcon from 'img/v2/onboarding/edit-icon.svg'
import EditSelectedIcon from 'img/v2/onboarding/edit-selected-icon.svg'
import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'
import KeyIcon from 'img/v2/onboarding/key-icon.svg'
import KeySelectedIcon from 'img/v2/onboarding/key-selected-icon.svg'
import LockIcon from 'img/v2/onboarding/lock-icon.svg'
import LockSelectedIcon from 'img/v2/onboarding/lock-selected-icon.svg'
import SeedphraseIcon from 'img/v2/onboarding/seedphrase-icon.svg'
import SeedphraseSelectedIcon from 'img/v2/onboarding/seedphrase-selected-icon.svg'
import isEmpty from 'lodash/isEmpty'
import { setIsOnboarding, setOnboardingPath } from 'options/actions/onboardingProcessing'

import { onboardingSteps } from '../Onboarding'

const NavBar = ({ step, setStep }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const onboardingPath = useSelector((state) => state.onboarding.path)

  const handleBack = () => {
    if (!isEmpty(onboardingPath)) {
      if (step === 2 || step === 10) {
        dispatch(setIsOnboarding(false))
        dispatch(setOnboardingPath(''))
        history.push('/settings/wallet')
      }
    }

    if (step === 10) {
      setStep(1)
    } else {
      setStep(step - 1)
    }

    if (step === 0) {
      dispatch(setIsOnboarding(false))
      dispatch(setOnboardingPath(''))
      history.push('/settings/wallet')
    }
  }

  const accounts = useSelector((state) => state.accounts)

  return (
    <div className="w-1/3 h-full bg-blue-800 shadow-lg flex flex-col items-center overflow-hidden">
      {step > 0 && step !== 6 && step !== 12 && (
        <BackIcon
          className="absolute top-5.5 left-6 cursor-pointer"
          style={{ width: '45px', height: '45px' }}
          onClick={handleBack}
        />
      )}
      {step === 0 && !isEmpty(accounts) && (
        <BackIcon
          className="absolute top-5.5 left-6 cursor-pointer"
          style={{ width: '45px', height: '45px' }}
          onClick={handleBack}
        />
      )}

      <div className="w-11/12 flex flex-col items-center">
        <KoiIcon style={{ width: '156px', height: '156px' }} />
        {onboardingSteps[step] === 'CREATE_PASSWORD' && (
          <div
            className="font-normal tracking-finnieSpacing-tightest text-white -pt-4"
            style={{ fontSize: '40px', lineHeight: '48px' }}
          >
            Welcome to the Finnie Wallet
            <div className="mt-6.25 mb-8 font-normal text-lg tracking-finnieSpacing-tight  text-success">
              Get set up in just 4 quick & easy steps.
            </div>
          </div>
        )}
      </div>
      <div className="w-4/5 flex flex-col items-start gap-6 pt-8 font-normal text-base leading-8 text-white select-none text-left">
        {step === 0 ? (
          <div className="flex text-warning items-center">
            <LockSelectedIcon />
            <div className="w-4/5 ml-4">Secure Finnie with a password.</div>
          </div>
        ) : (
          <div className="flex items-center">
            <LockIcon />
            <div className="w-4/5 ml-4">Secure Finnie with a password.</div>
          </div>
        )}
        {step === 1 || step === 2 || step === 10 || step === 11 || step === 12 ? (
          <div className="flex text-warning">
            <KeySelectedIcon />
            <div className="w-4/5 flex flex-col whitespace-pre-wrap">
              <div className="w-4/5 ml-4">Create or import a key.</div>
              <span className="ml-4 font-normal text-sm leading-6 text-trueGray-100">
                {step === 1 || step === 2
                  ? 'Choose a new Koii or Ethereum account or import one you already have.'
                  : step === 10
                    ? 'Select the chain of the key you want to import'
                    : 'Type in your secret phrase.'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <KeyIcon />
            <div className="w-4/5 ml-4">Create or import a key.</div>
          </div>
        )}
        {step < 10 &&
          (2 < step && step < 5 ? (
            <div className="flex text-warning">
              <EditSelectedIcon />
              <div className="w-4/5 flex flex-col whitespace-pre-wrap">
                <div className="w-4/5 ml-4">Write down your secret phrase.</div>
                <span className="ml-4 font-normal text-sm leading-6 text-trueGray-100">
                  Grab a pen & paper so you can keep your phrase safe.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <EditIcon />
              <div className="w-4/5 ml-4">Write down your secret phrase.</div>
            </div>
          ))}

        {step < 10 &&
          (step === 5 || step == 6 ? (
            <div className="flex text-warning">
              <SeedphraseSelectedIcon style={{ width: '48px', height: '48px' }} />
              <div className="w-4/5 flex flex-col whitespace-pre-wrap">
                <div className="w-4/5 ml-4">Confirm your secret phrase.</div>
                <span className="ml-4 font-normal text-sm leading-6 text-trueGray-100">
                  Re-enter 3 words of your secret phrase for safety.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <SeedphraseIcon />
              <div className="w-4/5 ml-4">Confirm your secret phrase.</div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default NavBar
