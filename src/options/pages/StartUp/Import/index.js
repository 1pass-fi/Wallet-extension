import React, { useMemo, useState } from 'react'

import EthereumLogo from 'img/startup/ethereum-logo.svg'
import FinnieLogo from 'img/startup/finnie-logo.svg'

import WalletType from '../shared/WalletType'
import ConfirmPassword from '../shared/ConfirmPassword'
import InputField from '../shared/InputField'
import Button from '../shared/Button'
import Success from '../shared/Success'
import Loading from '../shared/Loading'

import { backgroundRequest } from 'popup/backgroundRequest'

import './index.css'

export default () => {
  const [step, setStep] = useState(1)
  const [walletType, setWalletType] = useState('ARWEAVE')
  const [userSeedPhrase, setUserSeedPhrase] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const nextStep = () => {
    setStep(step + 1)
  }

  const onTypeSelect = (type) => {
    setWalletType(type)
    nextStep()
  }

  const onImportKey = async () => {
    // TODO: import key here
    setIsLoading(true)
    await backgroundRequest.gallery.updateJSONKeyfile({ key: userSeedPhrase, password })
    console.log({ password })
    console.log({ walletType })
    console.log({ userSeedPhrase })
    setIsLoading(false)
    nextStep()
  }

  if (step === 3) {
    return (
      <div className='create-wallet-wrapper'>
        <Success />
      </div>
    )
  }

  return (
    <div className='start-up'>
      <div className='import-wallet-wrapper'>
        {isLoading && <Loading />}
        <div className='import-wallet'>
          {step === 1 && (
          <>
            <div className='title'>Import a wallet with a recovery phrase</div>
            <div className='description'>
              What type of key are you importing?
            </div>
            <div className='wallet-types'>
              <WalletType
                icon={FinnieLogo}
                title={(props) => (
                  <div {...props}>
                    Koii Key&nbsp;<span>(Arweave)</span>
                  </div>
                )}
                selected={false}
                onClick={() => onTypeSelect('ARWEAVE')}
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
                selected={false}
                onClick={() => onTypeSelect('ETHEREUM')}
              />
            </div>
          </>
          )}

          {step === 2 && (
          <>
            <div className='title'>Get a new key</div>
            <div className='description'>
              Paste your seed phrase, then create a password for Finnie. Make
              sure your password is unique and secure.
            </div>

            <InputField
              label='12-word Recovery Phrase'
              placeholder='Paste your recovery phrase here'
              value={userSeedPhrase}
              setValue={setUserSeedPhrase}
            />

            <div className='confirm-password-wrapper'>
              <ConfirmPassword setPassword={setPassword} />
            </div>

            <Button
              disabled={!(password && userSeedPhrase)}
              className='import-key-button'
              onClick={onImportKey}
            >
              Import Key
            </Button>
          </>
          )}
        </div>
      </div>
    </div>
  )
}
