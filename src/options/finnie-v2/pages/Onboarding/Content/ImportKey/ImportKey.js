import React from 'react'
import clsx from 'clsx'

import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import KoiiKey from 'img/v2/onboarding/koii-key-icon.svg'
import EthereumKey from 'img/v2/onboarding/ethereum-key-icon.svg'
import SolanaKey from 'img/v2/onboarding/solana-key-icon.svg'
import { TYPE } from 'constants/accountConstants'

const ImportAKey = ({ step, setStep, setImportType }) => {
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
          <KoiiKey
            className="cursor-pointer"
            onClick={() => {
              setImportType(TYPE.ARWEAVE)
              setStep(step + 1)
            }}
          />
          <div className="font-normal text-lg leading-6">Koii Key</div>
        </div>
        <div className="flex flex-col items-center">
          <EthereumKey
            className="cursor-pointer"
            onClick={() => {
              setImportType(TYPE.ETHEREUM)
              setStep(step + 1)
            }}
          />
          <div className="font-normal text-lg leading-6">Ethereum Key</div>
        </div>
        <div className="flex flex-col items-center">
          <SolanaKey
            className="cursor-pointer"
            onClick={() => {
              setImportType(TYPE.SOLANA)
              setStep(step + 1)
            }}
          />
          <div className="font-normal text-lg leading-6">Solana Key</div>
        </div>
      </div>
    </div>
  )
}

export default ImportAKey
