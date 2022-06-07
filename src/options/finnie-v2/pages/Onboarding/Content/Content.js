import React from 'react'
import clsx from 'clsx'

import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'
import CreateNewIcon from 'img/v2/onboarding/create-new-icon.svg'
import ImportSeedphraseIcon from 'img/v2/onboarding/import-seedphrase-icon.svg'
import ImportKeyIcon from 'img/v2/onboarding/import-key-icon.svg'

import { onboardingSteps } from '../Welcome'
const Content = ({ step, setStep }) => {
  return (
    <div
      className={clsx(
        'w-2/3 h-full relative bg-gradient-to-r from-blue-300 to-indigo shadow-lg',
        'flex flex-col items-center justify-evenly text-white overflow-hidden'
      )}
    >
      {step > 1 && <KoiIcon className="w-18 h-18 absolute top-2.25 right-3.75" />}
      <WelcomeBackgroundTop className="absolute top-0 right-0" />
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <div
        className="bg-blue-800 shadow-md rounded-finnie z-10 flex flex-col items-center justify-center cursor-pointer"
        style={{ width: '249px', height: '140px' }}
        onClick={() => {
          try {
            console.log('Clicked')
            setStep(step + 1)
          } catch (error) {
            console.log('err', error.message)
          }
        }}
      >
        <CreateNewIcon style={{ width: '32px', height: '32px' }} />
        <div className="mt-3 font-semibold text-base leading-4 text-center text-white">
          Get a new key
        </div>
        <div className="mt-2 font-normal text-xs text-center tracking-finnieSpacing-wide text-white">
          Start from the beginning.
        </div>
      </div>
      <div
        className="bg-blue-800 shadow-md rounded-finnie z-10 flex flex-col items-center justify-center cursor-pointer"
        style={{ width: '249px', height: '140px' }}
      >
        <ImportSeedphraseIcon style={{ width: '32px', height: '28px' }} />
        <div className="mt-3 font-semibold text-base leading-4 text-center text-white">
          Import with a seed phrase
        </div>
        <div className="mt-2 font-normal text-xs text-center tracking-finnieSpacing-wide text-white w-9/12">
          Import an existing key using a 12-word recovery phrase.
        </div>
      </div>
      <div
        className="bg-blue-800 shadow-md rounded-finnie z-10 flex flex-col items-center justify-center cursor-pointer"
        style={{ width: '249px', height: '140px' }}
        onClick={() => {
          try {
            console.log('Clicked')
            setStep(step - 1)
          } catch (error) {
            console.log('err', error.message)
          }
        }}
      >
        <ImportKeyIcon style={{ width: '32px', height: '28px' }} />
        <div className="mt-3 font-semibold text-base leading-4 text-center text-white">
          Import a private key
        </div>
        <div className="mt-2 font-normal text-xs text-center tracking-finnieSpacing-wide text-white w-8/12">
          Import an existing key by uploading a .JSON file.
        </div>
      </div>
    </div>
  )
}

export default Content
