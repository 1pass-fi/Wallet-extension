import React, { useContext, useState } from 'react'
import { TYPE } from 'constants/accountConstants'
import { NETWORK } from 'constants/koiConstants'
import KeyLogo from 'finnie-v2/components/KeyLogo'
import ToolTip from 'finnie-v2/components/ToolTip'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import KeyLogo from 'options/components/KeyLogo'

import { OnboardingContext } from '../onboardingContext'

const GetAKey = ({ step, setStep, setImportType }) => {
  const { generateNewKey, setNetwork } = useContext(OnboardingContext)

  const [inProcessing, setInProcessing] = useState(false)
  const [networkProcessing, setNetworkProcessing] = useState(null)

  const handleGetNewKey = async (network) => {
    if (networkProcessing) {
      return
    }

    switch (network) {
      // case TYPE.K2:
      //   setNetwork(NETWORK.K2)
      //   break
      case TYPE.ETHEREUM:
        setNetwork(NETWORK.ETHEREUM)
        break
      case TYPE.SOLANA:
        setNetwork(NETWORK.SOLANA)
        break
      case TYPE.ARWEAVE:
        setNetwork(NETWORK.ARWEAVE)
        break
    }

    setNetworkProcessing(network)
    setInProcessing(true)
    setImportType(network)
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
      <div className="mt-11 ml-1 flex justify-start gap-4.5">
        <div
          className="flex flex-col items-center opacity-50"
          data-tip="Coming soon"
        >
          <KeyLogo
            type={TYPE.K2}
            inProcessing={inProcessing}
            networkProcessing={networkProcessing}
            handleOnClick={handleGetNewKey}
          />
          <div className="font-normal text-lg leading-6">Koii</div>
        </div>
        <ToolTip />
        <div className="flex flex-col items-center">
          <KeyLogo
            type={TYPE.ETHEREUM}
            inProcessing={inProcessing}
            networkProcessing={networkProcessing}
            handleOnClick={handleGetNewKey}
          />
          <div className="font-normal text-lg leading-6">Ethereum</div>
        </div>
        <div className="flex flex-col items-center">
          <KeyLogo
            type={TYPE.SOLANA}
            inProcessing={inProcessing}
            networkProcessing={networkProcessing}
            handleOnClick={handleGetNewKey}
          />
          <div className="font-normal text-lg leading-6">Solana</div>
        </div>
        <div className="flex flex-col items-center">
          <KeyLogo
            type={TYPE.ARWEAVE}
            inProcessing={inProcessing}
            networkProcessing={networkProcessing}
            handleOnClick={handleGetNewKey}
          />
          <div className="font-normal text-lg leading-6">Arweave</div>
        </div>
      </div>
    </div>
  )
}

export default GetAKey
