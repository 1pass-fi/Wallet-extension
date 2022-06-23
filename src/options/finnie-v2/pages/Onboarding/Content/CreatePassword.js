import React, { useState, useContext } from 'react'

import WelcomeBackgroundTop from 'img/v2/onboarding/welcome-background-top.svg'
import WelcomeBackgroundBottom from 'img/v2/onboarding/welcome-background-bottom.svg'

import Button from 'finnie-v2/components/Button'
import InputField from 'finnie-v2/components/InputField'
import CheckBox from 'finnie-v2/components/CheckBox'

import { URL } from 'constants/koiConstants'

import { OnboardingContext } from '../onboardingContext'

const CreatePassword = ({ step, setStep }) => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isValidPassword,
    passwordErrorMessage
  } = useContext(OnboardingContext)

  const [isAcceptTermService, setIsAcceptTermService] = useState(false)

  return (
    <div className="w-2/3 flex flex-col text-white">
      <WelcomeBackgroundTop className="absolute top-0 right-0" />
      <WelcomeBackgroundBottom className="absolute bottom-0 left-0" />
      <div className="font-normal text-base leading-6 text-left" style={{ width: '265px' }}>
        Create a password to secure Finnie.
      </div>
      <InputField
        className="my-5 h-5.25"
        label="New Password"
        value={password}
        setValue={(e) => setPassword(e.target.value)}
        required={true}
        name="password"
        description="Secure passwords have at least 8 characters and include uppercase & lowercase letters, numbers, and special characters (e.g. !@#$%)."
        placeholder=""
        uppercase={false}
        password={true}
      />
      <InputField
        className="my-12 h-5.25"
        label="Confirm Password"
        value={confirmPassword}
        setValue={(e) => setConfirmPassword(e.target.value)}
        required={true}
        name="password"
        placeholder=""
        // description="Passwords do not match"
        uppercase={false}
        password={true}
      />
      <div className="flex items-center justify-center">
        <CheckBox
          checked={isAcceptTermService}
          onClick={() => setIsAcceptTermService((prev) => !prev)}
          theme="dark"
          className="w-5 h-5"
        />
        <div className="w-full flex ml-2.25">
          <div onClick={() => setIsAcceptTermService((prev) => !prev)}>I agree with the&nbsp;</div>
          <a target="_blank" href={URL.TERM_OF_SERVICE} className="text-success underline">
            Terms of Service
          </a>
        </div>
        <div>{passwordErrorMessage}</div>
      </div>
      <Button
        style={{ width: '240px', height: '42px' }}
        className="mt-6 text-base rounded mx-auto z-10"
        variant="white"
        text="Log In"
        onClick={() => setStep(step + 1)}
      />
    </div>
  )
}

export default CreatePassword
