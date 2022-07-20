import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'

import { GalleryContext } from 'options/galleryContext'
import { OnboardingContext } from '../onboardingContext'

import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'
import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'
import SuccessIcon from 'img/v2/onboarding/success-icon.svg'
import KoiiToken from 'img/v2/onboarding/koii-token.svg'
import ImagesNFTs from 'img/v2/onboarding/images-nfts.svg'

import Button from 'finnie-v2/components/Button'

import { NETWORK } from 'constants/koiConstants'

const RevealPhrase = ({ step }) => {
  const { setIsOnboarding } = useContext(GalleryContext)
  const { network } = useContext(OnboardingContext)
  const history = useHistory()

  const openFaucet = () => {
    chrome.tabs.create({ url: 'https://koi.rocks/faucet' })
  }

  const openCreateNFTPage = () => {
    const url = chrome.extension.getURL('options.html#/create-nft')
    chrome.tabs.create({ url })
  }

  return (
    <div className="flex flex-col items-center justify-center text-white text-left w-full pr-4">
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <KoiIcon className="w-18 h-18 absolute top-2.25 right-3.75" />
      <div className="w-3/4 flex items-center justify-center">
        <SuccessIcon className="w-20 h-20 mr-6.5" />
        <div
          className="font-semibold text-2xl tracking-finnieSpacing-wider self-center"
          // style={{ width: '350px' }}
        >
          {step === 6
            ? 'You successfully saved your Secret Phrase'
            : 'Your key was successfully imported!'}
        </div>
      </div>

      <div className="text-lg mt-12 font-normal">
        <div>Remember:</div>
        <li className="mt-2">
          Stay safe from phishing scams—<br></br>
          <span className="text-warning">Koii will NEVER ask you for your secret phrase</span> or
          keyfile
        </li>
        <li>
          If you have questions or see something suspicious, contact us at{' '}
          <span className="text-success underline cursor-pointer">security@koii.network</span>
        </li>
      </div>

      {(network === NETWORK.ARWEAVE || network === NETWORK.K2) && (
        <div className="mt-12 flex items-center justify-center">
          <div className="flex flex-col items-center mr-19" style={{ width: '300px' }}>
            <KoiiToken />
            <div className="mt-3 font-normal text-lg text-center">
              Head over to the faucet to grab some free KOII tokens.
            </div>

            <Button
              style={{ width: '240px', height: '42px' }}
              className="mt-7 text-base rounded mx-auto z-10"
              variant="primary"
              text="Get Free KOII"
              size="lg"
              onClick={openFaucet}
            />
          </div>
          <div className="flex flex-col items-center" style={{ width: '300px' }}>
            <ImagesNFTs />
            <div className="mt-3 font-normal text-lg text-center">
              Or go to the gallery to create your first Finnie NFT
            </div>

            <Button
              style={{ width: '240px', height: '42px' }}
              className="mt-7 text-base rounded mx-auto z-10"
              variant="warningDefault"
              text="Create an NFT"
              size="lg"
              onClick={openCreateNFTPage}
            />
          </div>
        </div>
      )}

      <div
        className="absolute bottom-11 right-7.5 text-lightBlue underline font-normal text-sm tracking-finnieSpacing-wide cursor-pointer"
        onClick={() => {
          setIsOnboarding(false)
          history.push('/')
        }}
      >
        {network === NETWORK.ARWEAVE || network === NETWORK.K2
          ? 'Skip this step'
          : 'Go to homepage'}
      </div>
    </div>
  )
}

export default RevealPhrase
