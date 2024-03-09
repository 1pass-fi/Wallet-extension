import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { NETWORK } from 'constants/koiConstants'
import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'
import ImagesNFTs from 'img/v2/onboarding/images-nfts.svg'
import KoiiToken from 'img/v2/onboarding/koii-token.svg'
import SeedphraseSelectedIcon from 'img/v2/onboarding/seedphrase-selected-icon.svg'
import SuccessIcon from 'img/v2/onboarding/success-icon.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'
import { setIsOnboarding, setOnboardingPath } from 'options/actions/onboardingProcessing'
import Button from 'options/components/Button'
import { GalleryContext } from 'options/galleryContext'

import { OnboardingContext } from '../onboardingContext'

const RevealPhrase = ({ step }) => {
  const dispatch = useDispatch()
  const { network, skipPhrase } = useContext(OnboardingContext)
  const history = useHistory()

  return (
    <div
      data-testid="RevealPhrase"
      className="flex flex-col items-center justify-center text-white text-left w-full pr-4"
    >
      <WelcomeBackgroundBottom className={clsx('absolute bottom-0 left-0 z-0')} />
      <KoiIcon className="w-18 h-18 absolute top-2.25 right-3.75" />
      <div className="w-3/4 flex items-center justify-center z-10">
        {!skipPhrase ? (
          <SuccessIcon className="w-20 h-20 mr-6.5" />
        ) : (
          <SeedphraseSelectedIcon className="w-20 h-20 mr-6.5" />
        )}
        <div
          className="w-5/6 font-semibold text-2xl tracking-finnieSpacing-wider self-center"
          // style={{ width: '350px' }}
        >
          {step === 6 ? (
            !skipPhrase ? (
              chrome.i18n.getMessage('saveSecretPhraseSuccessfully')
            ) : (
              <>
                {chrome.i18n.getMessage('rememberToSaveYourSecretPhrase')}
                <br></br>
                {chrome.i18n.getMessage('otherwiseYouCouldLoseAnyTokensOrAssets')}
              </>
            )
          ) : (
            chrome.i18n.getMessage('importKeySuccessfully')
          )}
        </div>
      </div>

      <div className="text-lg mt-12 font-normal z-10">
        <div>{chrome.i18n.getMessage('remember')}:</div>
        <li className="mt-2">
          {chrome.i18n.getMessage('staySafeStart')}
          <br></br>
          <span className="text-warning">{chrome.i18n.getMessage('staySafeMiddle')}</span>{' '}
          {chrome.i18n.getMessage('staySafeEnd')}
        </li>
        <li>
          {chrome.i18n.getMessage('contactUs')}{' '}
          <span className="text-success underline cursor-pointer">security@koii.network</span>
        </li>

        <div className="w-full">
          <Button
            style={{ width: '240px', height: '42px' }}
            className="mt-10 text-base rounded z-10"
            variant="white"
            text={chrome.i18n.getMessage('goToHomepage')}
            onClick={() => {
              dispatch(setIsOnboarding(false))
              dispatch(setOnboardingPath(''))
              history.push('/')
            }}
            id="go-to-home-button"
          />
        </div>
      </div>
    </div>
  )
}

export default RevealPhrase
