import React, { useState, useContext, useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useSelector } from 'react-redux'

import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'

import Button from 'finnie-v2/components/Button'
import InputField from 'finnie-v2/components/InputField'
import CheckBox from 'finnie-v2/components/CheckBox'

import { URL } from 'constants/koiConstants'

import { OnboardingContext } from '../onboardingContext'

import { VALIDATE_ERROR_MESSAGE } from '../../../../../constants/koiConstants'

const CreatePassword = ({ step, setStep }) => {
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

  const accounts = useSelector((state) => state.accounts)

  const onClickContinue = async () => {
    if (!isEmpty(accounts)) {
      const isCorrectPassword = await verifyPassword()
      if (isCorrectPassword) {
        setStep(step + 1)
      } else {
        setWrongPasswordMessage('Incorrect password')
      }
      return
    }

    if (!isAcceptTermService) {
      setTermServiceMessage('Please accept the Terms of Service')
    } else {
      if (isValidPassword) setStep(step + 1)
    }
  }

  return (
    <div className="w-2/3 flex flex-col text-white self-start pl-23" style={{ width: '500px' }}>
      <WelcomeBackgroundTop className="absolute top-0 right-0" />
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <div className="font-normal text-base leading-6 text-left">
        {isEmpty(accounts)
          ? 'Create a password to secure Finnie.'
          : 'Re-enter your Finnie password so we can securely store your new key.'}
      </div>
      <InputField
        className="mt-5"
        label={isEmpty(accounts) ? 'New Password' : 'Password'}
        value={password}
        setValue={(e) => {
          setWrongPasswordMessage('')
          setPassword(e.target.value)
        }}
        required={true}
        name="password"
        description={
          isEmpty(accounts) && !isEmpty(password) && (passwordErrorMessage === VALIDATE_ERROR_MESSAGE.INVALID_CHARACTER || passwordErrorMessage === VALIDATE_ERROR_MESSAGE.NOT_ENOUGH_CHARACTERS) ? 'Secure passwords have at least 8 characters and include uppercase & lowercase letters, numbers, and special characters (e.g. !@#$%).' : ''}
        placeholder=""
        uppercase={false}
        passwordFinnie={true}
      />
      {isEmpty(accounts) && (
        <InputField
          className="mt-7"
          label="Confirm Password"
          value={confirmPassword}
          setValue={(e) => setConfirmPassword(e.target.value)}
          required={true}
          name="password"
          placeholder=""
          errorFinnie={
            passwordErrorMessage === VALIDATE_ERROR_MESSAGE.NOT_MATCH && passwordErrorMessage
          }
          uppercase={false}
          passwordFinnie={true}
        />
      )}
      {isEmpty(accounts) && (
        <div className="mt-5 flex items-center justify-center">
          <CheckBox
            checked={isAcceptTermService}
            onClick={() => setIsAcceptTermService((prev) => !prev)}
            theme="dark"
            className="w-5 h-5"
          />
          <div className="flex ml-2.25 font-normal text-sm leading-6">
            <div onClick={() => setIsAcceptTermService((prev) => !prev)}>
              I agree with the&nbsp;
            </div>
            <a target="_blank" href={URL.TERM_OF_SERVICE} className="text-turquoiseBlue underline">
              Terms of Service
            </a>
          </div>
        </div>
      )}
      <div className="text-red-finnie text-xs font-normal mt-2 text-center">
        {termServiceMessage}
      </div>
      <Button
        style={{ width: '240px', height: '42px' }}
        className="mt-3.5 text-base rounded mx-auto z-10"
        variant="white"
        text="Log In"
        disabled={!isValidPassword && isEmpty(accounts)}
        onClick={onClickContinue}
      />
    </div>
  )
}

export default CreatePassword
