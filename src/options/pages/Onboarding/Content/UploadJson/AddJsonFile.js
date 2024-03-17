import React, { useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import ReturnIcon from 'img/return-icon.svg'
import UploadIcon from 'img/upload-icon.svg'
// import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom-1.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top-1.svg'
import { setError } from 'options/actions/error'
import { setIsOnboarding, setOnboardingPath } from 'options/actions/onboardingProcessing'
import { popupAccount } from 'services/account'
import getJsonFromFile from 'utils/getJsonFromfile'

import { OnboardingContext } from '../../onboardingContext'


const AddJsonFile = ({ importType, step, setStep }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const { importFromJson } = useContext(OnboardingContext)
  const [file, setFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [totalAccount, setTotalAccount] = useState(null)

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0]?.type !== 'application/json') {
      return setErrorMessage(chrome.i18n.getMessage('onlyJsonFilesCanBeImported'))
    }
    setErrorMessage('')
    setFile(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const onConfirm = async () => {
    try {
      const fileType = file?.type
      if (fileType !== 'application/json') {
        return dispatch(setError('Invalid file'))
      }
      const jsonKey = await getJsonFromFile(file) 
  
      const address = await importFromJson(jsonKey, importType)
      if (address) setStep(step + 1)
    } catch (err) {
      console.error('upload json key failed', err)
      dispatch(setError(chrome.i18n.getMessage('somethingWentWrongWhoops')))
    }
  }

  useEffect(() => {
    const loadTotalAccount = async () => {
      const totalAccount = await popupAccount.count()
      setTotalAccount(totalAccount)
    }

    loadTotalAccount()
  }, [])

  return (
    <div className='w-full h-full flex flex-col items-center justify-center text-white'>
      <WelcomeBackgroundTop className={clsx('welcome-bg-top')} />
      {/* <WelcomeBackgroundBottom className={clsx('welcome-bg-bottom')} /> */}

      <div className='text-2xl font-semibold'>{chrome.i18n.getMessage('enterYourPassword')}</div>
      <div className='text-lg mt-5'>{chrome.i18n.getMessage('ifYouDontHaveASecretPhrase')}</div>
      <div {...getRootProps()} style={{width:'347px',height:'182px',borderRadius:'2px',backgroundColor:'#323261'}} className='flex flex-col items-center justify-center mt-5'>
        <UploadIcon />
        {!file ? 
          <div className='mt-4'>
            {isDragActive ? <div>Drop the files here...</div> :
              <div>
                <div>{chrome.i18n.getMessage('clickToAddAFile')}</div>
                <div>{chrome.i18n.getMessage('orDragAndDrop')}</div>
              </div>
            }
          </div> : 
          <div style={{maxWidth:'200px'}} className='mt-4 truncate'>{file?.name}</div>
        }

        <input {...getInputProps()}/>
      </div>
      <div className='text-warning-300 text-xs mt-5'>{errorMessage}</div>
      <button onClick={onConfirm} style={{width:'240px',height:'42px',backgroundColor:'#F5F5F5',borderRadius:'3px'}} className='text-indigo mt-5 text-base z-10'>Confirm</button>
      {totalAccount > 0 && <div onClick={() => {
        dispatch(setIsOnboarding(false))
        dispatch(setOnboardingPath(''))
        history.push('/settings/wallet')
      }} className='absolute bottom-10 right-8 underline text-lightBlue cursor-pointer z-10'>
        Go to Settings
      </div>}
      <div onClick={() => setStep(step - 1)} className='absolute top-5 left-5 cursor-pointer'><ReturnIcon /></div>
    </div>
  )
}

export default AddJsonFile
