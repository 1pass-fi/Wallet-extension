import React, { useState, useContext, useMemo } from 'react'
import clsx from 'clsx'

import WelcomeBackground from 'img/v2/onboarding/welcome-background-1.svg'
import HiddenPhraseIcon from 'img/v2/onboarding/hidden-phrase.svg'
import WarningIcon from 'img/v2/onboarding/warning-icon.svg'

import Button from 'finnie-v2/components/Button'

import { GalleryContext } from 'options/galleryContext'
import { OnboardingContext } from '../onboardingContext'


import useMethod from '../hooks/useMethod'

const HiddenPhrase = ({ step, setStep }) => {
  const { setIsLoading, setError } = useContext(GalleryContext)
  const { newSeedphrase, password } = useContext(OnboardingContext)
  const [showPhrase, setShowPhrase] = useState(false)

  const { saveNewKey } = useMethod({ setIsLoading, setError, newSeedphrase, password })

  const SEED_ARRAY = useMemo(() => {
    return newSeedphrase.split(' ')
  }, [newSeedphrase])

  const handleSkipThisStep = async () => {
    await saveNewKey()
    setStep(6)
  }

  return (
    <div className="w-11/12 flex flex-col text-white text-left" style={{ width: '500px' }}>
      <WelcomeBackground className="absolute bottom-0 right-0" />
      <div className="mt-10 font-semibold text-2xl tracking-finnieSpacing-wider">
        Save your Secret Phrase
      </div>
      <div className="flex mt-5 font-normal text-lg leading-6 gap-1.5">
        <div>1. </div>
        <div>Click the lock below to reveal your secret phrase.</div>
      </div>
      <div className="flex mt-1.5 font-normal text-lg leading-6 gap-1.5">
        <div>2. </div>
        <div>Write down the key on a piece of paper.</div>
      </div>
      <div className="flex mt-1.5 font-normal text-lg leading-6 gap-1.5">
        <div>3. </div>
        <div>
          <span className="text-warning-200">Do not show this to anyone else</span> or they will be
          able to use your wallet and withdraw funds or other assets like NFTs
        </div>
      </div>
      <div className="mt-6.75 font-normal text-lg leading-6">
        Do you have a <span className="text-turquoiseBlue">pen & paper handy?</span>
      </div>
      <div className="mt-1 font-normal text-lg leading-6">
        What about a <span className="text-turquoiseBlue">safe place to keep it?</span>
      </div>

      {showPhrase ? (
        <div className="flex flex-col" style={{ width: '347px' }}>
          <div
            style={{ height: '182px' }}
            className="mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-flow-col grid-rows-6 font-normal text-sm leading-6"
          >
            {SEED_ARRAY.map((phrase, index) => {
              return (
                <div className="mx-7.5 my-auto" key={index}>
                  {index + 1}. {phrase}
                </div>
              )
            })}
          </div>

          <Button
            style={{ width: '240px', height: '42px' }}
            className="mt-10.75 text-base mx-auto rounded z-10"
            variant="white"
            text="Continue"
            onClick={() => setStep(step + 1)}
          />
        </div>
      ) : (
        <HiddenPhraseIcon className="mt-7.5 cursor-pointer" onClick={() => setShowPhrase(true)} />
      )}

      {showPhrase && (
        <div
          className="absolute bottom-11 right-7.5 text-lightBlue underline font-normal text-sm tracking-finnieSpacing-wide cursor-pointer"
          onClick={handleSkipThisStep}
        >
          Skip this step
        </div>
      )}
    </div>
  )
}

export default HiddenPhrase