import React, { useState } from 'react'
import clsx from 'clsx'

import WelcomeBackground from 'img/v2/onboarding/welcome-background-1.svg'
import HiddenPhraseIcon from 'img/v2/onboarding/hidden-phrase.svg'
import WarningIcon from 'img/v2/onboarding/warning-icon.svg'

import Button from 'finnie-v2/components/Button'

const InputPhrase = ({ step, setStep }) => {
  return (
    <div className="w-11/12 flex flex-col text-white text-left">
      <WelcomeBackground className="absolute bottom-0 right-0" />
      <div className="font-semibold text-2xl tracking-finnieSpacing-wider">
        Save your Secret Phrase
      </div>

      <div className="mt-5 font-normal text-lg leading-6">
        Do you have a <span className="text-success">pen & paper handy?</span>
      </div>
      <div className="mt-1 font-normal text-lg leading-6">
        What about a <span className="text-success">safe place to keep it?</span>
      </div>

      <div className="mt-8 font-normal text-lg leading-6 text-white">
        Type in the missing words to confirm your secret phase is properly secured.
      </div>

      <div className="flex flex-col" style={{ width: '347px' }}>
        <div
          style={{ height: '182px' }}
          className="mt-7.5 py-3.5 bg-trueGray-100 bg-opacity-20 rounded-sm grid grid-cols-2 grid-rows-6 font-normal text-sm leading-6"
        >
          <div className="mx-7.5 my-auto">1. internet</div>
          <div className="mx-7.5 my-auto">2. _____</div>
          <div className="mx-7.5 my-auto">3. passion</div>
          <div className="mx-7.5 my-auto">4. skill</div>
          <div className="mx-7.5 my-auto">5. employer</div>
          <div className="mx-7.5 my-auto">6. _____</div>
          <div className="mx-7.5 my-auto">7. volume</div>
          <div className="mx-7.5 my-auto">8. hair</div>
          <div className="mx-7.5 my-auto">9. reception</div>
          <div className="mx-7.5 my-auto">10. proposal</div>
          <div className="mx-7.5 my-auto">11. _____</div>
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

      <div
        className="absolute bottom-11 right-7.5 text-lightBlue underline font-normal text-sm tracking-finnieSpacing-wide cursor-pointer"
        onClick={() => setStep(6)}
      >
        Skip this step
      </div>
    </div>
  )
}

export default InputPhrase
