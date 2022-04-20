import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import EthereumLogo from 'img/startup/ethereum-logo.svg'
import FinnieLogo from 'img/startup/finnie-logo.svg'

import WalletType from '../shared/WalletType'
import ConfirmPassword from '../shared/ConfirmPassword'
import InputSeedPhraseField from '../shared/InputSeedPhraseField'
import InputNonKoiiSeedPhraseField from '../shared/InputNonKoiiSeedPhraseField'
import InputPrivateKeyField from '../shared/InputPrivateKeyField'
import Button from '../shared/Button'
import Loading from '../shared/Loading'
import useEthereumNetworks from '../shared/useEthereumNetworks'
import { GalleryContext } from 'options/galleryContext'
import InputPassword from '../shared/InputPassword'
import GoBackBtn from 'options/finnie-v1/components/GoBackButton'
import { SHOW_ETHEREUM } from 'constants/koiConstants'
import HasTwelveSeedPhrase from 'options/modal/HasTwelveSeedPhrase'

import isEmpty from 'lodash/isEmpty'

import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

import { TYPE } from 'constants/accountConstants'
import { addAccountByAddress } from 'options/actions/accounts'

import './index.css'

export default () => {
  const [step, setStep] = useState(1)
  const [walletType, setWalletType] = useState(null)
  const [userSeedPhrase, setUserSeedPhrase] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [seedPhraseError, setSeedPhraseError] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFormError, setShowFormError] = useState(false)
  const history = useHistory()
  const [isKoiiPhrase, setIsKoiiPhrase] = useState(true)
  const [isSeedPhrase, setIsSeedPhrase] = useState(true)

  const dispatch = useDispatch()
  const accounts = useSelector(state => state.accounts)

  const { setError, setImportedAddress, setNewAddress } = useContext(GalleryContext)
  let { selectedNetwork, EthereumNetworks } = useEthereumNetworks({
    title: () => <div className='title'>Import Ethereum Key</div>,
    description: () => <div className='description'>Choose your Network.</div>,
  })
  const nextStep = () => {
    setStep(step + 1)
  }
  const previousStep = () => {
    setShowFormError(false)
    if (step === 1) {
      history.push('/')
    } else setStep(1)
    // else if (step === 3 && walletType === TYPE.ARWEAVE) {
    //   setStep(1)
    // } else {
    //   setStep(step - 1)
    // }
  }

  const onTypeSelect = (type) => {
    setWalletType(type)

    // if a user re-selects Wallet Type, set isSeedPhrase to TRUE to ensure that the Private Key is not displayed on import Arweave wallet.
    setIsSeedPhrase(true)
    // if (type === TYPE.ARWEAVE) {
    //   setStep(3)
    // } else {
    //   nextStep()
    // }

    setStep(3)
  }

  const [showHasTwelveSeedPhrase, setShowHasTwelveSeedPhrase] = useState(false)

  useEffect(() => {
    if (showHasTwelveSeedPhrase) {
      const timer = setTimeout(() => setShowHasTwelveSeedPhrase(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [showHasTwelveSeedPhrase])

  const onImportSeedPhrase = async () => {
    if (isSeedPhrase) {
      if (!userSeedPhrase && isEmpty(accounts)) {
        setShowFormError(true)
        return
      }
      const hasTwelveWords = userSeedPhrase?.trim()?.split(' ').length === 12
      if (!hasTwelveWords) {
        setShowHasTwelveSeedPhrase(true)
        return
      }
    } else {
      const isPrivateKey = privateKey?.trim()?.split(' ').length === 1
      if (!isPrivateKey) {
        setShowHasTwelveSeedPhrase(true)
        return
      }
    }
    nextStep()
  }

  const onImportKey = async () => {
    const keyImport = isSeedPhrase ? userSeedPhrase : privateKey
    if (!password && isEmpty(accounts)) {
      setShowFormError(true)
      return
    }

    setIsLoading(true)
    try {
      if (walletType === TYPE.ARWEAVE) selectedNetwork = null
      if (walletType === TYPE.ETHEREUM) selectedNetwork = 'Rinkeby Test Network'

      const address = await backgroundRequest.gallery.uploadJSONKeyFile({
        key: keyImport,
        password,
        type: walletType,
        provider: selectedNetwork,
      })
      setImportedAddress(address)
      setNewAddress(address)
      dispatch(addAccountByAddress(address))

      history.push({
        pathname: '/success',
        state: 'import-key-state',
      })
    } catch (err) {
      setError(err.message)
    }
    setIsLoading(false)
  }

  return (
    <div className='start-up'>
      <div className='import-wallet-wrapper'>
        {isLoading && <Loading />}
        <div className='import-wallet'>
          <GoBackBtn goToPreviousStep={previousStep} />
          {step === 1 && (
            <>
              <div className='title'>Import a wallet with a recovery phrase</div>
              <div className='description'>What type of key are you importing?</div>
              <div className='wallet-types'>
                <WalletType
                  icon={FinnieLogo}
                  title={(props) => (
                    <div {...props}>
                      Koii Key&nbsp;<span>(Arweave)</span>
                    </div>
                  )}
                  selected={false}
                  onClick={() => onTypeSelect(TYPE.ARWEAVE)}
                />
                {SHOW_ETHEREUM && (
                  <WalletType
                    icon={EthereumLogo}
                    title={(props) => <div {...props}>Ethereum Key</div>}
                    description={(props) => (
                      <div {...props}>
                        Ethereum keys are great for&nbsp;
                        <span>cross-chain transactions</span>.
                      </div>
                    )}
                    selected={false}
                    onClick={() => onTypeSelect(TYPE.ETHEREUM)}
                  />
                )}
              </div>
            </>
          )}

          {step === 2 && <EthereumNetworks onSubmit={nextStep} />}

          {step === 3 && (
            <>
              <div className='title'>Import a wallet</div>
              <div className='description'>
                {isSeedPhrase ? (
                  <>
                    Paste your seed phrase, then create a password for Finnie. Make sure your
                    password is unique and secure.
                  </>
                ) : (
                  <>
                    Import your private key, then create a password for Finnie. Make sure your
                    password is unique and secure.
                  </>
                )}
              </div>
              {isKoiiPhrase && isSeedPhrase && (
                <InputSeedPhraseField
                  label='12-word Recovery Phrase'
                  userSeedPhrase={userSeedPhrase}
                  setUserSeedPhrase={setUserSeedPhrase}
                  seedPhraseError={seedPhraseError}
                  setSeedPhraseError={setSeedPhraseError}
                  walletType={walletType}
                  setIsSeedPhrase={setIsSeedPhrase}
                />
              )}

              {!isKoiiPhrase && isSeedPhrase && (
                <InputNonKoiiSeedPhraseField
                  label='Non-KOII Recovery Phrase'
                  value={userSeedPhrase}
                  setValue={setUserSeedPhrase}
                  placeholder='Paste your recovery phrase here'
                  walletType={walletType}
                  setIsSeedPhrase={setIsSeedPhrase}
                />
              )}

              {!isSeedPhrase && walletType === TYPE.ETHEREUM && (
                <InputPrivateKeyField
                  label='Import your private key'
                  placeholder='Copy & paste your private key here.'
                  setIsSeedPhrase={setIsSeedPhrase}
                  value={privateKey}
                  setValue={setPrivateKey}
                />
              )}

              {/*
               * Allow to Import when:
               * - Seed Phrase / Private Key is not empty.
               * - validate Seed phrase success in case 12-words Koii seed phrase
               */}
              <Button
                disabled={
                  (isSeedPhrase && isEmpty(userSeedPhrase)) ||
                  (!isSeedPhrase && isEmpty(privateKey)) ||
                  (isKoiiPhrase && isSeedPhrase && !isEmpty(seedPhraseError))
                }
                className='seed-phrase-button'
                onClick={onImportSeedPhrase}
              >
                Continue
              </Button>
              {isSeedPhrase && (
                <span
                  onClick={() => {
                    setIsKoiiPhrase(!isKoiiPhrase)
                    setIsSeedPhrase(true)
                    setUserSeedPhrase('')
                    setSeedPhraseError('')
                  }}
                  className='non-koii-phrase'
                >
                  {isKoiiPhrase
                    ? 'I have a non-Koii recovery phrase.'
                    : 'I have a Koii recovery phrase.'}
                </span>
              )}
              {showHasTwelveSeedPhrase && <HasTwelveSeedPhrase isSeedPhrase={isSeedPhrase} />}
            </>
          )}

          {step === 4 && (
            <>
              <div className='title'>Import a wallet</div>
              <div className='description'>
                {isEmpty(accounts) ? 
                  'Create a password for Finnie, so you have easy access to your new key. Make sure it is unique and secure.'
                  : 'Re-enter your Finnie password so we can securely store your new key.'
                }
              </div>

              {isEmpty(accounts) ? (
                <div className='confirm-password-wrapper'>
                  <ConfirmPassword setPassword={setPassword} showError={showFormError} />
                </div>
              ) : (
                <div className='confirm-password-wrapper'>
                  <InputPassword setPassword={setPassword} />
                </div>
              )}

              <Button className='import-key-button' onClick={onImportKey}>
                Import Key
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
