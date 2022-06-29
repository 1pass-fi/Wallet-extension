import React, { useContext, useState } from 'react'

import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import KoiiKey from 'img/v2/onboarding/koii-key-icon.svg'
import EthereumKey from 'img/v2/onboarding/ethereum-key-icon.svg'
import SolanaKey from 'img/v2/onboarding/solana-key-icon.svg'

import { TYPE } from 'constants/accountConstants'

import { OnboardingContext } from '../onboardingContext'
import { GalleryContext } from 'options/galleryContext'

import useMethod from '../hooks/useMethod'

import KeyLogo from 'finnie-v2/components/KeyLogo'

const GetAKey = ({ step, setStep }) => {
  const { generateNewKey } = useContext(OnboardingContext)
  const [inProcessing, setInProcessing] = useState(false)
  const [networkProcessing, setNetworkProcessing] = useState(null)

  const handleGetNewKey = async (network) => {
    if (networkProcessing) {
      return
    }

    setNetworkProcessing(network)
    setInProcessing(true)
    await generateNewKey(network)
    setInProcessing(false)
    setNetworkProcessing(null)
    setStep(step + 1)
  }

  return (
    <div className="w-3/4 flex flex-col text-white text-left">
      <WelcomeBackgroundTop className="absolute top-0 right-0" />
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <div className="mt-10 font-semibold text-2xl tracking-finnieSpacing-wider">Get a Key</div>
      <div className="mt-5 font-normal text-lg">Click a circle below to generate a key.</div>
      <div className="mt-2 font-normal text-sm w-11/12">
        Finnie currently supports Koii and Ethereum keys. More key types are in the works.
      </div>
      <div className="mt-11 ml-4 flex justify-start gap-4.5">
        <div className="flex flex-col items-center">
          <KeyLogo
            type={TYPE.ARWEAVE}
            inProcessing={inProcessing}
            networkProcessing={networkProcessing}
            handleGetNewKey={handleGetNewKey}
          />
          <div className="font-normal text-lg leading-6">Koii</div>
        </div>
        <div className="flex flex-col items-center">
          <KeyLogo
            type={TYPE.ETHEREUM}
            inProcessing={inProcessing}
            networkProcessing={networkProcessing}
            handleGetNewKey={handleGetNewKey}
          />
          <div className="font-normal text-lg leading-6">Ethereum</div>
        </div>
        <div className="flex flex-col items-center">
          <KeyLogo
            type={TYPE.SOLANA}
            inProcessing={inProcessing}
            networkProcessing={networkProcessing}
            handleGetNewKey={handleGetNewKey}
          />
          <div className="font-normal text-lg leading-6">Solana</div>
        </div>
      </div>
    </div>
  )
}

export default GetAKey
