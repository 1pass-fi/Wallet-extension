import React, { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
import { NETWORK } from 'constants/koiConstants'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import WarningIcon from 'img/warning-triangle.svg'
import KeyLogo from 'options/components/KeyLogo'
import ToolTip from 'options/components/ToolTip'
import { popupAccount } from 'services/account'

import { OnboardingContext } from '../onboardingContext'

const GetAKey = ({ step, setStep, setImportType }) => {
  const { generateNewKey, setNetwork } = useContext(OnboardingContext)

  const [inProcessing, setInProcessing] = useState(false)
  const [networkProcessing, setNetworkProcessing] = useState(null)
  const [totalAccount, setTotalAccount] = useState(0)

  const handleGetNewKey = async (network) => {
    if (networkProcessing) {
      return
    }

    switch (network) {
      case TYPE.K2:
        setNetwork(NETWORK.K2)
        break
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

  useEffect(() => {
    const skipOnboarding = async () => {
      const count = await popupAccount.count()
      if (count === 0) {
        handleGetNewKey(TYPE.K2)
      } else {
        setTotalAccount(count)
      }
    }

    skipOnboarding()
  }, [])

  return (
    <div data-testid="GetAKey" className="w-3/4 flex flex-col text-white text-left">
      <WelcomeBackgroundTop className={clsx('welcome-bg-top')} />
      <WelcomeBackgroundBottom className={clsx('welcome-bg-bottom')} />
      {totalAccount > 0 && (
        <div className={clsx('z-10')}>
          <div className="mt-10 font-semibold text-2xl tracking-finnieSpacing-wider">
            {chrome.i18n.getMessage('getAKey')}
          </div>
          <div className="mt-5 font-normal text-lg">
            {chrome.i18n.getMessage('clickACircleBelowToGenerateAKey')}
          </div>
          <div className="mt-2 font-normal text-sm w-11/12">
            {chrome.i18n.getMessage('finnieCurrentlySupports')}
          </div>

          <div className="mt-11 ml-1 lg:flex lg:justify-start gap-4.5 grid grid-cols-2">
            <div className="flex flex-col items-center">
              <KeyLogo
                type={TYPE.K2}
                inProcessing={inProcessing}
                networkProcessing={networkProcessing}
                handleOnClick={handleGetNewKey}
                data_testid="k2-key"
              />
              <div className="font-normal text-lg leading-6">Koii</div>
            </div>
            <ToolTip />
            {totalAccount > 0 && (
              <div className="flex flex-col items-center">
                <KeyLogo
                  type={TYPE.ETHEREUM}
                  inProcessing={inProcessing}
                  networkProcessing={networkProcessing}
                  handleOnClick={handleGetNewKey}
                  data_testid="ethereum-key"
                />
                <div className="font-normal text-lg leading-6">Ethereum</div>
              </div>
            )}
            {totalAccount > 0 && (
              <div className="flex flex-col items-center">
                <KeyLogo
                  type={TYPE.SOLANA}
                  inProcessing={inProcessing}
                  networkProcessing={networkProcessing}
                  handleOnClick={handleGetNewKey}
                  data_testid="solana-key"
                />
                <div className="font-normal text-lg leading-6">Solana</div>
              </div>
            )}
            {totalAccount > 0 && (
              <div className="flex flex-col items-center">
                <KeyLogo
                  type={TYPE.ARWEAVE}
                  inProcessing={inProcessing}
                  networkProcessing={networkProcessing}
                  handleOnClick={handleGetNewKey}
                  data_testid="arweave-key"
                />
                <div className="font-normal text-lg leading-6">Arweave</div>
              </div>
            )}
          </div>

          <div className="mt-6 ml-3 text-warning flex items-center gap-2">
            <WarningIcon width={24} height={24} />
            <span>
              Older keys run on Arweave. If your key was created before{' '}
              <span
                className="cursor-not-allowed underline"
                data-tip={chrome.i18n.getMessage('oldKeys')}
                data-for="K2"
              >
                K2
              </span>
              , select Arweave for import.
            </span>
          </div>
        </div>
      )}
      <ToolTip id="K2" />
    </div>
  )
}

export default GetAKey
