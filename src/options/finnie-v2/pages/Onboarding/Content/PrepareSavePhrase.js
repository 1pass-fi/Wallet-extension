import React from 'react'
import clsx from 'clsx'

import WelcomeBackground from 'img/v2/onboarding/welcome-background.svg'
import NoticeIcon from 'img/v2/onboarding/notice-icon.svg'
import WarningIcon from 'img/v2/onboarding/warning-icon.svg'

import Button from 'finnie-v2/components/Button'

const PrepareSavePhrase = ({ step, setStep }) => {
  return (
    <div className="w-11/12 flex flex-col text-white text-left">
      <WelcomeBackground className="absolute bottom-0 right-0" />
      <div className="mt-10 font-semibold text-2xl tracking-finnieSpacing-wider">
        Save your Secret Phrase
      </div>
      <div className="mt-5 font-normal text-base leading-8" style={{ width: '500px' }}>
        Koii Wallets use a 12-word secret phrase to secure your account to ensure that you and only
        you will control your identity online.
      </div>
      <div className="mt-8 font-normal text-sm leading-6 w-11/12 flex">
        <NoticeIcon style={{ width: '96px', height: '96px' }} />
        <div style={{ width: '370px' }} className="flex flex-col">
          <div>
            With your Recovery Phrase, anyone can access{' '}
            <span className="text-warning-200">everything in your wallet</span>.
          </div>
          <div className="mt-2">
            This should be written on a piece of paper and never saved on a computer or
            internet-connected device.
          </div>
        </div>
      </div>
      <div className="mt-16 flex justify-start gap-12 w-full">
        <Button
          icon={WarningIcon}
          style={{ width: '240px', height: '42px' }}
          className="text-base rounded z-10 border border-white border-solid"
          variant="indigo"
          text="Remind me later."
          size="lg"
          onClick={() => setStep(step + 1)}
        />
        <Button
          style={{ width: '240px', height: '42px' }}
          className="text-base rounded z-10"
          variant="white"
          text="I'm ready!"
          onClick={() => setStep(step + 1)}
        />
      </div>
    </div>
  )
}

export default PrepareSavePhrase
