import React, { useContext, useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CSVLink } from 'react-csv'
import passworder from 'browser-passworder'
import isEmpty from 'lodash/isEmpty'
import capitalize from 'lodash/capitalize'

import BackIcon from 'img/v2/back-icon-blue.svg'
import CloseIcon from 'img/v2/close-icon-blue.svg'
import EyeIcon from 'img/v2/eye-icon.svg'
import EyeIcon1 from 'img/v2/eye-icon-1.svg'
import NoticeIcon from 'img/v2/notice-icon.svg'
import CopyIcon from 'img/v2/copy-icon.svg'
import ImportIcon from 'img/v2/import-icon.svg'

import { GalleryContext } from 'options/galleryContext'
import Button from 'finnie-v2/components/Button'
import formatLongString from 'finnie-v2/utils/formatLongString'
import { popupAccount } from 'services/account'

const RecoveryPhraseModal = ({ account, close }) => {
  const modalRef = useRef(null)
  const { setError } = useContext(GalleryContext)

  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [password, setPassword] = useState('')
  const [seedPhrase, setSeedPhrase] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  const onGetRecoveryPhrase = async () => {
    try {
      setPasswordError('')
      const _account = await popupAccount.getAccount({ address: account.address })
      const encryptedSeedPhrase = await _account.get.seedPhrase()
      const seedPhrase = await passworder.decrypt(password, encryptedSeedPhrase)
      setSeedPhrase(seedPhrase)
      setStep(2)
    } catch (err) {
      if (err.message === 'Incorrect password') {
        setPasswordError(err.message)
      } else {
        setError(err.message)
      }
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-screen bg-black bg-opacity-25 fixed z-51 top-0 left-0">
      <div
        style={{ width: '510px' }}
        className="rounded bg-trueGray-100 flex flex-col items-center text-indigo"
        ref={modalRef}
      >
        <div className="flex h-16.75 rounded-t bg-trueGray-100 shadow-md w-full font-semibold text-xl tracking-finnieSpacing-wide relative">
          {step === 1 && (
            <BackIcon onClick={close} className="w-7 h-7 top-4 left-4 absolute cursor-pointer" />
          )}
          <div className="m-auto">Secret Phrase</div>
          <CloseIcon onClick={close} className="w-7 h-7 top-4 right-4 absolute cursor-pointer" />
        </div>

        {step === 1 && (
          <div className="mt-7.5 flex flex-col items-center justify-evenly">
            <div>
              <span className="font-bold text-lg text-indigo leading-6">
                {account.accountName} :
              </span>
              <span className="text-success-700 ml-2.75 text-lg leading-4 tracking-finnieSpacing-wide font-normal">
                {formatLongString(account.address, 22)}
              </span>
            </div>
            {/* <div className="mt-3 text-sm font-normal" style={{ width: '418px' }}>
              If you change browsers or switch computers, you will need this Secret Phrase to access
              your account.{' '}
              <span className="font-semibold">
                Never share this phrase and keep it somewhere safe.
              </span>
            </div> */}

            <div
              style={{ width: '382px' }}
              className="pl-1.75 mt-3 font-semibold text-sm leading-6"
            >
              Enter Finnie Password:
            </div>
            <div className="relative">
              <input
                style={{ width: '382px', height: '28px' }}
                type={showPassword ? 'text' : 'password'}
                className="text-base rounded-sm pl-2 pr-11 mt-1.5 bg-trueGray-400 bg-opacity-50 border-b border-indigo border-opacity-80 focus:text-success-700"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              {!showPassword ? (
                <EyeIcon
                  style={{ width: '29px', height: '18px' }}
                  className="absolute top-2.5 right-2.5 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <EyeIcon1
                  style={{ width: '29px', height: '22px' }}
                  className="absolute top-2 right-2.5 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>

            {!isEmpty(passwordError) && (
              <div
                style={{ width: '382px', height: '24px' }}
                className="pl-1.75 flex items-center mt-2 bg-warning rounded"
              >
                <NoticeIcon className="w-4.25" />
                <span className="ml-1.75">{passwordError}</span>
              </div>
            )}
            {/* : (
              <div style={{ width: '382px', height: '24px' }} className="mt-2"></div>
            ) */}

            <Button
              style={{ width: '239px', height: '39px' }}
              className="h-10 mt-5 text-base rounded w-43.75 mx-auto mb-5"
              variant="indigo"
              text="Done"
              onClick={() => onGetRecoveryPhrase()}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            {/* <div
              style={{ width: '462px' }}
              className="flex flex-wrap items-center justify-center rounded mt-8.5 bg-trueGray-400 bg-opacity-40 text-base font-normal tracking-finnieSpacing-wide text-indigo"
            >
              {seedPhrase
                ?.trim()
                ?.split(' ')
                .map((word, idx) => (
                  <div className="m-2" key={idx}>
                    {capitalize(word)}
                  </div>
                ))}
            </div> */}

            <div
              style={{ width: '347px', height: '182px' }}
              className="select-text mt-7.5 py-3.5 bg-blue-800 rounded-sm grid grid-flow-col grid-rows-6 font-normal text-sm text-white leading-6"
            >
              {seedPhrase
                ?.trim()
                ?.split(' ')
                .map((phrase, index) => {
                  return (
                    <div className="mx-7.5 my-auto flex" key={index}>
                      <div className="w-5 text-right mr-3">{index + 1}. </div>
                      <div>{phrase}</div>
                    </div>
                  )
                })}
            </div>

            {/* <div className="flex mt-6.25 mb-8">
              <CopyToClipboard text={seedPhrase}>
                <Button
                  style={{ width: '220px', height: '39px' }}
                  className="h-10 mt-5 text-base rounded w-43.75 mx-auto"
                  variant="inversedIndigo"
                  text={isCopied ? 'Copied!' : 'Copy Link'}
                  icon={CopyIcon}
                  onClick={() => setIsCopied(true)}
                />
              </CopyToClipboard>
              <CSVLink
                filename={`${account.accountName}_seedphrase.csv`}
                data={seedPhrase}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  style={{ width: '220px', height: '39px' }}
                  className="ml-5.25 h-10 mt-5 text-base rounded w-43.75 mx-auto"
                  variant="indigo"
                  text="Save as CSV File"
                  icon={ImportIcon}
                />
              </CSVLink>
            </div> */}

            <Button
              style={{ width: '239px', height: '39px' }}
              className="h-10 mt-5 text-base rounded w-43.75 mx-auto mb-5"
              variant="indigo"
              text="Done"
              onClick={close}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default RecoveryPhraseModal
