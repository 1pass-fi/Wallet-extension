import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  clusterApiUrl as clusterApiUrlK2,
  Connection as ConnectionK2,
  PublicKey as PublicKeyK2
} from '@_koi/web3.js'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { clusterApiUrl,Connection, PublicKey } from '@solana/web3.js'
import BackIcon from 'img/v2/back-icon.svg'
import EditIcon from 'img/v2/onboarding/edit-icon.svg'
import EditSelectedIcon from 'img/v2/onboarding/edit-selected-icon.svg'
import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'
import KeyIcon from 'img/v2/onboarding/key-icon.svg'
import KeySelectedIcon from 'img/v2/onboarding/key-selected-icon.svg'
import LockIcon from 'img/v2/onboarding/lock-icon.svg'
import LockSelectedIcon from 'img/v2/onboarding/lock-selected-icon.svg'
import SeedphraseIcon from 'img/v2/onboarding/seedphrase-icon.svg'
import SeedphraseSelectedIcon from 'img/v2/onboarding/seedphrase-selected-icon.svg'
import isEmpty from 'lodash/isEmpty'
import { setIsOnboarding, setOnboardingPath } from 'options/actions/onboardingProcessing'
import storage from 'services/storage'

import { onboardingSteps } from '../Onboarding'

const NavBar = ({ step, setStep }) => {
  // console.log('Hello00000000000:')
  // let publicKey = new PublicKeyK2(
  //   '2t8wijoh6nTMAMhB78mcBCZqgobjww2LtdtZCKAFYh2F',
  // )
  // let mintKey = new PublicKey('26EvTPUnyAiYMyYVuJTeDhkGj5eoc4Nj9BpLgFAa4HNq')
  // let beneficiary = await PublicKey.findProgramAddressSync(
  //   [
  //     publicKey.toBuffer(),
  //     TOKEN_PROGRAM_ID.toBuffer(),
  //     mintKey.toBuffer(),
  //   ],
  //   ASSOCIATED_TOKEN_PROGRAM_ID
  // )[0]

  // console.log('beneficiaryAccount', beneficiary.toBase58())

  // const clusterSlug = await storage.setting.get.k2Provider()
  // const connection = new ConnectionK2(clusterApiUrlK2(clusterSlug))
  // // const connection = new Connection(
  // //   clusterApiUrl('devnet'),
  // //   'confirmed'
  // // )
  // // const rpcUrl = await getRpcUrl()
  // // const SPL_CONNECTION = new Connection(rpcUrl, 'confirmed')
 
  // console.log('beneficiaryAccount', publicKey.toBase58(), clusterSlug)
  // getTokenBalanceWeb3(connection, publicKey).catch(err => console.log(err))

  // async function getTokenBalanceWeb3(connection, tokenAccount) {
  //   const info = await connection.getTokenAccountBalance(tokenAccount)
  //   if (!info.value.uiAmount) throw new Error('No balance found')
  //   console.log('Balance (using Solana-Web3.js): ', info.value.uiAmount)
  //   return info.value.uiAmount
  // }

  
  const dispatch = useDispatch()
  const history = useHistory()
  const onboardingPath = useSelector((state) => state.onboarding.path)

  const handleBack = () => {
    if (!isEmpty(onboardingPath)) {
      if (step === 2 || step === 10) {
        dispatch(setIsOnboarding(false))
        dispatch(setOnboardingPath(''))
        history.push('/settings/wallet')
      }
    }

    if (step === 10) {
      setStep(1)
    } else {
      setStep(step - 1)
    }

    if (step === 0) {
      dispatch(setIsOnboarding(false))
      dispatch(setOnboardingPath(''))
      history.push('/settings/wallet')
    }
  }

  const accounts = useSelector((state) => state.accounts)

  return (
    <div className="w-1/3 h-full bg-blue-800 shadow-lg flex flex-col items-center overflow-hidden">
      {step > 0 && step !== 6 && step !== 12 && (
        <BackIcon
          className="absolute top-5.5 left-6 cursor-pointer"
          style={{ width: '45px', height: '45px' }}
          onClick={handleBack}
          name="back-button"
        />
      )}
      {step === 0 && !isEmpty(accounts) && (
        <BackIcon
          className="absolute top-5.5 left-6 cursor-pointer"
          style={{ width: '45px', height: '45px' }}
          onClick={handleBack}
          name="back-button"
        />
      )}

      <div className="w-11/12 flex flex-col items-center">
        <KoiIcon style={{ width: '156px', height: '156px' }} />
        {onboardingSteps[step] === 'CREATE_PASSWORD' && (
          <div
            className="font-normal tracking-finnieSpacing-tightest text-white -pt-4"
            style={{ fontSize: '40px', lineHeight: '48px' }}
          >
            {chrome.i18n.getMessage('welcomeToTheFinnieWallet')}
            <div className="mt-6.25 mb-8 font-normal text-lg tracking-finnieSpacing-tight  text-success">
              {chrome.i18n.getMessage('getSetupInJust4QuickEasySteps')}
            </div>
          </div>
        )}
      </div>
      <div className="w-4/5 flex flex-col items-start gap-6 pt-8 font-normal text-base leading-8 text-white select-none text-left">
        {step === 0 ? (
          <div className="flex text-warning items-center">
            <LockSelectedIcon />
            <div className="w-4/5 ml-4">{chrome.i18n.getMessage('secureFinnieWithAPassword')}</div>
          </div>
        ) : (
          <div className="flex items-center">
            <LockIcon />
            <div className="w-4/5 ml-4">{chrome.i18n.getMessage('secureFinnieWithAPassword')}</div>
          </div>
        )}
        {step === 1 || step === 2 || step === 10 || step === 11 || step === 12 ? (
          <div className="flex text-warning">
            <KeySelectedIcon />
            <div className="w-4/5 flex flex-col whitespace-pre-wrap">
              <div className="ml-4">{chrome.i18n.getMessage('createOrImportAKey')}</div>
              <span className="ml-4 font-normal text-sm leading-6 text-trueGray-100">
                {step === 1 || step === 2
                  ? chrome.i18n.getMessage('chooseANewKoiiOrEthereumAccount')
                  : step === 10
                    ? chrome.i18n.getMessage('selectChainOfKey')
                    : chrome.i18n.getMessage('TypeYourSecretPhrase')}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <KeyIcon />
            <div className="w-4/5 ml-4">{chrome.i18n.getMessage('createOrImportAKey')}</div>
          </div>
        )}
        {step < 10 &&
          (2 < step && step < 5 ? (
            <div className="flex text-warning">
              <EditSelectedIcon />
              <div className="w-4/5 flex flex-col whitespace-pre-wrap">
                <div className="w-4/5 ml-4">
                  {chrome.i18n.getMessage('writeDownYourSecretPhrase')}
                </div>
                <span className="ml-4 font-normal text-sm leading-6 text-trueGray-100">
                  {chrome.i18n.getMessage('grabAPenAndPaper')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <EditIcon />
              <div className="w-4/5 ml-4">
                {chrome.i18n.getMessage('writeDownYourSecretPhrase')}
              </div>
            </div>
          ))}

        {step < 10 &&
          (step === 5 || step == 6 ? (
            <div className="flex text-warning">
              <SeedphraseSelectedIcon style={{ width: '48px', height: '48px' }} />
              <div className="w-4/5 flex flex-col whitespace-pre-wrap">
                <div className="w-4/5 ml-4">
                  {chrome.i18n.getMessage('confirmYourSecretPhrase')}
                </div>
                <span className="ml-4 font-normal text-sm leading-6 text-trueGray-100">
                  {chrome.i18n.getMessage('reEnterThreeWords')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <SeedphraseIcon />
              <div className="w-4/5 ml-4">{chrome.i18n.getMessage('confirmYourSecretPhrase')}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default NavBar