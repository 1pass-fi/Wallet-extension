import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'

import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'
import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'
import SuccessIcon from 'img/v2/onboarding/success-icon.svg'

import Button from 'finnie-v2/components/Button'

const RevealPhrase = ({ step, setStep }) => {
  const history = useHistory()

  return (
    <div className="flex flex-col items-center justify-center text-white text-left w-full pr-4">
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <KoiIcon className="w-18 h-18 absolute top-2.25 right-3.75" />
      <div className="flex items-center">
        <SuccessIcon className="w-20 h-20 mr-6.5" />
        <div
          className="font-semibold text-2xl tracking-finnieSpacing-wider h-16"
          style={{ width: '350px' }}
        >
          You successfully saved your Recovery Phrase
        </div>
      </div>

      <div className="text-lg mt-12 font-normal">
        <div>Remember:</div>
        <li className="mt-2">
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
          <span className="text-success underline cursor-pointer">security@koii.network</span>
        </li>
      </div>

      <div className="flex items-center justify-center h-36">
        <div className="h-10 mt-12 mr-19" style={{ width: '300px' }}>
          <div className="font-normal text-lg text-center">
            Head over to the faucet to grab some free KOII tokens.
          </div>

          <Button
            style={{ width: '240px', height: '42px' }}
            className="mt-10 text-base rounded mx-auto z-10"
            variant="primary"
            text="Get Free KOII"
            size="lg"
          />
        </div>
        <div className="h-10 mt-12" style={{ width: '300px' }}>
          <div className="font-normal text-lg text-center">
            Or go to the gallery to create your first Finnie NFT
          </div>

          <Button
            style={{ width: '240px', height: '42px' }}
            className="mt-10 text-base rounded mx-auto z-10"
            variant="warningDefault"
            text="Create an NFT"
            size="lg"
          />
        </div>
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
