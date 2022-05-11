import React, { useContext, useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import isEqual from 'lodash/isEqual'
import shuffle from 'lodash/shuffle'

import EthereumLogo from 'img/startup/ethereum-logo.svg'
import FinnieLogo from 'img/startup/finnie-logo.svg'
import DangerousIcon from 'img/startup/dangerous-icon.svg'
import LockIcon from 'img/startup/lock-icon.svg'
import ShareIcon from 'img/startup/share-icon.svg'

import WalletType from '../shared/WalletType'
import Button from '../shared/Button'
import ConfirmPassword from '../shared/ConfirmPassword'
import InputPassword from '../shared/InputPassword'
import Loading from '../shared/Loading'
import GoBackBtn from 'options/finnie-v1/components/GoBackButton'
import { SHOW_ETHEREUM } from 'constants/koiConstants'

import isEmpty from 'lodash/isEmpty'

import useEthereumNetworks from '../shared/useEthereumNetworks'

import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { addAccountByAddress } from 'options/actions/accounts'

import './index.css'
import { TYPE } from 'constants/accountConstants'
import { GalleryContext } from 'options/galleryContext'
import { popupAccount } from 'services/account'
import storage from 'services/storage'

const mockPhrase = [
  'program',
  'honey',
  'gym',
  'never',
  'cheap',
  'glance',
  'always',
  'come',
  'zebra',
  'slogan',
  'winner',
  'summer',
]

export default () => {
  let { selectedNetwork, EthereumNetworks } = useEthereumNetworks({})

  const { setError, setImportedAddress, setNewAddress, setActivatedChain } = useContext(GalleryContext)

  const [step, setStep] = useState(1)
  const [walletType, setWalletType] = useState(null)
  const [seedPhrase, setSeedPhrase] = useState(mockPhrase)
  const [isHideSeedPhrase, setIsHideSeedPhrase] = useState(true)
  const [password, setPassword] = useState('')
  const [selectedWords, setSelectedWords] = useState([])
  const [unselectedWords, setUnselectedWords] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFormError, setShowFormError] = useState(false)

  const dispatch = useDispatch()
  const accounts = useSelector(state => state.accounts)

  const history = useHistory()

  const nextStep = () => {
    setStep(step + 1)
  }

  const previousStep = () => {
    setShowFormError(false)
    if (step === 1) {
      history.push('/')
    // } else if (step === 3 && walletType === TYPE.ARWEAVE) {
    } else if (step === 3) {
      setStep(1)
    } else if (step === 5){
      setStep(3)
    } else if (step === 6) {
      setStep(1)
    } else {
      setStep(prev => prev - 1)
    }
  }

  /* 
    Generate 12 words phrase for new wallet.
  */
  const generateSeedPhare = async () => {
    await setIsLoading(true)
    /* 
      Expected to receive an array of 12 words phrase. ['summer', 'vacation',...]
    */
    const phrase = await backgroundRequest.gallery.generateNewWallet({ walletType })
    setSeedPhrase(phrase)
    setUnselectedWords(
      shuffle(phrase).map((content, id) => ({
        id,
        content,
        isHide: false,
      }))
    )
    await setIsLoading(false)

    // if (walletType == TYPE.ARWEAVE) {
    //   setStep(3)
    // } else {
    //   nextStep()
    // }

    setStep(3)
  }

  /* 
    Save created account to the storage.
  */
  const handleCreateKey = async () => {
    if(!password && isEmpty(accounts)) {
      setShowFormError(true)
      return
    }
    try {
      if (walletType === TYPE.ARWEAVE) selectedNetwork = null
      if (walletType === TYPE.ETHEREUM) selectedNetwork = 'Rinkeby Test Network'

      const address = await backgroundRequest.gallery.saveWallet({ password, provider: selectedNetwork })

      /* 
        Set activated chain if this wallet is the first imported wallet
      */
      const totalAccount = await popupAccount.count()
      if (totalAccount === 1) {
        await storage.setting.set.activatedChain(walletType)
        setActivatedChain(walletType)
      }

      setImportedAddress(address)
      setNewAddress(address)
      dispatch(addAccountByAddress(address))

      history.push({
        pathname: '/success',
        state: 'create-key-state'
      })
    } catch (err) {
      console.log(err.message)
      setError(err.message)
    }
  }

  const gotoPasswordConfirm = () => {
    setStep(5)
  }

  const removeWord = (word) => {
    setUnselectedWords(
      unselectedWords.map(({ id, content, isHide }) => ({
        id,
        content,
        isHide: id === word.id ? false : isHide,
      }))
    )
    setSelectedWords(
      selectedWords.filter((selectedWord) => selectedWord.id !== word.id)
    )
  }

  const addWord = (word) => {
    setSelectedWords([...selectedWords, word])
    setUnselectedWords(
      unselectedWords.map(({ id, content, isHide }) => ({
        id,
        content,
        isHide: id === word.id ? true : isHide,
      }))
    )
  }

  const userSeedPhrase = useMemo(
    () => selectedWords.map(({ content }) => content),
    [selectedWords]
  )

  const onMatchSeedPhrase = () => {
    // TODO: do something
    nextStep()
  }

  useEffect(() => {
    if (step !== 3) setIsHideSeedPhrase(true)
  }, [step])

  return (
    <div className='start-up'>
      <div className='create-wallet-wrapper'>
        {isLoading && <Loading />}
        <div className='create-wallet'>
          {step !== 6 && <div className='title'>Get a new key</div>}
          {step !== 6 && <GoBackBtn goToPreviousStep={previousStep} />}
          {step === 1 && (
          <>
            {/* <div className='description'>What type of key do you need?</div> */}
            <div className='wallet-types'>
              <WalletType
                icon={FinnieLogo}
                title={(props) => (
                  <div {...props}>
                    Koii Key&nbsp;<span>(Arweave)</span>
                  </div>
                )}
                description={(props) => (
                  <div {...props}>
                    If you’re brand new and not sure what you need,&nbsp;
                    <span>start here</span>.
                  </div>
                )}
                selected={walletType === TYPE.ARWEAVE}
                onClick={() => setWalletType(TYPE.ARWEAVE)}
              />

              {SHOW_ETHEREUM && <WalletType
                icon={EthereumLogo}
                title={(props) => <div {...props}>Ethereum Key</div>}
                description={(props) => (
                  <div {...props}>
                    Ethereum keys are great for&nbsp;
                    <span>cross-chain transactions</span>.
                  </div>
                )}
                selected={walletType === TYPE.ETHEREUM}
                onClick={() => setWalletType(TYPE.ETHEREUM)}
              />}
            </div>
            <button
              disabled={!walletType}
              className='create-key-button'
              onClick={generateSeedPhare}
            >
              Create Key
            </button>
          </>
          )}

          {/* {step === 2 && <EthereumNetworks onSubmit={nextStep} />} */}

          {(step === 3 || step === 4) && (
          <>
            <div className='description'>
              Store your recovery phrase somewhere safe. This phrase makes it
              easy to restore your account.
            </div>

            <div className='warning'>
              <DangerousIcon />
              <div className='warning-text'>
                Never disclose your recovery phrase. Anyone with this phrase can
                steal from your wallet.
              </div>
            </div>
          </>
          )}

          {step === 3 && (
          <>
            <div className='seed-phrase-wrapper'>
              {isHideSeedPhrase ? (
                <div
                  className='hide-seedphrase'
                  onClick={() => setIsHideSeedPhrase(false)}
                >
                  <LockIcon />
                  <div>Click to reveal secret words.</div>
                </div>
              ) : (
                <>
                  <div className='seed-phrase-text'>{seedPhrase.join(' ')}</div>
                  <CopyToClipboard text={seedPhrase.join(' ')}>
                    <div className='copy-phrase'>
                      copy phrase&nbsp;
                      <ShareIcon />
                    </div>
                  </CopyToClipboard>
                </>
              )}
            </div>

            <div className='buttons'>
              <Button onClick={nextStep} disabled={isHideSeedPhrase}>
                Continue
              </Button>
              <div className='danger-button-wrapper'>
                <Button
                  className='danger'
                  onClick={gotoPasswordConfirm}
                >
                  Skip
                </Button>
                <div className='danger-skip-text'>
                  If I change devices without my recovery phrase, I may lose
                  access to my key.
                </div>
              </div>
            </div>
          </>
          )}

          {step === 4 && (
          <>
            <div className='selected-words-wrapper'>
              <div className='selected-words'>
                {selectedWords.map(({ id, content }) => (
                  <button
                    key={id}
                    className='word'
                    onClick={() => removeWord({ id, content })}
                  >
                    {content}
                  </button>
                ))}
              </div>
            </div>
            {!isEqual(seedPhrase, userSeedPhrase) && userSeedPhrase.length === 12 && 
              <div className='confirm-phrase-error-message'>
                That recovery phrase doesn't match. Please check the order and try again.
              </div>
            }

            <div className='unselected-words'>
              {unselectedWords.map(({ id, content, isHide }) => (
                <button
                  disabled={isHide}
                  key={id}
                  className='word'
                  onClick={() => addWord({ id, content })}
                >
                  {content}
                </button>
              ))}
            </div>

            <div className='buttons'>
              <Button
                onClick={onMatchSeedPhrase}
                disabled={!isEqual(seedPhrase, userSeedPhrase)}
              >
                Continue
              </Button>
              <div className='danger-button-wrapper'>
                <Button className='danger' onClick={gotoPasswordConfirm}>
                  Skip
                </Button>
                <div className='danger-skip-text'>
                  If I change devices without my recovery phrase, I may lose
                  access to my key.
                </div>
              </div>
            </div>
          </>
          )}

          {step === 5 && (
          <>
            <div className='description'>
              {isEmpty(accounts) ? 
                'Create a password for Finnie, so you have easy access to your new key. Make sure it is unique and secure.'
                : 'Re-enter your Finnie password so we can securely store your new key.'
              }
            </div>

            {isEmpty(accounts) ? <div className='confirm-password-wrapper'>
              <ConfirmPassword setPassword={setPassword} showError={showFormError}/>
            </div>
              :
              <div className='confirm-password-wrapper'>
                <InputPassword setPassword={setPassword} />
              </div>
            }

            <Button
              onClick={handleCreateKey}
              className='create-key-button'
            >
              Create Key
            </Button>
          </>
          )}

        </div>
      </div>
    </div>
  )
}
