import React, { useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import isEqual from 'lodash/isEqual'
import shuffle from 'lodash/shuffle'

import EthereumLogo from 'img/startup/ethereum-logo.svg'
import FinnieLogo from 'img/startup/finnie-logo.svg'
import DangerousIcon from 'img/startup/dangerous-icon.svg'
import LockIcon from 'img/startup/lock-icon.svg'
import ShareIcon from 'img/startup/share-icon.svg'

import WalletType from '../shared/WalletType'
import Success from '../shared/Success'
import Button from '../shared/Button'
import ConfirmPassword from '../shared/ConfirmPassword'
import Loading from '../shared/Loading'

import { backgroundRequest } from 'popup/backgroundRequest'

import './index.css'
import { TYPE } from 'account/accountConstants'

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
  const [step, setStep] = useState(1)
  const [walletType, setWalletType] = useState('ARWEAVE')
  const [seedPhrase, setSeedPhrase] = useState(mockPhrase)
  const [isHideSeedPhrase, setIsHideSeedPhrase] = useState(true)
  const [password, setPassword] = useState('')
  const [selectedWords, setSelectedWords] = useState([])
  const [unselectedWords, setUnselectedWords] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const nextStep = () => {
    setStep(step + 1)
  }

  const generateSeedPhare = async () => {
    // TODO: GeneratePhrase
    await setIsLoading(true)
    /* 
      Expected to receive an array of 12 words phrase. ['summer', 'vacation',...]
    */
    const phrase = await backgroundRequest.gallery.generateNewWallet({ walletType: TYPE.ARWEAVE })
    console.log('phrase', phrase)
    setSeedPhrase(phrase)
    setUnselectedWords(
      shuffle(phrase).map((content, id) => ({
        id,
        content,
        isHide: false,
      }))
    )
    await setIsLoading(false)
    nextStep()
  }

  const handleCreateKey = async () => {
    // TODO: Create Key
    await backgroundRequest.gallery.saveWallet({ password })
    console.log({ walletType })
    console.log({ userSeedPhrase: userSeedPhrase.join(' ') })
    console.log({ password })
    nextStep()
  }

  const gotoPasswordConfirm = () => {
    setStep(4)
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

  if (step === 5) {
    return (
      <div className='create-wallet-wrapper'>
        <Success />
      </div>
    )
  }
  console.log(unselectedWords)
  return (
    <div className='start-up'>
      <div className='create-wallet-wrapper'>
        {isLoading && <Loading />}
        <div className='create-wallet'>
          <div className='title'>Get a new key</div>
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
                selected={walletType === 'ARWEAVE'}
                onClick={() => setWalletType('ARWEAVE')}
              />

              <WalletType
                icon={EthereumLogo}
                title={(props) => <div {...props}>Ethereum Key</div>}
                description={(props) => (
                  <div {...props}>
                    Ethereum keys are great for&nbsp;
                    <span>cross-chain transactions</span>.
                  </div>
                )}
                selected={walletType === 'ETHEREUM'}
                onClick={() => setWalletType('ETHEREUM')}
              />
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

          {(step === 2 || step === 3) && (
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

          {step === 2 && (
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
                  disabled={isHideSeedPhrase}
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

          {step === 3 && (
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

          {step === 4 && (
          <>
            <div className='description'>
              Create a password for Finnie, so you have easy access to your new
              key. Make sure it is unique and secure.
            </div>
            <div className='confirm-password-wrapper'>
              <ConfirmPassword setPassword={setPassword} />
            </div>
            <Button
              onClick={handleCreateKey}
              disabled={!password}
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
