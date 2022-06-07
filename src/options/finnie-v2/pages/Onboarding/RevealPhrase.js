import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'

import WelcomeBackground1 from 'img/v2/onboarding/welcome-background-1.svg'
import WelcomeBackground2 from 'img/v2/onboarding/welcome-background-2.svg'
import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'

import Button from 'finnie-v2/components/Button'

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

      <div className="mt-5 font-normal text-base">Remember:</div>

      <div>
        <li>
          Keep your phrase <span className="text-warning">somewhere secure</span>
        </li>
        <li>
          <span className="text-warning">Never share</span> your phrase with anyone
        </li>
        <li>
          Stay safe from phishing scams—<br></br>
          <span className="text-warning">Koii will NEVER ask you for your recovery phrase</span> or
          keyfile
        </li>
        <li>
          If you have questions or see something suspicious, contact us at{' '}
          <span className="text-success">security@koii.network</span>
        </li>
      </div>

      <div className="mt-10 font-normal text-xl leading-8">
        Head over to the faucet to grab some free KOII tokens.
      </div>

      <Button
        style={{ width: '240px', height: '42px' }}
        className="mt-5 text-base rounded mx-auto z-10"
        variant="primary"
        text="Get Free KOII"
        size="lg"
      />

      <div className="mt-11.5 font-normal text-xl leading-8">
        Or go to the gallery to create your first Finnie NFT
      </div>

      <Button
        style={{ width: '240px', height: '42px' }}
        className="mt-5 text-base rounded mx-auto z-10"
        variant="warningDefault"
        text="Create an NFT"
        size="lg"
      />

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
