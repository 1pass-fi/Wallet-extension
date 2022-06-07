import React from 'react'
import clsx from 'clsx'

import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import KoiiKey from 'img/v2/onboarding/koii-key-icon.svg'
import EthereumKey from 'img/v2/onboarding/ethereum-key-icon.svg'

const GetAKey = ({ step, setStep }) => {
  return (
    <div className="w-3/4 flex flex-col text-white text-left">
      <WelcomeBackgroundTop className="absolute top-0 right-0" />
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <div className="font-semibold text-2xl tracking-finnieSpacing-wider">Get a Key</div>
      <div className="mt-5 font-normal text-lg">Click a circle below to generate a key.</div>
      <div className="mt-2 font-normal text-sm w-11/12">
        Finnie currently supports Koii and Ethereum keys. More key types are in the works.
      </div>
      <div className="mt-11 ml-4 flex justify-between">
        <div className="flex flex-col items-center">
          <KoiiKey className="cursor-pointer" onClick={() => setStep(step + 1)} />
          <div className="font-normal text-lg leading-6">Koii Key</div>
        </div>
        <div className="flex flex-col items-center">
          <EthereumKey className="cursor-pointer" onClick={() => setStep(step + 1)} />
          <div className="font-normal text-lg leading-6">Ethereum Key</div>
        </div>
      </div>
    </div>
  )
}

export default GetAKey
