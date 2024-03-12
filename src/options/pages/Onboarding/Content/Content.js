import React, { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom'
import clsx from 'clsx'
import KoiIcon from 'img/v2/onboarding/finnie-koii-logo.svg'

import useMethod from '../hooks/useMethod'
import useValidPassword from '../hooks/useValidPassword'
import { OnboardingContext } from '../onboardingContext'

import ImportAKey from './ImportKey/ImportKey'
import ImportPhrase from './ImportKey/ImportPhrase'
import AddJsonFile from './UploadJson/AddJsonFile'
import ChooseNetwork from './UploadJson/ChooseNetwork'
import UploadJsonSuccess from './UploadJson/UploadJsonSuccess'
import AddAKey from './AddAKey'
import CreatePassword from './CreatePassword'
import GetAKey from './GetAKey'
import HiddenPhrase from './HiddenPhrase'
import InputPhrase from './InputPhrase'
import PrepareSavePhrase from './PrepareSavePhrase'
import RevealPhrase from './RevealPhrase'

const Content = ({ step, setStep, path }) => {
  const location = useLocation()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phrase, setPhrase] = useState('')
  const [newSeedphrase, setNewSeedphrase] = useState('')
  const [network, setNetwork] = useState('')
  const [skipPhrase, setSkipPhrase] = useState(false)

  const [importType, setImportType] = useState(null)

  const { isValidPassword, passwordErrorMessage } = useValidPassword({ password, confirmPassword })

  const { generateNewKey, saveNewKey, verifyPassword, importFromSeedphrase, importFromJson } = useMethod({
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
        importFromJson,
        network,
        setNetwork,
        skipPhrase,
        setSkipPhrase,
      }}
    >
      <div
        className={clsx(
          'w-2/3 h-full relative bg-gradient-to-r from-blue-300 to-indigo shadow-lg',
          'flex flex-col overflow-x-hidden overflow-y-scroll',
          step > 1 ? (location.pathname !== '/upload-json' && 'pl-14 pt-20') : 'justify-center items-center',
          (location.pathname === '/upload-json' || step >=13) && 'w-full items-center justify-center pl-0 pt-0'
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
        {step === 13 && <ChooseNetwork step={step} setStep={setStep} setImportType={setImportType}/>}
        {step === 14 && <AddJsonFile step={step} setStep={setStep} importType={importType}/>}
        {step === 15 && <UploadJsonSuccess />}
      </div>
    </OnboardingContext.Provider>
  )
}

export default Content
