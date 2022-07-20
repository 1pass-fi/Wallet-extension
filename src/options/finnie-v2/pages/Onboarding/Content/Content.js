import React, { useContext, useState } from 'react'
import clsx from 'clsx'

import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'

import CreatePassword from './CreatePassword'
import AddAKey from './AddAKey'
import GetAKey from './GetAKey'
import PrepareSavePhrase from './PrepareSavePhrase'
import HiddenPhrase from './HiddenPhrase'
import InputPhrase from './InputPhrase'
import RevealPhrase from './RevealPhrase'

import ImportAKey from './ImportKey/ImportKey'
import ImportPhrase from './ImportKey/ImportPhrase'

import { OnboardingContext } from '../onboardingContext'
import { GalleryContext } from 'options/galleryContext'

import useValidPassword from '../hooks/useValidPassword'

import useMethod from '../hooks/useMethod'

const Content = ({ step, setStep }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phrase, setPhrase] = useState('')
  const [newSeedphrase, setNewSeedphrase] = useState('')
  const [network, setNetwork] = useState('')

  const [importType, setImportType] = useState(null)

  const { isValidPassword, passwordErrorMessage } = useValidPassword({ password, confirmPassword })

  const { generateNewKey, saveNewKey, verifyPassword, importFromSeedphrase } = useMethod({
    password,
    newSeedphrase,
    setNewSeedphrase
  })

  return (
    <OnboardingContext.Provider
      value={{
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        isValidPassword,
        passwordErrorMessage,
        newSeedphrase,
        setNewSeedphrase,
        generateNewKey,
        saveNewKey,
        verifyPassword,
        importFromSeedphrase,
        network,
        setNetwork
      }}
    >
      <div
        className={clsx(
          'w-2/3 h-full relative bg-gradient-to-r from-blue-300 to-indigo shadow-lg',
          'flex flex-col overflow-hidden',
          step > 1 ? 'pl-14 pt-20' : 'justify-center items-center'
        )}
      >
        {step > 1 && <KoiIcon className="w-18 h-18 absolute top-2.25 right-3.75" />}
        {step === 0 && <CreatePassword step={step} setStep={setStep} />}
        {step === 1 && <AddAKey step={step} setStep={setStep} setPhrase={setPhrase} />}
        {step === 2 && <GetAKey step={step} setStep={setStep} setImportType={setImportType} />}
        {step === 3 && <PrepareSavePhrase step={step} setStep={setStep} importType={importType} />}
        {step === 4 && (
          <HiddenPhrase step={step} setStep={setStep} phrase={phrase} importType={importType} />
        )}
        {step === 5 && (
          <InputPhrase step={step} setStep={setStep} phrase={phrase} importType={importType} />
        )}
        {step === 6 && <RevealPhrase step={step} />}

        {step === 10 && <ImportAKey step={step} setStep={setStep} setImportType={setImportType} />}
        {step === 11 && <ImportPhrase step={step} setStep={setStep} importType={importType} />}
        {step === 12 && <RevealPhrase step={step} />}
      </div>
    </OnboardingContext.Provider>
  )
}

export default Content
