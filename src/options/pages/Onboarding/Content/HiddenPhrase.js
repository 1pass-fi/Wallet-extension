import React, { useContext, useMemo, useState } from 'react'
import clsx from 'clsx'
import HiddenPhraseIcon from 'img/v2/onboarding/hidden-phrase.svg'
import WarningIcon from 'img/v2/onboarding/warning-icon.svg'
import WelcomeBackground from 'img/v2/onboarding/welcome-background-1.svg'
import Button from 'options/components/Button'

import useMethod from '../hooks/useMethod'
import { OnboardingContext } from '../onboardingContext'

const HiddenPhrase = ({ step, setStep, importType }) => {
  const { newSeedphrase, password, setSkipPhrase } = useContext(OnboardingContext)
  const [showPhrase, setShowPhrase] = useState(false)

  const { saveNewKey } = useMethod({ newSeedphrase, password })

  const SEED_ARRAY = useMemo(() => {
    return newSeedphrase.split(' ')
  }, [newSeedphrase])

  const handleSkipThisStep = async () => {
    await saveNewKey(importType)
    setSkipPhrase(true)
    setStep(6)
  }

  return (
    <div
      data-testid="HiddenPhrase"
      className="w-11/12 flex flex-col text-white text-left max-w-full"
      style={{ width: '500px' }}
    >
      <WelcomeBackground className={clsx('welcome-bg')} />
      <div className="mt-10 font-semibold text-2xl tracking-finnieSpacing-wider">
        {chrome.i18n.getMessage('saveYourSecretPhrase')}
      </div>
      <div className="flex mt-5 font-normal text-lg leading-6 gap-1.5">
        <div>1. </div>
        <div>{chrome.i18n.getMessage('clickTheLockBelowToRevealYourSecretPhrase')}</div>
      </div>
      <div className="flex mt-1.5 font-normal text-lg leading-6 gap-1.5">
        <div>2. </div>
        <div>{chrome.i18n.getMessage('writeDownTheKeyOnAPieceOfPaper')}</div>
      </div>
      <div className="flex mt-1.5 font-normal text-lg leading-6 gap-1.5">
        <div>3. </div>
        <div>
          <span className="text-warning-200">{chrome.i18n.getMessage('hiddenPhraseStart')}</span>
          {chrome.i18n.getMessage('hiddenPhraseEnd')}{' '}
        </div>
      </div>
      <div className="mt-6.75 font-normal text-lg leading-6">
        {chrome.i18n.getMessage('doYouHaveA')}{' '}
        <span className="text-turquoiseBlue">{chrome.i18n.getMessage('penAndPaperLc')}</span>
      </div>
      <div className="mt-1 font-normal text-lg leading-6">
        {chrome.i18n.getMessage('whatAboutA')}{' '}
        <span className="text-turquoiseBlue">{chrome.i18n.getMessage('safePlaceToKeepItLc')}</span>
      </div>

      {showPhrase ? (
        <div className="flex flex-col max-w-full" style={{ width: '347px' }}>
          <div
            style={{ height: '182px' }}
            className="mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-flow-col grid-rows-6 font-normal text-sm leading-6"
          >
            {SEED_ARRAY.map((phrase, index) => {
              return (
                <div className="mx-7.5 my-auto flex" key={index}>
                  <div className="w-5 text-right mr-3">{index + 1}. </div>
                  <div data-testid={`hidden-phrase-${index}`}>{phrase}</div>
                </div>
              )
            })}
          </div>

          <Button
            style={{ width: '240px', height: '42px' }}
            className="mt-10.75 text-base mx-auto rounded z-10"
            variant="white"
            text={chrome.i18n.getMessage('continue')}
            onClick={() => setStep(step + 1)}
            id="continue-button"
          />
        </div>
      ) : (
        <HiddenPhraseIcon
          data-testid="blur-phrase-button"
          className="mt-7.5 cursor-pointer"
          onClick={() => setShowPhrase(true)}
          role="img"
        />
      )}

      {showPhrase && (
        <div
          className="absolute bottom-11 right-7.5 text-lightBlue underline font-normal text-sm tracking-finnieSpacing-wide cursor-pointer"
          onClick={handleSkipThisStep}
        >
          {chrome.i18n.getMessage('skipThisStep')}
        </div>
      )}
    </div>
  )
}

export default HiddenPhrase
