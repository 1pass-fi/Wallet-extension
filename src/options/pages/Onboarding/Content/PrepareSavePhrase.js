import React, { useContext } from 'react'
import clsx from 'clsx'
import NoticeIcon from 'img/v2/onboarding/notice-icon.svg'
import WarningIcon from 'img/v2/onboarding/warning-icon.svg'
import WelcomeBackground from 'img/v2/onboarding/welcome-background-1.svg'
import Button from 'options/components/Button'

import useMethod from '../hooks/useMethod'
import { OnboardingContext } from '../onboardingContext'

const PrepareSavePhrase = ({ step, setStep, importType }) => {
  const { newSeedphrase, password, setSkipPhrase } = useContext(OnboardingContext)

  const { saveNewKey } = useMethod({ newSeedphrase, password })

  const handleRemindMeLater = async () => {
    await saveNewKey(importType)
    setSkipPhrase(true)
    setStep(6)
  }

  return (
    <div
      data-testid="PrepareSavePhrase"
      className="w-11/12 flex flex-col text-white text-left max-w-full"
    >
      <WelcomeBackground className={clsx('absolute bottom-0 right-0 z-0')} />
      <div className="mt-10 font-semibold text-2xl tracking-finnieSpacing-wider z-10">
        {chrome.i18n.getMessage('saveYourSecretPhrase')}
      </div>
      <div className="mt-5 font-normal text-base leading-8 max-w-full z-10" style={{ width: '500px' }}>
        {chrome.i18n.getMessage('koiiWalletsUseA')} {/* TODO add tooltip/link */}
        <a
          target="_blank"
          href="https://cointelegraph.com/explained/what-is-a-seed-phrase-and-why-is-it-important"
          className="text-turquoiseBlue underline cursor-pointer"
        >
          {chrome.i18n.getMessage('12WordSecretPhrase')}
        </a>{' '}
        {chrome.i18n.getMessage('secretPhraseMsgLc')}
      </div>
      <div className="mt-8 font-normal text-sm leading-6 w-11/12 flex z-10">
        <NoticeIcon style={{ width: '96px', height: '96px' }} />
        <div style={{ width: '370px' }} className="flex flex-col max-w-full">
          <div>
            {chrome.i18n.getMessage('withYourSecretPhrase')}{' '}
            <span className="text-warning-200">
              {chrome.i18n.getMessage('everythingInYourWalletLc')}
            </span>
            .
          </div>
          <div className="mt-2">{chrome.i18n.getMessage('thisShouldBeWrittenOnAPieceOfPaper')}</div>
        </div>
      </div>
      <div className="mt-16 flex justify-start gap-12 w-full z-10">
        <Button
          icon={WarningIcon}
          style={{ width: '240px', height: '42px' }}
          className="rounded z-10 border border-white border-solid"
          variant="indigo"
          text={chrome.i18n.getMessage('remindMeLater') + '.'}
          size="lg"
          onClick={handleRemindMeLater}
          data-testid={'remind-me-button'}
        />
        <Button
          style={{ width: '240px', height: '42px' }}
          className="rounded z-10"
          variant="white"
          text={chrome.i18n.getMessage('imReady')}
          size="lg"
          onClick={() => setStep(step + 1)}
          data-testid={'ready-button'}
        />
      </div>
    </div>
  )
}

export default PrepareSavePhrase
