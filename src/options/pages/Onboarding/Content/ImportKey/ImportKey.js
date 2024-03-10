import React, { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import { NETWORK } from 'constants/koiConstants'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import KeyLogo from 'options/components/KeyLogo'
import ToolTip from 'options/components/ToolTip'
import { popupAccount } from 'services/account'

import { OnboardingContext } from '../../onboardingContext'

const ImportAKey = ({ step, setStep, setImportType }) => {
  const [totalAccount, setTotalAccount] = useState(0)
  const { setNetwork } = useContext(OnboardingContext)

  const handleImportKey = (type) => {
    setImportType(type)
    setStep(step + 1)
  }

  useEffect(() => {
    const skipOnboarding = async () => {
      const count = await popupAccount.count()
      if (count === 0) {
        handleImportKey(TYPE.K2)
      } else {
        setTotalAccount(count)
      }
    }

    skipOnboarding()
  }, [])

  return (
    <div data-testid="ImportAKey" className="w-3/4 flex flex-col text-white text-left">
      <WelcomeBackgroundTop className={clsx('welcome-bg-top')} />
      <WelcomeBackgroundBottom className={clsx('welcome-bg-bottom')} />
      <div className="z-10">
        <div className="mt-10 font-semibold text-2xl tracking-finnieSpacing-wider">
          {chrome.i18n.getMessage('importYourKey')}
        </div>
        <div className="mt-5 font-normal text-lg">{chrome.i18n.getMessage('clickCircle')}</div>
        <div className="mt-2 font-normal text-sm w-11/12">
          {chrome.i18n.getMessage('finnieCurrentlyKeySupports')}
        </div>
        <div className="mt-11 ml-1 lg:flex lg:justify-start gap-4.5 grid grid-cols-2 z-10">
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
          <ToolTip />
          <div className="flex flex-col items-center">
            <KeyLogo
              type={TYPE.ETHEREUM}
              handleOnClick={() => {
                setNetwork(NETWORK.ETHEREUM)
                handleImportKey(TYPE.ETHEREUM)
              }}
              data_testid={'ethereum-key'}
            />
            <div className="font-normal text-lg leading-6">Ethereum</div>
          </div>
          <div className="flex flex-col items-center">
            <KeyLogo
              type={TYPE.SOLANA}
              handleOnClick={() => {
                setNetwork(NETWORK.SOLANA)
                handleImportKey(TYPE.SOLANA)
              }}
              data_testid={'solana-key'}
            />
            <div className="font-normal text-lg leading-6">Solana</div>
          </div>
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
        </div>
      </div>
    </div>
  )
}

export default ImportAKey
