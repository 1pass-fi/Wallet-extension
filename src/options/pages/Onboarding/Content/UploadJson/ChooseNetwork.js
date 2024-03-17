import React, { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import { NETWORK } from 'constants/koiConstants'
import ReturnIcon from 'img/return-icon.svg'
// import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import KeyLogo from 'options/components/KeyLogo'
import ToolTip from 'options/components/ToolTip'
import { popupAccount } from 'services/account'

import { OnboardingContext } from '../../onboardingContext'

const ImportAKey = ({ step, setStep, setImportType }) => {
  const { setNetwork } = useContext(OnboardingContext)
  const [showToolTip, setShowToolTip] = useState(false)

  const handleImportKey = (type) => {
    setImportType(type)
    setStep(step + 1)
  }

  useEffect(() => {
    const skipOnboarding = async () => {
      const count = await popupAccount.count()

      if (count === 0) {
        handleImportKey(TYPE.K2)
      }
    }

    skipOnboarding()
  }, [])

  return (
    <div
      data-testid="ImportAKey"
      className="w-full flex flex-col text-white text-left justify-center items-center"
    >
      <div className="w-3/5">
        <WelcomeBackgroundTop className={clsx('welcome-bg-top')} />
        {/* <WelcomeBackgroundBottom className={clsx('welcome-bg-bottom')} /> */}
        <div className="font-semibold text-2xl tracking-finnieSpacing-wider">
          {chrome.i18n.getMessage('importYourKey')}
        </div>
        <div className="mt-5 font-normal text-lg">
          {chrome.i18n.getMessage('selectTheChainYourKeyLivesOn')}
        </div>
        <div className="mt-2 font-normal text-sm w-11/12">
          {chrome.i18n.getMessage('finnieSuppportsJsonImport')}
        </div>
        <div className="mt-2 font-normal text-sm w-11/12">
          {chrome.i18n.getMessage('weAreWorkingOnSupporting')}
        </div>

        <div className="mt-11 ml-1 lg:flex lg:justify-start gap-4.5 grid grid-cols-2">
          {/* K2 */}
          <div className="flex flex-col items-center">
            <KeyLogo
              type={TYPE.K2}
              handleOnClick={() => {
                setNetwork(NETWORK.K2)
                handleImportKey(TYPE.K2)
              }}
              data_testid={'k2-key'}
            />
            <div className="font-normal text-lg leading-6">Koii</div>
          </div>
          {/* ARWEAVE */}
          <div className="flex flex-col items-center">
            <KeyLogo
              type={TYPE.ARWEAVE}
              handleOnClick={() => {
                setNetwork(NETWORK.ARWEAVE)
                handleImportKey(TYPE.ARWEAVE)
              }}
              data_testid={'arweave-key'}
            />
            <div className="font-normal text-lg leading-6">Arweave</div>
          </div>
          {/* SOLANA */}
          <div
            className="flex flex-col items-center opacity-50"
            data-tip={chrome.i18n.getMessage('comingSoon')}
            onMouseEnter={() => setShowToolTip(true)}
            onMouseLeave={() => setShowToolTip(false)}
          >
            <KeyLogo
              type={TYPE.SOLANA}
              handleOnClick={() => {
                // setNetwork(NETWORK.SOLANA)
                // handleImportKey(TYPE.SOLANA)
              }}
              data_testid={'solana-key'}
            />
            <div className="font-normal text-lg leading-6">Solana</div>
          </div>
          {/* ETHEREUM */}
          <div
            className="flex flex-col items-center opacity-50"
            data-tip={chrome.i18n.getMessage('comingSoon')}
            onMouseEnter={() => setShowToolTip(true)}
            onMouseLeave={() => setShowToolTip(false)}
          >
            <KeyLogo
              type={TYPE.ETHEREUM}
              handleOnClick={() => {
                // setNetwork(NETWORK.ETHEREUM)
                // handleImportKey(TYPE.ETHEREUM)
              }}
              data_testid={'ethereum-key'}
            />
            <div className="font-normal text-lg leading-6">Ethereum</div>
          </div>
        </div>
        {showToolTip && <ToolTip />}
        <div onClick={() => setStep(0)} className="absolute top-5 left-5 cursor-pointer">
          <ReturnIcon />
        </div>
      </div>
    </div>
  )
}

export default ImportAKey
