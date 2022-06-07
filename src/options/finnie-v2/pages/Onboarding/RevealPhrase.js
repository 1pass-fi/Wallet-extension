import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'

import WelcomeBackground1 from 'img/v2/onboarding/welcome-background-1.svg'
import WelcomeBackground2 from 'img/v2/onboarding/welcome-background-2.svg'
import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'

const RevealPhrase = ({ step, setStep }) => {
  const history = useHistory()

  return (
    <div className="w-full flex flex-col items-center justify-center text-white text-left">
      <WelcomeBackground2 className="absolute top-0 -left-4" />
      <WelcomeBackground1 className="absolute bottom-0 right-0" />
      <KoiIcon className="w-18 h-18 absolute top-2.25 right-3.75" />
      <div className="font-semibold text-2xl tracking-finnieSpacing-wider">
        You successfully saved your Recovery Phrase
      </div>

      <div className="mt-5">Remember:</div>

      <div>
        <li>Keep your phrase somewhere secure</li>
        <li>Never share your phrase with anyone</li>
        <li>
          Stay safe from phishing scams—<br></br>
          Koii will NEVER ask you for your recovery phrase or keyfile
        </li>
        <li>
          If you have questions or see something suspicious, contact us at security@koii.network
        </li>
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

      <div
        className="absolute bottom-11 right-7.5 text-lightBlue underline font-normal text-sm tracking-finnieSpacing-wide cursor-pointer"
        onClick={() => history.push('/')}
      >
        Skip this step
      </div>
    </div>
  )
}

export default RevealPhrase
