import React, { useContext } from 'react'
import clsx from 'clsx'

import KeyLogo from 'finnie-v2/components/KeyLogo'

import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'

import { OnboardingContext } from '../../onboardingContext'

import { TYPE } from 'constants/accountConstants'
import { NETWORK } from 'constants/koiConstants'

const ImportAKey = ({ step, setStep, setImportType }) => {
  const { setNetwork } = useContext(OnboardingContext)

  const handleImportKey = (type) => {
    setImportType(type)
    setStep(step + 1)
  }
  return (
    <div className="w-3/4 flex flex-col text-white text-left">
      <WelcomeBackgroundTop className="absolute top-0 right-0" />
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <div className="mt-10 font-semibold text-2xl tracking-finnieSpacing-wider">
        Import your Key
      </div>
      <div className="mt-5 font-normal text-lg">Click a circle below to import your key.</div>
      <div className="mt-2 font-normal text-sm w-11/12">
        Finnie currently supports Koii, Solana, Arweave and Ethereum keys. More key types are in the
        works.
      </div>
      <div className="mt-11 ml-4 flex justify-start gap-4.5">
        <div className="flex flex-col items-center">
          <KeyLogo type={TYPE.ARWEAVE} handleOnClick={() => {
            setNetwork(NETWORK.ARWEAVE)
            handleImportKey(TYPE.ARWEAVE)
          }} />
          <div className="font-normal text-lg leading-6">Koii</div>
        </div>
        <div className="flex flex-col items-center">
          <KeyLogo type={TYPE.ETHEREUM} handleOnClick={() => {
            setNetwork(NETWORK.ETHEREUM)
            handleImportKey(TYPE.ETHEREUM)
          }} />
          <div className="font-normal text-lg leading-6">Ethereum</div>
        </div>
        <div className="flex flex-col items-center">
          <KeyLogo type={TYPE.SOLANA} handleOnClick={() => {
            setNetwork(NETWORK.SOLANA)
            handleImportKey(TYPE.SOLANA)
          }} />
          <div className="font-normal text-lg leading-6">Solana</div>
        </div>
      </div>
    </div>
  )
}

export default ImportAKey
