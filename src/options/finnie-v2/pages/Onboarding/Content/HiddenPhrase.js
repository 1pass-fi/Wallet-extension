import React, { useState } from 'react'
import clsx from 'clsx'

import WelcomeBackground from 'img/v2/onboarding/welcome-background-1.svg'
import HiddenPhraseIcon from 'img/v2/onboarding/hidden-phrase.svg'
import WarningIcon from 'img/v2/onboarding/warning-icon.svg'

import Button from 'finnie-v2/components/Button'

const HiddenPhrase = ({ step, setStep }) => {
  const [showPhrase, setShowPhrase] = useState(false)
  return (
    <div className="w-11/12 flex flex-col text-white text-left">
      <WelcomeBackground className="absolute bottom-0 right-0" />
      <div className="font-semibold text-2xl tracking-finnieSpacing-wider">
        Save your Secret Phrase
      </div>
      <div className="mt-5 font-normal text-lg leading-6">
        1. Click the lock below to reveal your secret phrase.
      </div>
      <div className="mt-1 font-normal text-lg leading-6">
        2. Write down the key on a piece of paper.
      </div>
      <div className="mt-1 font-normal text-lg leading-6">
        3. Do not show this to anyone else or they will be able to use your wallet and withdraw
        funds or other assets like NFTs
      </div>
      <div className="mt-6.75 font-normal text-lg leading-6">
        Do you have a <span className="text-success">pen & paper handy?</span>
      </div>
      <div className="mt-1 font-normal text-lg leading-6">
        What about a <span className="text-success">safe place to keep it?</span>
      </div>

      {showPhrase ? (
        <div className="flex flex-col" style={{ width: '347px' }}>
          <div
            style={{ height: '182px' }}
            className="mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-cols-2 grid-rows-6 font-normal text-sm leading-6"
          >
            <div className="mx-7.5 my-auto">1. internet</div>
            <div className="mx-7.5 my-auto">2. priority</div>
            <div className="mx-7.5 my-auto">3. passion</div>
            <div className="mx-7.5 my-auto">4. skill</div>
            <div className="mx-7.5 my-auto">5. employer</div>
            <div className="mx-7.5 my-auto">6. currency</div>
            <div className="mx-7.5 my-auto">7. volume</div>
            <div className="mx-7.5 my-auto">8. hair</div>
            <div className="mx-7.5 my-auto">9. reception</div>
            <div className="mx-7.5 my-auto">10. proposal</div>
            <div className="mx-7.5 my-auto">11. mall</div>
            <div className="mx-7.5 my-auto">12. paper</div>
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
          onClick={() => setStep(6)}
        >
          Skip this step
        </div>
      )}
    </div>
  )
}

export default HiddenPhrase
