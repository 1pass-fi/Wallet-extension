import React, { useContext, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { URL } from 'constants/koiConstants'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'
import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top.svg'
import isEmpty from 'lodash/isEmpty'
import Button from 'options/components/Button'
import CheckBox from 'options/components/CheckBox'
import InputField from 'options/components/InputField'

import { VALIDATE_ERROR_MESSAGE } from '../../../../constants/koiConstants'
import { OnboardingContext } from '../onboardingContext'

const CreatePassword = ({ step, setStep }) => {
  const location = useLocation()
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isValidPassword,
    passwordErrorMessage,
    verifyPassword
  } = useContext(OnboardingContext)

  const [isAcceptTermService, setIsAcceptTermService] = useState(false)
  const [termServiceMessage, setTermServiceMessage] = useState('')

  const [wrongPasswordMessage, setWrongPasswordMessage] = useState('')
  const [isClickContinue, setIsClickContinue] = useState(false)

  const onboardingPath = useSelector((state) => state.onboarding.path)
  const accounts = useSelector((state) => state.accounts)

  const onClickContinue = async () => {
    if (!isEmpty(accounts)) {
      const isCorrectPassword = await verifyPassword()
      if (isCorrectPassword) {
        if (onboardingPath === '/create-wallet') {
          setStep(2)
        } else if (onboardingPath === '/import-wallet') {
          setStep(10)
        } else if (onboardingPath === '/upload-json') {
          setStep(13)
        } else {
          setStep(1)
        }
      } else {
        setWrongPasswordMessage(chrome.i18n.getMessage('incorrectPassword'))
      }
      return
    }

    if (!isAcceptTermService) {
      setTermServiceMessage(chrome.i18n.getMessage('pleaseAcceptTheTof'))
    } else {
      setTermServiceMessage('')
      if (isValidPassword) {
        setStep(step + 1)
      } else {
        setIsClickContinue(true)
      }
    }
  }

  const handleKeyDown = async (e) => {
    setIsClickContinue(false)
    if (e.keyCode === 13) {
      onClickContinue()
    }
  }

  console.log('location.pathname--------', location.pathname)

  return (
    <div
      data-testid="CreatePassword"
      className={clsx(
        'w-2/5 flex flex-col text-white self-start ml-23',
        location.pathname === '/upload-json' && 'ml-60'
      )}
      style={{ minWidth: '240px' }}
    >
      <WelcomeBackgroundTop className={clsx('welcome-bg-top')} />
      <WelcomeBackgroundBottom className={clsx('welcome-bg-bottom')} />
      <div className="font-normal text-base leading-6 text-left z-10">
        {isEmpty(accounts)
          ? chrome.i18n.getMessage('createAPasswordToSecureFinnie')
          : chrome.i18n.getMessage('reEnterYourFinniePassword')}
      </div>
      <InputField
        className="mt-5 z-10"
        label={
          isEmpty(accounts)
            ? chrome.i18n.getMessage('newPassword')
            : chrome.i18n.getMessage('password')
        }
        value={password}
        setValue={(e) => {
          setWrongPasswordMessage('')
          setPassword(e.target.value)
        }}
        required={true}
        name="password"
        errorFinnie={
          isEmpty(accounts) &&
          !isEmpty(password) &&
          isClickContinue &&
          (passwordErrorMessage === chrome.i18n.getMessage('passwordNotMeetRequirements') ||
            passwordErrorMessage === chrome.i18n.getMessage('notEnoughCharacters'))
            ? chrome.i18n.getMessage('securePasswordsHaveAtLeast8Characters')
            : !isEmpty(wrongPasswordMessage)
              ? wrongPasswordMessage
              : ''
        }
        placeholder=""
        uppercase={false}
        passwordFinnie={true}
        autoFocus={true}
        onKeyDown={(e) => handleKeyDown(e)}
        id={'new-password'}
        errorId={'error-new-password'}
      />
      {isEmpty(accounts) && (
        <InputField
          className="mt-7 z-10"
          label={chrome.i18n.getMessage('confirmPassword')}
          value={confirmPassword}
          setValue={(e) => setConfirmPassword(e.target.value)}
          required={true}
          name="password"
          placeholder=""
          errorFinnie={
            isClickContinue &&
            passwordErrorMessage === chrome.i18n.getMessage('passwordDoesNotMatch') &&
            passwordErrorMessage
          }
          uppercase={false}
          passwordFinnie={true}
          onKeyDown={(e) => handleKeyDown(e)}
          id={'confirm-password'}
          errorId={'error-confirm-password'}
        />
      )}
      {isEmpty(accounts) && (
        <div className="mt-5 flex items-center justify-center z-10">
          <CheckBox
            checked={isAcceptTermService}
            onClick={() => setIsAcceptTermService((prev) => !prev)}
            theme="dark"
            className="w-5 h-5"
            data-testid="new-password-tos"
            role="checkbox"
          />
          <div className="flex ml-2.25 font-normal text-sm leading-6 z-10">
            <div onClick={() => setIsAcceptTermService((prev) => !prev)}>
              {chrome.i18n.getMessage('iAgreeWithThe')}&nbsp;
            </div>
            <a
              target="_blank"
              href={URL.TERM_OF_SERVICE}
              className="text-turquoiseBlue underline"
              data-testid="tos-link"
            >
              {chrome.i18n.getMessage('termsOfService')}
            </a>
          </div>
        </div>
      )}
      <div
        data-testid="tos-error-message"
        className="text-red-finnie text-xs font-normal mt-2 text-center"
      >
        {termServiceMessage}
      </div>
      <Button
        style={{ width: '240px', height: '42px' }}
        className="mt-3.5 rounded mx-auto z-10"
        variant="white"
        text={chrome.i18n.getMessage('logIn')}
        onClick={() => onClickContinue()}
        id="log-in-button"
      />
    </div>
  )
}

export default CreatePassword
