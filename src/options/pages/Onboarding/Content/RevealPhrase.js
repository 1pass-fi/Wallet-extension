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

  const openFaucet = () => {
    chrome.tabs.create({ url: 'https://koi.rocks/faucet' })
  }

  const openCreateNFTPage = () => {
    const url = chrome.runtime.getURL('options.html#/create-nft')
    chrome.tabs.create({ url })
  }

  return (
    <div
      data-testid="RevealPhrase"
      className="flex flex-col items-center justify-center text-white text-left w-full pr-4"
    >
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <KoiIcon className="w-18 h-18 absolute top-2.25 right-3.75" />
      <div className="w-3/4 flex items-center justify-center">
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
              'You successfully saved your Secret Phrase'
            ) : (
              <>
                {chrome.i18n.getMessage('rememberToSaveYourSecretPhrase')}
                <br></br>
                {chrome.i18n.getMessage('otherwiseYouCouldLoseAnytokensOrAssets')}
              </>
            )
          ) : (
            'Your key was successfully imported!'
          )}
        </div>
      </div>

      <div className="text-lg mt-12 font-normal">
        <div>{chrome.i18n.getMessage('Remember')}:</div>
        <li className="mt-2">
          {chrome.i18n.getMessage('StaySafeStart')}
          <br></br>
          <span className="text-warning">{chrome.i18n.getMessage('StaySafeMiddle')}</span>{' '}
          {chrome.i18n.getMessage('StaySafeEnd')}
        </li>
        <li>
          {chrome.i18n.getMessage('ContactUs')}{' '}
          <span className="text-success underline cursor-pointer">security@koii.network</span>
        </li>

        {network !== NETWORK.ARWEAVE && (
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
        )}
      </div>

      {network === NETWORK.ARWEAVE && (
        <div className="mt-12 flex items-center justify-center">
          <div className="flex flex-col items-center mr-19 max-w-full" style={{ width: '300px' }}>
            <KoiiToken />
            <div className="mt-3 font-normal text-lg text-center">
              {chrome.i18n.getMessage('HeadOverToFaucet')}
            </div>

            <Button
              style={{ width: '240px', height: '42px' }}
              className="mt-7 text-base rounded mx-auto z-10"
              variant="primary"
              text="Get Free KOII"
              size="lg"
              onClick={openFaucet}
              id="open-faucet-button"
            />
          </div>
          <div className="flex flex-col items-center max-w-full" style={{ width: '300px' }}>
            <ImagesNFTs />
            <div className="mt-3 font-normal text-lg text-center">
              {chrome.i18n.getMessage('GoToGalleryToCreateNFT')}
            </div>

            <Button
              style={{ width: '240px', height: '42px' }}
              className="mt-7 text-base rounded mx-auto z-10"
              variant="warningDefault"
              text="Create an NFT"
              size="lg"
              onClick={openCreateNFTPage}
              id="create-nft-page-button"
            />
          </div>
        </div>
      )}

      {network === NETWORK.ARWEAVE && (
        <div
          className="absolute bottom-11 right-7.5 text-lightBlue underline font-normal text-sm tracking-finnieSpacing-wide cursor-pointer"
          onClick={() => {
            dispatch(setIsOnboarding(false))
            dispatch(setOnboardingPath(''))
            history.push('/')
          }}
          id="skip-to-home-button"
        >
          {chrome.i18n.getMessage('skipThisStep')}
        </div>
      )}
    </div>
  )
}

export default RevealPhrase
