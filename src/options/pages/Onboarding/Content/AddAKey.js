import React from 'react'
import clsx from 'clsx'
import CreateNewIcon from 'img/v2/onboarding/create-new-icon.svg'
import KeySelectedIcon from 'img/v2/onboarding/key-selected-icon.svg'
// import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top.svg'

const SEED_STRING = 'color tired merge rural token pole capable people metal student catch uphold'

const AddAKey = ({ step, setStep, setPhrase }) => {
  return (
    <div data-testid="AddAKey" className="w-4/5 flex flex-col text-white">
      <WelcomeBackgroundTop className={clsx('welcome-bg-top')} />
      {/* <WelcomeBackgroundBottom className={clsx('welcome-bg-bottom')} /> */}
      <div
        className="ml-3 font-normal text-base leading-6 text-left max-w-full"
        style={{ width: '347px' }}
      >
        {chrome.i18n.getMessage('doYouReady')}{' '}
        <span className="text-warning">{chrome.i18n.getMessage('haveAKeyLc')}</span>{' '}
        {chrome.i18n.getMessage('addAKeyMsgLc')}{' '}
        <span className="text-turquoiseBlue">{chrome.i18n.getMessage('startFromScratchLc')}?</span>
      </div>
      <div className="mt-12 flex w-full justify-start lg:gap-32 gap-10">
        <div
          className={clsx(
            'bg-blue-800 shadow-md rounded-finnie z-10',
            'flex flex-col items-center justify-center cursor-pointer',
            'hover:border-turquoiseBlue border-transparent border'
          )}
          style={{ width: '249px', height: '140px' }}
          onClick={() => {
            setPhrase(SEED_STRING)
            setStep(step + 1)
          }}
        >
          <CreateNewIcon style={{ width: '32px', height: '32px' }} />
          <div
            data-testid="start-from-scratch-div"
            className="mt-3 font-semibold text-base leading-4 text-center text-white"
          >
            {chrome.i18n.getMessage('startFromScratch')}
          </div>
          <div className="mt-2 font-normal text-xs text-center tracking-finnieSpacing-wide text-white">
            {chrome.i18n.getMessage('getANewKey')}
          </div>
        </div>
        <div
          className={clsx(
            'bg-blue-800 shadow-md rounded-finnie z-10',
            'flex flex-col items-center justify-center cursor-pointer',
            'hover:border-turquoiseBlue border-transparent border'
          )}
          style={{ width: '249px', height: '140px' }}
          onClick={() => {
            setStep(10)
          }}
        >
          <KeySelectedIcon style={{ width: '48px', height: '48px' }} />
          <div
            data-testid="use-existing-key-div"
            className="mt-3 font-semibold text-base leading-4 text-center text-white"
          >
            {chrome.i18n.getMessage('useMyExistingKey')}
          </div>
          <div className="mt-2 font-normal text-xs text-center tracking-finnieSpacing-wide text-white w-9/12">
            {chrome.i18n.getMessage('importAKeyWithASecretPhrase')}
          </div>
        </div>
      </div>
      <div
        style={{ color: '#8989C7' }}
        className="absolute text-base font-semibold underline cursor-pointer bottom-12 right-14"
        onClick={() => {
          setStep(13)
        }}
      >
        Import a key file
      </div>
    </div>
  )
}

export default AddAKey
